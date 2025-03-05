
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Bus, Truck, Train, Home, LogIn, LogOut, User 
} from "lucide-react";
import { useAuth } from "./Auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ferme le menu mobile quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 font-semibold text-xl"
            >
              <Bus className="h-6 w-6 text-primary" />
              <span className="transition-colors duration-300">TransitExplorer</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Accueil
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                    location.pathname === "/dashboard" ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  Tableau de bord
                </Link>
              </>
            )}
            
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="px-4">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="px-4">
                    <User className="h-4 w-4 mr-2" />
                    Inscription
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.username || "Utilisateur"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex items-center" asChild>
                    <Link to="/dashboard" className="w-full cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Tableau de bord</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Bouton menu mobile */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden glass-panel mx-4 mt-2 animate-scale-in">
          <div className="flex flex-col p-4 space-y-4">
            <Link 
              to="/" 
              className={`flex items-center p-2 rounded-md transition-colors ${
                location.pathname === "/" 
                  ? "text-primary bg-primary/5" 
                  : "hover:bg-muted"
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Accueil
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={`flex items-center p-2 rounded-md transition-colors ${
                  location.pathname === "/dashboard" 
                    ? "text-primary bg-primary/5" 
                    : "hover:bg-muted"
                }`}
              >
                <Truck className="h-5 w-5 mr-3" />
                Tableau de bord
              </Link>
            )}
            
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <LogIn className="h-5 w-5 mr-3" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button className="w-full justify-start">
                    <User className="h-5 w-5 mr-3" />
                    Inscription
                  </Button>
                </Link>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                className="justify-start hover:bg-destructive/10 text-destructive"
                onClick={logout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
