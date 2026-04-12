import { useState } from "react";
import { NavCategory, NAV_CATEGORIES } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare,
  GraduationCap,
  ClipboardList,
  Award,
  Search,
  Menu,
  X,
  Bot,
  Shield,
  LogIn,
  LogOut,
  Target,
  Mail,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  MessageSquare,
  GraduationCap,
  ClipboardList,
  Award,
  Search,
  Target,
  Mail,
};

interface AppLayoutProps {
  activeTab: NavCategory;
  onTabChange: (tab: NavCategory) => void;
  children: React.ReactNode;
}

export function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 gradient-primary flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Bot className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div className="text-sidebar-foreground">
            <h1 className="font-heading font-bold text-sm leading-tight">DTE Rajasthan</h1>
            <p className="text-xs opacity-70">Student Assistant</p>
          </div>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon];
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onTabChange(cat.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 space-y-1 border-t border-sidebar-border">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Panel</span>
            </button>
          )}
          {user ? (
            <button
              onClick={async () => { await signOut(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/login")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <LogIn className="h-4 w-4" />
              <span>Admin Login</span>
            </button>
          )}
          <p className="text-xs text-sidebar-foreground/50 leading-relaxed px-3 pt-2">
            Department of Technical Education
            <br />
            Government of Rajasthan
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-heading font-semibold text-sm text-foreground">
              DTE Rajasthan Assistant
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
