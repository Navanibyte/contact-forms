import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./integration";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authSchema = z.object({
    email: z.string().trim().email({ message: "Invalid email address" }).max(255),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
});

const Auth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.auth.getSession().then(({ data: { session } }: any) => {
            if (session) {
                navigate("/dashboard");
            }
        });
    }, [navigate]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validated = authSchema.parse({ email, password });

            const { error } = await supabase.auth.signUp({
                email: validated.email,
                password: validated.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`
                }
            });

            if (error) throw error;

            toast.success("Account created! Please check your email.");
            navigate("/dashboard");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                toast.error(error.errors[0].message);
            } else {
                toast.error(error.message || "Failed to sign up");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validated = authSchema.parse({ email, password });

            const { error } = await supabase.auth.signInWithPassword({
                email: validated.email,
                password: validated.password,
            });

            if (error) throw error;

            toast.success("Signed in successfully!");
            navigate("/dashboard");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                toast.error(error.errors[0].message);
            } else {
                toast.error(error.message || "Failed to sign in");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
            <Card className="w-full max-w-md shadow-strong">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        FormCraft
                    </CardTitle>
                    <CardDescription>Create beautiful forms in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email">Email</Label>
                                    <Input
                                        id="signin-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signin-password">Password</Label>
                                    <Input
                                        id="signin-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Auth;