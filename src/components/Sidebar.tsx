
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Calendar, 
  Home, 
  PieChart, 
  Search, 
  Settings, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "Students",
      icon: <Users className="h-5 w-5" />,
      path: "/students",
    },
    {
      name: "Attendance",
      icon: <Calendar className="h-5 w-5" />,
      path: "/attendance",
    },
    {
      name: "Reports",
      icon: <BarChart className="h-5 w-5" />,
      path: "/reports",
    },
    {
      name: "Analytics",
      icon: <PieChart className="h-5 w-5" />,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar border-r transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:w-64"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">SmartAttend</span>
          <Button variant="ghost" size="sm" onClick={toggleExpanded}>
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {expanded && (
          <div className="mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-sm",
                isActive(item.path) 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 text-xs text-muted-foreground border-t">
        <p>SmartAttend v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
