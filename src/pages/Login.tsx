import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      window.location.href = "/dashboard";
    }
  }, [user, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signIn(email, password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex gradient-subtle">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 text-center text-white space-y-6 max-w-lg">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm shadow-glow">
              <Brain className="w-16 h-16 animate-pulse-slow" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight">
            KnowMap
          </h1>
          
          <p className="text-xl text-white/90 leading-relaxed">
            Cross-Domain Knowledge Mapping Using AI
          </p>
          
          <div className="pt-6 space-y-3 text-white/80">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>AI-Powered Entity Recognition</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-100" />
              <span>Semantic Relation Extraction</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-200" />
              <span>Interactive Knowledge Graphs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-elegant p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center lg:hidden mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-muted-foreground">
                Sign in to access your knowledge graphs
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create Account
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Secured with JWT authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
