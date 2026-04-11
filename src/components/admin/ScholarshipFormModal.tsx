import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface Props {
  scholarship?: any;
  onClose: () => void;
  onSaved: () => void;
}

export function ScholarshipFormModal({ scholarship, onClose, onSaved }: Props) {
  const isEdit = !!scholarship;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: scholarship?.name || "",
    description: scholarship?.description || "",
    eligibility: scholarship?.eligibility || "",
    amount: scholarship?.amount || "",
    deadline: scholarship?.deadline || "",
    how_to_apply: scholarship?.how_to_apply || "",
    website: scholarship?.website || "",
    category: scholarship?.category || "merit",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("scholarships").update(form).eq("id", scholarship.id));
    } else {
      ({ error } = await supabase.from("scholarships").insert(form));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Scholarship updated" : "Scholarship added" });
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-lg">{isEdit ? "Edit Scholarship" : "Add Scholarship"}</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="merit">Merit-based</option>
              <option value="sc_st">SC/ST</option>
              <option value="obc">OBC</option>
              <option value="minority">Minority</option>
              <option value="need">Need-based</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Eligibility</Label>
            <Textarea value={form.eligibility} onChange={(e) => set("eligibility", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="₹50,000/year" />
            </div>
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input value={form.deadline} onChange={(e) => set("deadline", e.target.value)} placeholder="March 31, 2026" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>How to Apply</Label>
            <Textarea value={form.how_to_apply} onChange={(e) => set("how_to_apply", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Website</Label>
            <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Add Scholarship"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
