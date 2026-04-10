import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Scholarship } from "@/lib/types";
import { Award, Calendar, ExternalLink, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABELS: Record<string, string> = {
  merit: "Merit-based",
  need: "Need-based",
  sc_st: "SC/ST",
  obc: "OBC",
  minority: "Minority",
  other: "Other",
};

export function ScholarshipList() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("scholarships").select("*").order("name");
      if (data) setScholarships(data as unknown as Scholarship[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = filter === "all" ? scholarships : scholarships.filter((s) => s.category === filter);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Scholarships</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Financial aid opportunities for technical education students in Rajasthan
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "merit", "sc_st", "obc", "minority", "other"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{s.description}</p>
                  </div>
                </div>
                {s.category && (
                  <Badge variant="secondary" className="shrink-0">
                    {CATEGORY_LABELS[s.category] || s.category}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Eligibility
                  </p>
                  <p className="text-sm text-card-foreground mt-0.5">{s.eligibility}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-sm font-semibold text-accent mt-0.5">{s.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Deadline
                  </p>
                  <p className="text-sm text-card-foreground mt-0.5">{s.deadline}</p>
                </div>
              </div>

              {s.how_to_apply && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">How to Apply</p>
                  <p className="text-sm text-card-foreground">{s.how_to_apply}</p>
                </div>
              )}

              {s.website && (
                <a
                  href={s.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Official Website
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
