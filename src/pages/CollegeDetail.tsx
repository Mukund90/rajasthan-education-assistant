import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { College } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  Building2,
  Users,
  BedDouble,
} from "lucide-react";
import collegeDefaultImg from "@/assets/college-default.jpg";
import { CollegeCharts } from "@/components/colleges/CollegeCharts";

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA (SAFE)
  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("colleges")
          .select("*")
          .eq("id", id)
          .maybeSingle(); // ✅ FIXED

        if (error) {
          console.error(error);
          setCollege(null);
        } else {
          console.log("College Data:", data); // DEBUG
          setCollege(data as unknown as College);
        }
      } catch (err) {
        console.error(err);
        setCollege(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const fmt = (n?: number) =>
    n ? `₹${n.toLocaleString("en-IN")}` : "Not Available";

  // ✅ LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
          <div className="h-40 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  // ✅ NOT FOUND
  if (!college) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">College not found</p>
          <Button onClick={() => navigate("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

        {/* BACK */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {/* HERO */}
        <div className="relative rounded-xl overflow-hidden h-48 md:h-64">
          <img
            src={college.image_url || collegeDefaultImg}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <Badge>{college.type}</Badge>
            <h1 className="text-2xl font-bold mt-2">{college.name}</h1>
            <p className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              {college.city}, {college.district}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <Card>
            <CardContent className="p-4 text-center">
              <IndianRupee className="mx-auto mb-1" />
              <p className="font-bold">{fmt(college.fees?.general)}</p>
              <p className="text-xs">Fees/year</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="mx-auto mb-1" />
              <p className="font-bold">
                {fmt(college.placements?.average_package)}
              </p>
              <p className="text-xs">Avg Package</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="mx-auto mb-1" />
              <p className="font-bold">
                {college.placements?.placement_rate
                  ? `${college.placements.placement_rate}%`
                  : "Not Available"}
              </p>
              <p className="text-xs">Placement</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Building2 className="mx-auto mb-1" />
              <p className="font-bold">
                {college.established || "Not Available"}
              </p>
              <p className="text-xs">Established</p>
            </CardContent>
          </Card>

        </div>

        {/* COURSES */}
        <Card>
          <CardHeader>
            <CardTitle>Courses Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {college.branches?.map((b) => (
                <Badge key={b}>{b}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FEES */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Structure</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm">General</p>
              <p className="font-semibold">{fmt(college.fees?.general)}</p>
            </div>
            <div>
              <p className="text-sm">SC/ST</p>
              <p className="font-semibold">{fmt(college.fees?.sc_st)}</p>
            </div>
            <div>
              <p className="text-sm">Hostel</p>
              <p className="font-semibold">{fmt(college.fees?.hostel)}</p>
            </div>
          </CardContent>
        </Card>

        {/* CHARTS & ANALYTICS */}
        <CollegeCharts college={college} />

        {/* PLACEMENTS */}
        {college.placements && (
          <Card>
            <CardHeader>
              <CardTitle>Placement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average Package</p>
                  <p className="font-semibold">{fmt(college.placements.average_package)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Highest Package</p>
                  <p className="font-semibold">
                    {college.placements.highest_package ? fmt(college.placements.highest_package) : "Not Available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Placement Rate</p>
                  <p className="font-semibold">
                    {college.placements.placement_rate ? `${college.placements.placement_rate}%` : "Not Available"}
                  </p>
                </div>
              </div>

              {college.placements.top_recruiters && college.placements.top_recruiters.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Top Recruiting Companies</p>
                  <div className="flex flex-wrap gap-2">
                    {college.placements.top_recruiters.map((company) => (
                      <Badge key={company} variant="outline" className="text-sm">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* HOSTEL */}
        {college.hostel?.available && (
          <Card>
            <CardHeader>
              <CardTitle>Hostel Details</CardTitle>
            </CardHeader>
            <CardContent>
              Available
            </CardContent>
          </Card>
        )}

        {/* CONTACT */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">

            {college.contact?.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {college.contact.email}
              </p>
            )}

            {college.contact?.phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {college.contact.phone}
              </p>
            )}

            {college.website && (
              <a
                href={college.website}
                target="_blank"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Globe className="h-4 w-4" />
                Visit Website
              </a>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}