import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  showSearch?: boolean;
}

const PageHeader = ({ title, showSearch = false }: PageHeaderProps) => {
  return (
    <header className="px-8 py-6 border-b border-border flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      
      {/* Header Actions */}
      <div className="flex items-center space-x-4">
        {showSearch && (
          <div className="relative hidden md:block">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-64 bg-muted/50"
            />
            <Search className="h-4 w-4 absolute right-3 top-2.5 text-muted-foreground" />
          </div>
        )}
        
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default PageHeader;
