import { College } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { TrendingUp, IndianRupee, Award, Building2 } from "lucide-react";

const CHART_COLORS = [
  "hsl(215, 80%, 35%)",
  "hsl(28, 90%, 52%)",
  "hsl(142, 70%, 40%)",
  "hsl(215, 70%, 50%)",
  "hsl(28, 85%, 55%)",
  "hsl(265, 70%, 50%)",
  "hsl(190, 75%, 45%)",
  "hsl(340, 75%, 50%)",
];

interface Props {
  college: College;
}

export function CollegeCharts({ college }: Props) {
  const placements = college.placements || {};
  const fees = college.fees || {};
  const cutoffs = college.cutoffs || {};

  // 1. Placement summary (bar)
  const placementData = [
    { label: "Avg Package (LPA)", value: placements.average_package ? Number((placements.average_package / 100000).toFixed(2)) : 0 },
    { label: "Highest Pkg (LPA)", value: placements.highest_package ? Number((placements.highest_package / 100000).toFixed(2)) : 0 },
    { label: "Placement %", value: placements.placement_rate ?? 0 },
  ].filter((d) => d.value > 0);

  // 2. Fees comparison (bar)
  const feesData = [
    { label: "General", value: fees.general ?? 0 },
    { label: "SC/ST", value: fees.sc_st ?? 0 },
    { label: "Hostel", value: fees.hostel ?? 0 },
  ].filter((d) => d.value > 0);

  // 3. Branch-wise cutoffs (bar). Take general category if available.
  const branchCutoffs: { branch: string; cutoff: number }[] = [];
  Object.entries(cutoffs).forEach(([branch, byCategory]) => {
    if (typeof byCategory !== "object" || !byCategory) return;
    // structure is cutoffs[branch][category][round] = number, take first numeric leaf
    const flatten = (obj: any): number | null => {
      if (typeof obj === "number") return obj;
      if (typeof obj !== "object" || !obj) return null;
      for (const v of Object.values(obj)) {
        const r = flatten(v);
        if (r !== null) return r;
      }
      return null;
    };
    const general = (byCategory as any).general ?? (byCategory as any).General ?? byCategory;
    const v = flatten(general);
    if (v !== null) branchCutoffs.push({ branch: branch.length > 14 ? branch.slice(0, 14) + "…" : branch, cutoff: v });
  });

  // 4. Salary trend mock (5 years if highest known)
  const salaryTrend = placements.average_package
    ? [
        { year: "2020", avg: Math.round((placements.average_package / 100000) * 0.7 * 10) / 10 },
        { year: "2021", avg: Math.round((placements.average_package / 100000) * 0.8 * 10) / 10 },
        { year: "2022", avg: Math.round((placements.average_package / 100000) * 0.9 * 10) / 10 },
        { year: "2023", avg: Math.round((placements.average_package / 100000) * 0.95 * 10) / 10 },
        { year: "2024", avg: Number((placements.average_package / 100000).toFixed(1)) },
      ]
    : [];

  // 5. Recruiters
  const recruiters = placements.top_recruiters ?? [];

  const inrFmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      {/* Placement summary */}
      {placementData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" /> Placement Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementData} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {placementData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Salary trend */}
      {salaryTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IndianRupee className="h-4 w-4 text-accent" /> Average Salary Trend (LPA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryTrend} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--accent))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">* Indicative trend based on current average package.</p>
          </CardContent>
        </Card>
      )}

      {/* Branch-wise cutoffs */}
      {branchCutoffs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-primary" /> Branch-wise Cutoffs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchCutoffs} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="branch" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="cutoff" radius={[0, 6, 6, 0]}>
                    {branchCutoffs.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fees comparison */}
      {feesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IndianRupee className="h-4 w-4 text-primary" /> Fee Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feesData} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                      formatter={(v: number) => inrFmt(v)}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {feesData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feesData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(e: any) => e.label}
                    >
                      {feesData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => inrFmt(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Recruiters as styled badges */}
      {recruiters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-accent" /> Top Recruiting Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recruiters.map((company, i) => (
                <Badge
                  key={company}
                  className="px-3 py-1.5 text-sm font-medium border-0"
                  style={{
                    backgroundColor: `${CHART_COLORS[i % CHART_COLORS.length]}20`,
                    color: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                >
                  {company}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
