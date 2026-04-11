import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { College } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft, MapPin, GraduationCap, IndianRupee, TrendingUp, Globe,
  Phone, Mail, Building2, Users, BedDouble
} from "lucide-react";
import collegeDefaultImg from "@/assets/college-default.jpg";

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("colleges").select("*").eq("id", id).single();
      if (data) setCollege(data as unknown as College);
      setLoading(false);
    }
    load();
  }, [id]);

  const fmt = (n?: number) => (n ? `₹${n.toLocaleString("en-IN")}` : "N/A");

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
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        {/* Hero Image */}
        <div className="relative rounded-xl overflow-hidden h-48 md:h-64">
          <img
            src={college.image_url || collegeDefaultImg}
            alt={college.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
            <Badge className="mb-2 capitalize">{college.type}</Badge>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">{college.name}</h1>
            <p className="flex items-center gap-1 text-sm opacity-90 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {college.city}, {college.district}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <IndianRupee className="h-5 w-5 mx-auto text-accent mb-1" />
              <p className="text-lg font-bold">{fmt(college.fees?.general)}</p>
              <p className="text-xs text-muted-foreground">Fees/year</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 mx-auto text-success mb-1" />
              <p className="text-lg font-bold">{fmt(college.placements?.average_package)}</p>
              <p className="text-xs text-muted-foreground">Avg Package</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-lg font-bold">{college.placements?.placement_rate || "N/A"}%</p>
              <p className="text-xs text-muted-foreground">Placement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Building2 className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-bold">{college.established || "N/A"}</p>
              <p className="text-xs text-muted-foreground">Established</p>
            </CardContent>
          </Card>
        </div>

        {/* Branches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Courses Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {college.branches?.map((b) => (
                <Badge key={b} variant="secondary">{b}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="h-4 w-4" /> Fee Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><p className="text-sm text-muted-foreground">General</p><p className="font-semibold">{fmt(college.fees?.general)}</p></div>
              <div><p className="text-sm text-muted-foreground">SC/ST</p><p className="font-semibold">{fmt(college.fees?.sc_st)}</p></div>
              <div><p className="text-sm text-muted-foreground">Hostel</p><p className="font-semibold">{fmt(college.fees?.hostel)}</p></div>
            </div>
          </CardContent>
        </Card>

        {/* Placements */}
        {college.placements && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Placement Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><p className="text-sm text-muted-foreground">Avg Package</p><p className="font-semibold">{fmt(college.placements.average_package)}</p></div>
                <div><p className="text-sm text-muted-foreground">Highest Package</p><p className="font-semibold">{fmt(college.placements.highest_package)}</p></div>
                <div><p className="text-sm text-muted-foreground">Rate</p><p className="font-semibold">{college.placements.placement_rate || "N/A"}%</p></div>
              </div>
              {college.placements.top_recruiters && college.placements.top_recruiters.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Top Recruiters</p>
                  <div className="flex flex-wrap gap-2">
                    {college.placements.top_recruiters.map((r) => (
                      <Badge key={r} variant="outline">{r}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Hostel */}
        {college.hostel?.available && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BedDouble className="h-4 w-4" /> Hostel Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><p className="text-sm text-muted-foreground">Boys Capacity</p><p className="font-semibold">{college.hostel.boys_capacity || "N/A"}</p></div>
                <div><p className="text-sm text-muted-foreground">Girls Capacity</p><p className="font-semibold">{college.hostel.girls_capacity || "N/A"}</p></div>
                <div><p className="text-sm text-muted-foreground">Mess Fee</p><p className="font-semibold">{fmt(college.hostel.mess_fee)}</p></div>
              </div>
              {college.hostel.facilities && college.hostel.facilities.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Facilities</p>
                  <div className="flex flex-wrap gap-2">
                    {college.hostel.facilities.map((f) => (
                      <Badge key={f} variant="outline">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {college.contact?.phone && (
              <p className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {college.contact.phone}</p>
            )}
            {college.contact?.email && (
              <p className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {college.contact.email}</p>
            )}
            {college.contact?.address && (
              <p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /> {college.contact.address}</p>
            )}
            {college.website && (
              <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Globe className="h-4 w-4" /> {college.website}
              </a>
            )}
            {college.affiliation && (
              <p className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" /> {college.affiliation}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
