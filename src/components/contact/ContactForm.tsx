import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, CheckCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim(),
    });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
      return;
    }

    setSubmitted(true);
    toast({ title: "Submitted!", description: "We'll get back to you soon." });
  };

  if (submitted) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-4">
              Your message has been submitted successfully. We will reach out to you soon.
            </p>
            <Button onClick={() => { setSubmitted(false); setName(""); setEmail(""); setPhone(""); setMessage(""); }}>
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Contact Us
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Have questions? Fill out the form below and our team will reach out to you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Student Inquiry Form</CardTitle>
          <CardDescription>We typically respond within 24-48 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Email *</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  maxLength={255}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your query..."
                required
                maxLength={1000}
                rows={5}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
