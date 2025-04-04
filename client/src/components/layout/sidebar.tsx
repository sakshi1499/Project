import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  History,
  IndianRupee,
  Settings,
  Mic,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavItem = ({
  href,
  icon: Icon,
  children,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  badge?: number;
}) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors cursor-pointer",
          isActive
            ? "bg-muted/50 text-foreground font-medium"
            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{children}</span>
        {badge !== undefined && (
          <span className="ml-auto bg-primary/10 text-xs font-medium px-2 py-0.5 rounded-full text-foreground">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      if (auth) {
        // Sign out from Firebase
        await signOut(auth);
      }
      // Clear local authentication state
      localStorage.removeItem("authenticated");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to login page
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className="w-60 bg-black border-r border-border/10 h-full flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="p-4 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-between rounded-md p-2 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://ui-avatars.com/api/?name=Shiva+Chintaluru&background=random" 
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-white">Shiva Chintaluru</span>
                </div>
                <ChevronDown className="h-4 w-4 text-white/70" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => setLocation("/settings")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 text-sm">
          <NavItem href="/" icon={LayoutDashboard}>
            Dashboard
          </NavItem>

          <NavItem href="/campaigns" icon={Mic} badge={9}>
            Voice Campaigns
          </NavItem>

          <NavItem href="/call-history" icon={History}>
            Call History
          </NavItem>

          <NavItem href="/billing" icon={IndianRupee}>
            Billing
          </NavItem>

          <NavItem href="/settings" icon={Settings}>
            Settings
          </NavItem>
        </nav>

        {/* ProxyTalk branding */}
        <div className="p-4 mt-auto border-t border-border/10 flex items-center justify-center text-white/40">
          <div className="flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70">
              <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">ProxyTalk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
