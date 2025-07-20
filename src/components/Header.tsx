import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import { GraduationCap, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/cursos", label: "Cursos" },
    { to: "/unidades", label: "Unidades" },
    { to: "/comunidade", label: "Comunidade" },
    { to: "/repositorio", label: "Repositório" },
  ];

  const NavLinks = () => (
    <>
      {links.map((link) => (
        <NavigationMenuItem key={link.to}>
          <NavigationMenuLink
            asChild
            className={navigationMenuTriggerStyle()}
            onClick={() => setIsOpen(false)}
          >
            <Link to={link.to}>{link.label}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              FACODI
            </span>
          </Link>

          {user && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-6">
                <NavLinks />
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <NavigationMenu className="mt-6 w-full">
                      <NavigationMenuList className="flex-col space-y-4">
                        <NavLinks />
                      </NavigationMenuList>
                    </NavigationMenu>
                  </SheetContent>
                </Sheet>
              </div>
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Começar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}