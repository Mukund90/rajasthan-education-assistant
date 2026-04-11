import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

type FaqItem = { query: string; count: number };

export function FaqAnalytics() {
  const [data, setData] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: queries } = await supabase
        .from("chat_queries")
        .select("query")
        .order("created_at", { ascending: false })
        .limit(500);

      if (queries) {
        const freq: Record<string, number> = {};
        queries.forEach((q) => {
          const normalized = q.query.trim().toLowerCase().slice(0, 100);
          freq[normalized] = (freq[normalized] || 0) + 1;
        });
        const sorted = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([query, count]) => ({ query, count }));
        setData(sorted);
      }
      setLoading(false);
    }
    load();
  }, []);

  const COLORS = [
    "hsl(215, 80%, 35%)", "hsl(28, 90%, 52%)", "hsl(142, 70%, 40%)",
    "hsl(215, 70%, 50%)", "hsl(28, 85%, 55%)", "hsl(142, 60%, 45%)",
    "hsl(215, 80%, 25%)", "hsl(0, 84%, 60%)", "hsl(220, 20%, 46%)", "hsl(210, 30%, 70%)",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">FAQ Analytics</h2>
      <p className="text-muted-foreground text-sm">Most asked questions from the chatbot</p>

      {loading ? (
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      ) : data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No chat queries recorded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Top 10 Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="query"
                      width={250}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => v.length > 40 ? v.slice(0, 40) + "…" : v}
                    />
                    <Tooltip
                      formatter={(val: number) => [val, "Times asked"]}
                      labelFormatter={(label) => label}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Detailed View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <p className="text-sm text-foreground flex-1 mr-4">{item.query}</p>
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">{item.count}×</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
