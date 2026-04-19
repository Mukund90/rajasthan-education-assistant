import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot, GraduationCap, Award, BarChart3, LogOut, Plus, Pencil, Trash2,
  Building2, LayoutDashboard, MessageSquare
} from "lucide-react";
import { CollegeFormModal } from "@/components/admin/CollegeFormModal";
import { ScholarshipFormModal } from "@/components/admin/ScholarshipFormModal";
import { FaqAnalytics } from "@/components/admin/FaqAnalytics";
import { StudentQueriesTab } from "@/components/admin/StudentQueriesTab";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Tab = "overview" | "colleges" | "scholarships" | "analytics" | "queries";

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [colleges, setColleges] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [queryCount, setQueryCount] = useState(0);
  const [editCollege, setEditCollege] = useState<any>(null);
  const [editScholarship, setEditScholarship] = useState<any>(null);
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showScholarshipForm, setShowScholarshipForm] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [c, s, q] = await Promise.all([
      supabase.from("colleges").select("*").order("name"),
      supabase.from("scholarships").select("*").order("name"),
      supabase.from("chat_queries").select("id", { count: "exact", head: true }),
    ]);
    if (c.data) setColleges(c.data);
    if (s.data) setScholarships(s.data);
    setQueryCount(q.count ?? 0);
  };

  const deleteCollege = async (id: string) => {
    if (!confirm("Delete this college?")) return;
    const { error } = await supabase.from("colleges").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      loadData();
    }
  };

  const deleteScholarship = async (id: string) => {
    if (!confirm("Delete this scholarship?")) return;
    const { error } = await supabase.from("scholarships").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      loadData();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return null;

  const SIDEBAR_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "colleges", label: "Colleges", icon: GraduationCap },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "analytics", label: "FAQ Analytics", icon: BarChart3 },
    { id: "queries", label: "Student Queries", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 gradient-primary flex flex-col shrink-0">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Bot className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div className="text-sidebar-foreground">
            <h1 className="font-heading font-bold text-sm">Admin Panel</h1>
            <p className="text-xs opacity-70">DTE Rajasthan</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 space-y-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => navigate("/")}
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Back to App
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={async () => { await signOut(); navigate("/admin/login"); }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        {tab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-foreground">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab("colleges")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{colleges.length}</div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab("scholarships")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{scholarships.length}</div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab("analytics")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Chat Queries</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{queryCount}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {tab === "colleges" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage Colleges</h2>
              <Button onClick={() => { setEditCollege(null); setShowCollegeForm(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add College
              </Button>
            </div>
            <div className="space-y-3">
              {colleges.map((c) => (
                <Card key={c.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{c.city}, {c.district} • {c.code}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">{c.type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditCollege(c); setShowCollegeForm(true); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCollege(c.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "scholarships" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage Scholarships</h2>
              <Button onClick={() => { setEditScholarship(null); setShowScholarshipForm(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Scholarship
              </Button>
            </div>
            <div className="space-y-3">
              {scholarships.map((s) => (
                <Card key={s.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.category} • {s.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditScholarship(s); setShowScholarshipForm(true); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteScholarship(s.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "analytics" && <FaqAnalytics />}
        {tab === "queries" && <StudentQueriesTab />}
      </main>

      {showCollegeForm && (
        <CollegeFormModal
          college={editCollege}
          onClose={() => setShowCollegeForm(false)}
          onSaved={() => { setShowCollegeForm(false); loadData(); }}
        />
      )}
      {showScholarshipForm && (
        <ScholarshipFormModal
          scholarship={editScholarship}
          onClose={() => setShowScholarshipForm(false)}
          onSaved={() => { setShowScholarshipForm(false); loadData(); }}
        />
      )}
    </div>
  );
}
