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

        {/* Logo Footer */}
        <div className="p-4 mt-auto">
          <div className="flex items-center space-x-2 text-white/80">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 6.5C15.3284 6.5 16 5.82843 16 5C16 4.17157 15.3284 3.5 14.5 3.5C13.6716 3.5 13 4.17157 13 5C13 5.82843 13.6716 6.5 14.5 6.5Z" fill="currentColor"/>
              <path d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8Z" fill="currentColor"/>
              <path d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z" fill="currentColor"/>
              <path d="M11 12.5C11 13.3284 10.3284 14 9.5 14C8.67157 14 8 13.3284 8 12.5C8 11.6716 8.67157 11 9.5 11C10.3284 11 11 11.6716 11 12.5Z" fill="currentColor"/>
              <path d="M18.5 14C19.3284 14 20 13.3284 20 12.5C20 11.6716 19.3284 11 18.5 11C17.6716 11 17 11.6716 17 12.5C17 13.3284 17.6716 14 18.5 14Z" fill="currentColor"/>
              <path d="M14.5 19C15.3284 19 16 18.3284 16 17.5C16 16.6716 15.3284 16 14.5 16C13.6716 16 13 16.6716 13 17.5C13 18.3284 13.6716 19 14.5 19Z" fill="currentColor"/>
              <path d="M9.5 17C8.67157 17 8 17.6716 8 18.5C8 19.3284 8.67157 20 9.5 20C10.3284 20 11 19.3284 11 18.5C11 17.6716 10.3284 17 9.5 17Z" fill="currentColor"/>
              <path d="M6.5 15C5.67157 15 5 15.6716 5 16.5C5 17.3284 5.67157 18 6.5 18C7.32843 18 8 17.3284 8 16.5C8 15.6716 7.32843 15 6.5 15Z" fill="currentColor"/>
              <path d="M4.5 11C3.67157 11 3 11.6716 3 12.5C3 13.3284 3.67157 14 4.5 14C5.32843 14 6 13.3284 6 12.5C6 11.6716 5.32843 11 4.5 11Z" fill="currentColor"/>
              <path d="M5 8.5C5 7.67157 5.67157 7 6.5 7C7.32843 7 8 7.67157 8 8.5C8 9.32843 7.32843 10 6.5 10C5.67157 10 5 9.32843 5 8.5Z" fill="currentColor"/>
            </svg>
            <span className="font-medium">ProxyTalk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
