import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./integration";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { PlusCircle, FileText, Pencil, Trash2, LogOut, Search } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";

interface Form {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate("/auth");
            } else {
                setUser(session.user);
                loadForms();
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate("/auth");
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const loadForms = async () => {
        try {
            const { data, error } = await supabase
                .from("forms")
                .select("*")
                .order("updated_at", { ascending: false });

            if (error) throw error;
            setForms(data || []);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to load forms");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const handleDeleteForm = async (id: string) => {
        try {
            const { error } = await supabase.from("forms").delete().eq("id", id);
            if (error) throw error;
            toast.success("Form deleted successfully");
            loadForms();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to delete form");
        }
    };

    const handleNewForm = async () => {
        try {
            const { data, error } = await supabase
                .from("forms")
                .insert({
                    title: "Untitled Form",
                    description: "",
                    user_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            navigate(`/builder/${data.id}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to create form");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero">
            <header className="border-b bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        FormCraft
                    </h1>
                    <Button variant="ghost" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Your Forms</h2>
                            <p className="text-muted-foreground">Create and manage your contact forms</p>
                        </div>
                        <Button onClick={handleNewForm} size="lg" className="shadow-medium">
                            <PlusCircle className="h-5 w-5 mr-2" />
                            New Form
                        </Button>
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                ) : forms.filter(form =>
                    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                    <Card className="shadow-soft">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
                            <p className="text-muted-foreground mb-4">Get started by creating your first form</p>
                            <Button onClick={handleNewForm}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create Form
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms
                            .filter(form =>
                                form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                form.description?.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((form) => (
                                <Card key={form.id} className="shadow-soft hover:shadow-medium transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            {form.title}
                                        </CardTitle>
                                        {form.description && (
                                            <CardDescription>{form.description}</CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 "
                                                onClick={() => navigate(`/builder/${form.id}`)}
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Form</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{form.title}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteForm(form.id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;