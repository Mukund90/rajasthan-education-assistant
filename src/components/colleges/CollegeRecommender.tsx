import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { College } from "@/lib/types";
import { CollegeCard } from "./CollegeCard";
import { Search, SlidersHorizontal } from "lucide-react";

const BRANCHES = [
  "Computer Science",
  "Electronics & Communication",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Information Technology",
];

const DISTRICTS = [
  "Jaipur",
  "Kota",
  "Jodhpur",
  "Ajmer",
  "Jhunjhunu",
];

export function CollegeRecommender() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [rank, setRank] = useState("");
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<string>("all");
  const [results, setResults] = useState<College[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("colleges").select("*");
      if (data) setColleges(data as unknown as College[]);
    }
    load();
  }, []);

  const recommend = () => {
    setSearched(true);
    let filtered = [...colleges];

    if (type !== "all") {
      filtered = filtered.filter((c) => c.type === type);
    }

    if (branch) {
      filtered = filtered.filter((c) =>
        c.branches?.some((b) => b.toLowerCase().includes(branch.toLowerCase()))
      );
    }

    if (location) {
      filtered = filtered.filter((c) =>
        c.district.toLowerCase() === location.toLowerCase()
      );
    }

    if (rank) {
      const rankNum = parseInt(rank);
      filtered = filtered.sort((a, b) => {
        const getCutoff = (c: College) => {
          const year = Object.keys(c.cutoffs || {})[0];
          if (!year) return 999999;
          const branchKey = branch || "CSE";
          const branchData = c.cutoffs[year];
          for (const key of Object.keys(branchData)) {
            if (key.toLowerCase().includes(branchKey.toLowerCase().slice(0, 3))) {
              return branchData[key]?.general || 999999;
            }
          }
          return 999999;
        };
        const cutA = getCutoff(a);
        const cutB = getCutoff(b);
        // Show colleges where rank is better (lower) than cutoff
        const aEligible = rankNum <= cutA;
        const bEligible = rankNum <= cutB;
        if (aEligible && !bEligible) return -1;
        if (!aEligible && bEligible) return 1;
        return cutA - cutB;
      });
    } else {
      filtered.sort((a, b) => (b.placements?.placement_rate || 0) - (a.placements?.placement_rate || 0));
    }

    setResults(filtered);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Find Your College</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Get personalized college recommendations based on your rank, branch, and location preference
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Preferences</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Your Rank (REAP/JEE)</label>
            <input
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              type="number"
              placeholder="e.g. 15000"
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Preferred Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any Branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any Location</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">College Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="engineering">Engineering</option>
              <option value="polytechnic">Polytechnic</option>
            </select>
          </div>
        </div>

        <button
          onClick={recommend}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Search className="h-4 w-4" />
          Find Colleges
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            {results.length} College{results.length !== 1 ? "s" : ""} Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
          {results.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No colleges match your criteria. Try adjusting your preferences.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
