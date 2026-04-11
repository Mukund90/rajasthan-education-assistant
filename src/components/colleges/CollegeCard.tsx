import { College } from "@/lib/types";
import { MapPin, GraduationCap, IndianRupee, TrendingUp, Building2 } from "lucide-react";
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
      <div className="h-40 overflow-hidden">
        <img
          src={college.image_url || collegeDefaultImg}
          alt={college.name}
          className="w-full h-full object-cover"
          loading="lazy"
          width={400}
          height={160}
        />
      </div>

      <div className="p-5 space-y-4">
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
              {college.placements?.placement_rate || "N/A"}%
            </p>
            <p className="text-xs text-muted-foreground">Placement</p>
          </div>
        </div>

        {college.affiliation && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span>{college.affiliation}</span>
            {college.established && <span>• Est. {college.established}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
