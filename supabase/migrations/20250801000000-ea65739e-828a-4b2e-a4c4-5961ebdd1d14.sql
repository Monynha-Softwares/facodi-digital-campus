-- PHASE 1: Fix Profile Creation and RLS

-- Create a function to automatically create a profile when a user registers
CREATE OR REPLACE FUNCTION public.create_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name' || NEW.email, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function
CREATE TRIGGER create_profile_for_new_user
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_new_user_profile();

-- Fix RLS Policy for Profiles
CREATE OR REPLACE FUNCTION public.is_profile_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = (SELECT user_id FROM public.profiles WHERE id = current_setting('request.jwt.claims', true)::jsonb->>'profile_id');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Implement RLS Policy
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by user" ON public.profiles;
CREATE POLICY "Profiles are viewable by user" ON public.profiles
    FOR ALL USING (public.is_profile_owner());

-- PHASE 2: Implement Blog Comments System

-- Create Blog Comments Table
CREATE TABLE public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.blog_comments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view comments" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON public.blog_comments 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own comments" ON public.blog_comments 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.blog_comments 
    FOR DELETE USING (auth.uid() = user_id);

-- PHASE 3: Normalize Tags System

-- Enhance Tags Table
ALTER TABLE public.tags ADD COLUMN description TEXT;
ALTER TABLE public.tags ADD COLUMN category TEXT;

-- Create a more robust repository_tags view
CREATE OR REPLACE VIEW public.repository_tag_details AS
SELECT 
    rt.repository_id, 
    r.name as repository_name,
    rt.tag_id, 
    t.name as tag_name,
    t.slug as tag_slug,
    t.category as tag_category
FROM 
    public.repository_tags rt
JOIN 
    public.repositories r ON rt.repository_id = r.id
JOIN 
    public.tags t ON rt.tag_id = t.id;

-- Create a function to manage tags more efficiently
CREATE OR REPLACE FUNCTION public.add_repository_tag(
    p_repository_name TEXT, 
    p_tag_name TEXT, 
    p_tag_category TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE 
    v_repository_id UUID;
    v_tag_id INT;
BEGIN
    -- Find or create repository
    SELECT id INTO v_repository_id FROM public.repositories WHERE name = p_repository_name;
    
    -- Find or create tag
    INSERT INTO public.tags (name, slug, category)
    VALUES (p_tag_name, lower(replace(p_tag_name, ' ', '-')), p_tag_category)
    ON CONFLICT (name) DO UPDATE SET category = COALESCE(p_tag_category, tags.category)
    RETURNING id INTO v_tag_id;
    
    -- Add repository tag if not exists
    INSERT INTO public.repository_tags (repository_id, tag_id)
    VALUES (v_repository_id, v_tag_id)
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- PHASE 4: Improve Analytics Tracking

-- Enhance Analytics Events
ALTER TABLE public.analytics_events 
ADD COLUMN session_id TEXT,
ADD COLUMN page_url TEXT,
ADD COLUMN browser TEXT,
ADD COLUMN device_type TEXT;

-- Create a function to log page views
CREATE OR REPLACE FUNCTION public.log_page_view(
    p_user_id UUID DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL,
    p_browser TEXT DEFAULT NULL,
    p_device_type TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.analytics_events (
        user_id, 
        event_type, 
        payload,
        page_url,
        browser,
        device_type
    ) VALUES (
        p_user_id,
        'page_view',
        jsonb_build_object(
            'page_url', p_page_url,
            'browser', p_browser,
            'device_type', p_device_type
        ),
        p_page_url,
        p_browser,
        p_device_type
    );
END;
$$ LANGUAGE plpgsql;

-- PHASE 5: SEO and Metadata Improvements

-- Add SEO metadata to blog posts
ALTER TABLE public.blog_posts 
ADD COLUMN meta_description TEXT,
ADD COLUMN keywords TEXT[],
ADD COLUMN canonical_url TEXT;

-- Add SEO metadata to solutions
ALTER TABLE public.solutions 
ADD COLUMN meta_description TEXT,
ADD COLUMN keywords TEXT[],
ADD COLUMN canonical_url TEXT;

