import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { College, Scholarship } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

export function CollegePredictor() {
  const [marks, setMarks] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [branch, setBranch] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [predictedColleges, setPredictedColleges] = useState<{ college: College; chance: string; matchScore: number }[]>([]);
  const [predictedScholarships, setPredictedScholarships] = useState<Scholarship[]>([]);
  const [predicted, setPredicted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from("colleges").select("*"),
        supabase.from("scholarships").select("*"),
      ]);
      if (c) setColleges(c as unknown as College[]);
      if (s) setScholarships(s as unknown as Scholarship[]);
    }
    load();
  }, []);

  const predict = () => {
    setPredicted(true);
    const rankNum = parseInt(rank) || 99999;
    const marksNum = parseInt(marks) || 0;
    const catKey = category.toLowerCase().replace("/", "_");

    // College prediction based on cutoffs and rank
    const scored = colleges.map((college) => {
      let matchScore = 0;
      let chance = "Low";

      // Check cutoffs
      const years = Object.keys(college.cutoffs || {});
      if (years.length > 0) {
        const latestYear = years[years.length - 1];
        const yearData = college.cutoffs[latestYear] || {};
        
        for (const branchKey of Object.keys(yearData)) {
          if (branch && !branchKey.toLowerCase().includes(branch.toLowerCase().slice(0, 3))) continue;
          
          const branchCutoffs = yearData[branchKey] || {};
          const cutoff = branchCutoffs[catKey] || branchCutoffs["general"] || 999999;
          
          if (rankNum <= cutoff * 0.7) {
            matchScore = Math.max(matchScore, 95);
            chance = "High";
          } else if (rankNum <= cutoff * 0.9) {
            matchScore = Math.max(matchScore, 75);
            chance = "Good";
          } else if (rankNum <= cutoff) {
            matchScore = Math.max(matchScore, 55);
            chance = "Moderate";
          } else if (rankNum <= cutoff * 1.15) {
            matchScore = Math.max(matchScore, 30);
            chance = chance === "Low" ? "Low" : chance;
          }
        }
      }

      // Bonus for placement rate
      if (college.placements?.placement_rate && college.placements.placement_rate > 70) {
        matchScore += 5;
      }

      return { college, chance, matchScore };
    });

    const filtered = scored
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    setPredictedColleges(filtered.length > 0 ? filtered : scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5));

    // Scholarship prediction based on category and marks
    const matchedScholarships = scholarships.filter((s) => {
      const cat = s.category?.toLowerCase() || "";
      const elig = s.eligibility?.toLowerCase() || "";
      
      if (category === "SC" || category === "ST") {
        if (cat.includes("sc") || cat.includes("st") || cat.includes("reserved") || elig.includes("sc") || elig.includes("st")) return true;
      }
      if (category === "OBC") {
        if (cat.includes("obc") || elig.includes("obc")) return true;
      }
      if (cat.includes("merit") && marksNum >= 80) return true;
      if (cat.includes("all") || cat.includes("general") || cat === "") return true;
      if (elig.includes("all") || elig.includes("engineering") || elig.includes("polytechnic")) return true;
      
      return false;
    });

    setPredictedScholarships(matchedScholarships);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          College & Scholarship Predictor
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your marks, rank, and category to predict which colleges you can get and which scholarships you're eligible for
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Marks (% or out of 100)</Label>
              <Input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 85"
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Rank (REAP / JEE Main)</Label>
              <Input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 15000"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Branch</Label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Any Branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics & Communication</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>
          </div>
          <Button onClick={predict} className="mt-4 w-full sm:w-auto" disabled={!rank && !marks}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Predict My Colleges & Scholarships
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {predicted && (
        <div className="space-y-6">
          {/* College Predictions */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary" />
              Predicted Colleges ({predictedColleges.length})
            </h2>
            {predictedColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictedColleges.map(({ college, chance, matchScore }) => (
                  <Card
                    key={college.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground text-sm leading-tight flex-1 mr-2">
                          {college.name}
                        </h3>
                        <Badge
                          variant={chance === "High" ? "default" : chance === "Good" ? "secondary" : "outline"}
                          className={chance === "High" ? "bg-green-600" : chance === "Good" ? "bg-blue-600 text-white" : ""}
                        >
                          {chance} Chance
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{college.city}, {college.district}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(matchScore, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{matchScore}%</span>
                      </div>
                      {college.placements?.placement_rate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Placement Rate: {college.placements.placement_rate}%
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No matching colleges found. Try adjusting your rank or preferences.
              </p>
            )}
          </div>

          {/* Scholarship Predictions */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-accent" />
              Eligible Scholarships ({predictedScholarships.length})
            </h2>
            {predictedScholarships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictedScholarships.map((s) => (
                  <Card key={s.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{s.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-2">{s.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.amount && <Badge variant="outline">💰 {s.amount}</Badge>}
                        {s.category && <Badge variant="secondary">{s.category}</Badge>}
                        {s.deadline && <Badge variant="outline">📅 {s.deadline}</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No matching scholarships found for your profile.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
