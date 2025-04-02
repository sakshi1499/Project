import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Phone,
  List,
  CreditCard,
  Settings,
} from "lucide-react";

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
      <a
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
          isActive
            ? "bg-muted text-primary"
            : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{children}</span>
        {badge !== undefined && (
          <span className="ml-auto bg-primary text-xs font-medium px-2 py-0.5 rounded-full text-primary-foreground">
            {badge}
          </span>
        )}
      </a>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border h-full flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">SC</span>
            </div>
            <span className="font-medium text-sidebar-foreground">Shiva Chintaluru</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          <NavItem href="/" icon={LayoutDashboard}>
            Dashboard
          </NavItem>

          <NavItem href="/campaigns" icon={Phone} badge={9}>
            Voice Campaigns
          </NavItem>

          <NavItem href="/call-history" icon={List}>
            Call History
          </NavItem>

          <NavItem href="/billing" icon={CreditCard}>
            Billing
          </NavItem>

          <NavItem href="/settings" icon={Settings}>
            Settings
          </NavItem>
        </nav>

        {/* Logo Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-2">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-primary"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                fill="currentColor"
              />
              <path
                d="M19.707 5.293a1 1 0 00-1.414 0L16.586 7A8.966 8.966 0 0012 5c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8c0-1.852-.627-3.551-1.679-4.904l1.679-1.679a1 1 0 00-1.414-1.414zM12 19c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"
                fill="currentColor"
              />
            </svg>
            <span className="font-medium text-sm text-sidebar-foreground">ProxyTalk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
