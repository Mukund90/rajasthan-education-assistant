import { College } from "@/lib/types";
import { MapPin, GraduationCap, IndianRupee, TrendingUp, Building2, Users, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import collegeDefaultImg from "@/assets/college-default.jpg";

export function CollegeCard({ college }: { college: College }) {
  const navigate = useNavigate();
  const formatCurrency = (n?: number) =>
    n ? `₹${(n / 100000).toFixed(1)}L` : "N/A";

  return (
    <div
      onClick={() => navigate(`/college/${college.id}`)}
      className="rounded-xl border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="h-40 overflow-hidden relative">
        <img
          src={college.image_url || collegeDefaultImg}
          alt={college.name}
          className="w-full h-full object-cover"
          loading="lazy"
          width={400}
          height={160}
        />
        {college.placements?.placement_rate && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-primary flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {college.placements.placement_rate}% Placed
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading font-semibold text-card-foreground leading-tight">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{college.city}, {college.district}</span>
            </div>
          </div>
          <Badge
            variant={college.type === "engineering" ? "default" : "secondary"}
            className="shrink-0 capitalize"
          >
            {college.type}
          </Badge>
        </div>

        {/* Branches */}
        <div className="flex flex-wrap gap-1.5">
          {college.branches?.slice(0, 4).map((b) => (
            <span key={b} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
              {b}
            </span>
          ))}
          {college.branches?.length > 4 && (
            <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
              +{college.branches.length - 4} more
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent">
              <IndianRupee className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-semibold text-card-foreground mt-1">
              {formatCurrency(college.fees?.general)}
            </p>
            <p className="text-xs text-muted-foreground">Fees/year</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-success">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-semibold text-card-foreground mt-1">
              {formatCurrency(college.placements?.average_package)}
            </p>
            <p className="text-xs text-muted-foreground">Avg Package</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-semibold text-card-foreground mt-1">
              {formatCurrency(college.placements?.highest_package)}
            </p>
            <p className="text-xs text-muted-foreground">Top Package</p>
          </div>
        </div>

        {/* Top Recruiters */}
        {college.placements?.top_recruiters && college.placements.top_recruiters.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
              <Briefcase className="h-3 w-3" />
              <span className="font-medium">Top Recruiters</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {college.placements.top_recruiters.slice(0, 5).map((company) => (
                <span key={company} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {company}
                </span>
              ))}
              {college.placements.top_recruiters.length > 5 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  +{college.placements.top_recruiters.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            <span>{college.affiliation || "N/A"}</span>
          </div>
          {college.established && <span>Est. {college.established}</span>}
          {college.hostel?.available && (
            <Badge variant="outline" className="text-xs py-0 px-1.5">
              Hostel
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
