import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface Props {
  college?: any;
  onClose: () => void;
  onSaved: () => void;
}

export function CollegeFormModal({ college, onClose, onSaved }: Props) {
  const isEdit = !!college;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: college?.name || "",
    code: college?.code || "",
    type: college?.type || "engineering",
    city: college?.city || "",
    district: college?.district || "",
    established: college?.established?.toString() || "",
    website: college?.website || "",
    affiliation: college?.affiliation || "",
    image_url: college?.image_url || "",
    branches: Array.isArray(college?.branches) ? college.branches.join(", ") : "",
    fees_general: college?.fees?.general?.toString() || "",
    fees_sc_st: college?.fees?.sc_st?.toString() || "",
    placement_rate: college?.placements?.placement_rate?.toString() || "",
    avg_package: college?.placements?.average_package?.toString() || "",
    highest_package: college?.placements?.highest_package?.toString() || "",
    phone: college?.contact?.phone || "",
    email: college?.contact?.email || "",
    address: college?.contact?.address || "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      code: form.code,
      type: form.type,
      city: form.city,
      district: form.district,
      established: form.established ? parseInt(form.established) : null,
      website: form.website || null,
      affiliation: form.affiliation || null,
      image_url: form.image_url || null,
      branches: form.branches.split(",").map((b) => b.trim()).filter(Boolean),
      fees: {
        general: form.fees_general ? parseInt(form.fees_general) : undefined,
        sc_st: form.fees_sc_st ? parseInt(form.fees_sc_st) : undefined,
      },
      placements: {
        placement_rate: form.placement_rate ? parseInt(form.placement_rate) : undefined,
        average_package: form.avg_package ? parseInt(form.avg_package) : undefined,
        highest_package: form.highest_package ? parseInt(form.highest_package) : undefined,
      },
      contact: {
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
      },
      cutoffs: college?.cutoffs || {},
      hostel: college?.hostel || {},
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("colleges").update(payload).eq("id", college.id));
    } else {
      ({ error } = await supabase.from("colleges").insert(payload));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "College updated" : "College added" });
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-lg">{isEdit ? "Edit College" : "Add College"}</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>College Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Code *</Label>
              <Input value={form.code} onChange={(e) => set("code", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="engineering">Engineering</option>
                <option value="polytechnic">Polytechnic</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>District *</Label>
              <Input value={form.district} onChange={(e) => set("district", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Established</Label>
              <Input type="number" value={form.established} onChange={(e) => set("established", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Affiliation</Label>
              <Input value={form.affiliation} onChange={(e) => set("affiliation", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label>Branches (comma-separated)</Label>
            <Input value={form.branches} onChange={(e) => set("branches", e.target.value)} placeholder="CSE, ECE, ME, CE" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>General Fees (₹/year)</Label>
              <Input type="number" value={form.fees_general} onChange={(e) => set("fees_general", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>SC/ST Fees (₹/year)</Label>
              <Input type="number" value={form.fees_sc_st} onChange={(e) => set("fees_sc_st", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Placement Rate (%)</Label>
              <Input type="number" value={form.placement_rate} onChange={(e) => set("placement_rate", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Avg Package (₹)</Label>
              <Input type="number" value={form.avg_package} onChange={(e) => set("avg_package", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Highest Package (₹)</Label>
              <Input type="number" value={form.highest_package} onChange={(e) => set("highest_package", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Add College"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
