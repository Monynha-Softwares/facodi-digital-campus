
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye } from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  details?: Record<string, any>;
}

export function SecurityMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from a security events table
    // For now, we'll simulate some security monitoring
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        event_type: 'RATE_LIMIT_EXCEEDED',
        user_id: null,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...',
        created_at: new Date().toISOString(),
        details: { endpoint: '/api/comments', attempts: 10 }
      }
    ];
    
    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const getEventSeverity = (eventType: string) => {
    switch (eventType) {
      case 'RATE_LIMIT_EXCEEDED':
        return 'warning';
      case 'FAILED_LOGIN_ATTEMPTS':
        return 'destructive';
      case 'SUSPICIOUS_FILE_UPLOAD':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'RATE_LIMIT_EXCEEDED':
        return <AlertTriangle className="h-4 w-4" />;
      case 'FAILED_LOGIN_ATTEMPTS':
        return <Shield className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading security events...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              No security events detected. All systems operating normally.
            </AlertDescription>
          </Alert>
        ) : (
          events.map((event) => (
            <Alert key={event.id} variant={getEventSeverity(event.event_type) as any}>
              {getEventIcon(event.event_type)}
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong>{event.event_type.replace(/_/g, ' ')}</strong>
                  {event.ip_address && (
                    <span className="text-sm ml-2">IP: {event.ip_address}</span>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(event.created_at).toLocaleString()}
                  </div>
                </div>
                <Badge variant={getEventSeverity(event.event_type) as any}>
                  {event.event_type}
                </Badge>
              </AlertDescription>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
}
