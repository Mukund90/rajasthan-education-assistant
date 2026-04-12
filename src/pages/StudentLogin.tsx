import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error, variant: "destructive" });
        return;
      }
      toast({ title: "Account Created!", description: "You are now signed in." });
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error, variant: "destructive" });
        return;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl">
            {isSignUp ? "Create Student Account" : "Student Login"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Sign up to access DTE Rajasthan Student Assistant"
              : "Sign in to explore colleges, scholarships & more"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {isSignUp ? <UserPlus className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
