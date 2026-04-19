import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Query = {
  id: string;
  query: string;
  category: string | null;
  created_at: string;
};

export function StudentQueriesTab() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_queries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      toast({ title: "Error loading queries", description: error.message, variant: "destructive" });
    } else {
      setQueries(data ?? []);
    }
    setLoading(false);
  }

  const categories = useMemo(() => {
    const set = new Set<string>();
    queries.forEach((q) => q.category && set.add(q.category));
    return Array.from(set).sort();
  }, [queries]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return queries.filter((q) => {
      if (category !== "all" && q.category !== category) return false;
      if (s && !q.query.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [queries, search, category]);

  const exportCsv = () => {
    const rows = [
      ["Date", "Category", "Query"],
      ...filtered.map((q) => [
        new Date(q.created_at).toLocaleString(),
        q.category ?? "",
        q.query.replace(/"/g, '""'),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-queries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteQuery = async (id: string) => {
    if (!confirm("Delete this query?")) return;
    const { error } = await supabase.from("chat_queries").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setQueries((prev) => prev.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Student Queries</h2>
          <p className="text-sm text-muted-foreground">All questions students have asked the assistant</p>
        </div>
        <Button onClick={exportCsv} disabled={!filtered.length}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search queries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {queries.length} queries
      </p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No queries match your filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">Date</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-2 font-medium text-muted-foreground">Query</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                      {new Date(q.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {q.category ? (
                        <Badge variant="secondary">{q.category}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xl">{q.query}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={() => deleteQuery(q.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
