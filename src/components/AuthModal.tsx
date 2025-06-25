
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, TrendingUp, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();

  const handleAuth = async (type: "login" | "signup") => {
    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const { error } = type === "login" 
        ? await signIn(email, password)
        : await signUp(email, password, fullName);
      
      if (!error) {
        onSuccess();
        onClose();
        setEmail("");
        setPassword("");
        setFullName("");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, text: "Real-time COT data" },
    { icon: Zap, text: "Live economic calendar" },
    { icon: Star, text: "AI-powered news analysis" },
    { icon: Check, text: "Custom dashboard widgets" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Join Quantide
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Auth Forms */}
          <div className="space-y-4">
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="login" className="data-[state=active]:bg-gray-700">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gray-700">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-300">{error}</span>
                </div>
              )}
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="trader@example.com"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    onClick={() => handleAuth("login")}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="John Doe"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="trader@example.com"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    onClick={() => handleAuth("signup")}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right side - Features & Pricing */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What you'll get:</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Choose Your Plan:</h3>
              
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Free</CardTitle>
                    <Badge variant="outline" className="bg-gray-700 text-gray-300">
                      Current
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    Get started with basic features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">$0</div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Delayed data (15 min)</li>
                    <li>• Limited news articles</li>
                    <li>• Basic charts</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Premium</CardTitle>
                    <Badge className="bg-green-600 text-white">
                      Recommended
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300">
                    Full access to all trading data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    $29<span className="text-sm font-normal text-gray-400">/month</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Real-time data feeds</li>
                    <li>• Unlimited news & analysis</li>
                    <li>• Advanced charts & indicators</li>
                    <li>• Custom alerts</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
