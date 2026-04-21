import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "./auth-context";
import { Moon, BookOpen, Heart, Activity, LogOut, Flame, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const navItems = [
    { href: "/dashboard", label: "Sanctuary", icon: Home },
    { href: "/fears", label: "Face the Dark", icon: Flame },
    { href: "/journal", label: "Night Journal", icon: BookOpen },
    { href: "/affirmations", label: "Lantern", icon: Heart },
    { href: "/stats", label: "Journey", icon: Activity },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Sidebar (Desktop) / Navbar (Mobile) */}
      <nav className="md:w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col md:h-screen md:sticky md:top-0 md:left-0 z-40 shrink-0">
        <div className="p-6 md:p-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <span className="font-serif text-lg font-medium tracking-wide text-foreground leading-tight">
            The Dark Is No Longer Scary
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-2 md:py-4 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium shrink-0 group relative",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-[inset_0px_0px_10px_rgba(255,183,0,0.1)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 md:p-6 border-t border-border/50">
          <button 
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide">Step out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
        <div className="flex-1 p-4 md:p-8 lg:p-12 animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
