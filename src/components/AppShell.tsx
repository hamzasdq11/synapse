import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Menu,
  X,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
  { icon: Megaphone, label: "Campaigns", path: "/app/campaigns" },
  { icon: Users, label: "Personas", path: "/app/personas" },
  { icon: BarChart3, label: "Insights", path: "/app/insights" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-neutral-sidebar border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            {sidebarOpen ? (
              <Link to="/app" className="font-bold text-xl">
                <span className="text-primary">Synapse</span>
              </Link>
            ) : (
              <Link to="/app" className="font-bold text-xl text-primary">S</Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted text-text-secondary hover:text-foreground"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Quick Create */}
          {sidebarOpen && (
            <div className="p-4 border-t border-border">
              <Button className="w-full" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Quick Create
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="text-sm text-text-muted">
              Organization: <span className="text-text-primary font-medium">Acme Corp</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 stroke-[1.5px]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-status-negative rounded-full" />
              </Button>
              
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-medium text-primary border border-primary/20">
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
