/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { PlusCircle, FileText, Pencil, Trash2, LogOut, Search } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";

interface Form {
    form_id: string;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // -------------------------
    //  CHECK AUTH
    // -------------------------
    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/auth");
            return;
        }

        loadForms();
    }, []);

    // -------------------------
    //  FETCH ALL FORMS
    // -------------------------
    const loadForms = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/forms`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",   // 🔥 required for cookies / sessions
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to load forms");

            setForms(data);
        } catch (error: any) {
            toast.error(error.message || "Failed to load forms");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    //  LOGOUT
    // -------------------------
    const handleSignOut = () => {
        sessionStorage.removeItem("token");
        navigate("/auth");
    };

    // -------------------------
    //  DELETE FORM
    // -------------------------
    const handleDeleteForm = async (id: string) => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/forms/${id}`, {
                method: "DELETE",
                credentials: "include",   // 🔥 required for cookies / sessions

                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to delete");

            toast.success("Form deleted successfully");
            loadForms();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // -------------------------
    //  CREATE NEW FORM
    // -------------------------
    const handleNewForm = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/forms`, {
                method: "POST",
                credentials: "include",   // 🔥 required for cookies / sessions

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: "Untitled Form",
                    description: "",
                    embedded_code: "",
                    styles: {},
                    fields: [],
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to create form");

            toast.success("New form created!");

            // 🛠 FIX: Backend might return "id" or "form_id"
            const id = data?.[0]?.form_id || data?.[0]?.id;

            if (!id) {
                toast.error("Form created but no form_id returned");
                console.error("Error: Missing form_id in backend response:", data);
                return;
            }

            // 🛠 If ID is valid → navigate
            navigate(`/builder/${id}`);

        } catch (error: any) {
            toast.error(error.message);
        }
    };
    const filteredForms = forms.filter(
        (form) =>
            form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            form.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-hero">
            {/* HEADER */}
            <header className="border-b bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text">
                        FormCraft
                    </h1>
                    <Button variant="ghost" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </header>

            {/* BODY */}
            <main className="container mx-auto px-4 py-8">
                {/* HEADER SECTION */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Your Forms</h2>
                            <p className="text-muted-foreground">Create and manage your forms</p>
                        </div>

                        <Button onClick={handleNewForm} size="lg" className="shadow-medium">
                            <PlusCircle className="h-5 w-5 mr-2" />
                            New Form
                        </Button>
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                ) : filteredForms.length === 0 ? (
                    <Card className="shadow-soft">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
                            <p className="text-muted-foreground mb-4">Create your first form</p>
                            <Button onClick={handleNewForm}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create Form
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredForms.map((form) => (
                            <Card key={form.form_id} className="shadow-soft hover:shadow-medium transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        {form.title}
                                    </CardTitle>
                                    {form.description && <CardDescription>{form.description}</CardDescription>}
                                </CardHeader>

                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => navigate(`/builder/${form.form_id}`)}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>

                                        {/* DELETE BUTTON */}
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
                                                        Are you sure you want to delete "{form.title}"? This action
                                                        cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteForm(form.form_id)}>
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
