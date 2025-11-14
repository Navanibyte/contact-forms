import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FormCard from "../components/FormCard";
import SearchBar from "../components/SearchBar";
import { FileText } from "lucide-react";

import formPreview1 from "../assets/form-preview-1.jpg";
import formPreview2 from "../assets/form-preview-2.jpg";
import formPreview3 from "../assets/form-preview-3.jpg";
import formPreview4 from "../assets/form-preview-4.jpg";
import formPreview5 from "../assets/form-preview-5.jpg";
import formPreview6 from "../assets/form-preview-6.jpg";

const Index = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const forms = [
        {
            title: "Data Collection Form",
            description: "A Data Collection Form is a form template designed to systematically gather specific information or data points from individuals, organizations, or automated systems.",
            category: "Contact Forms",
            categoryColor: "contact" as const,
            imageUrl: formPreview2,
        },
        {
            title: "General Inquiry Contact Form",
            description: "A General Inquiry Contact Form is a versatile tool that streamlines communication for businesses. Simplify your processes, save time, and enhance client engagement.",
            category: "Contact Forms",
            categoryColor: "contact" as const,
            imageUrl: formPreview4,
        },
        {
            title: "Opt In Form Get Free Email Updates",
            description: "Form on the go! Allows for users to subscribe to newsletter or mailing lists to get updates from organizations or companies!",
            category: "SEO Forms",
            categoryColor: "seo" as const,
            imageUrl: formPreview3,
        },
        {
            title: "Simple Contact Form",
            description: "A clean and straightforward contact form that makes it easy for visitors to reach out. Perfect for any website looking to improve customer communication.",
            category: "Contact Forms",
            categoryColor: "contact" as const,
            imageUrl: formPreview1,
        },
        {
            title: "Event Registration Form",
            description: "Streamline your event planning with this comprehensive registration form. Collect attendee information, preferences, and payment details all in one place.",
            category: "Registration Forms",
            categoryColor: "info" as const,
            imageUrl: formPreview5,
        },
        {
            title: "Customer Feedback Survey",
            description: "Gather valuable insights from your customers with this detailed feedback form. Includes rating scales, multiple choice, and open-ended questions.",
            category: "Survey Forms",
            categoryColor: "info" as const,
            imageUrl: formPreview6,
        },
    ];

    return (
        <div className="min-h-screen">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <a href="#" className="hover:text-accent transition-colors">Form Templates</a>
                                <span>/</span>
                                <span className="text-foreground">Contact Forms</span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Contact Forms</h1>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">FormBuilder offers 546 Contact Forms</span>
                                    </div>
                                </div>
                                <SearchBar />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            {forms.map((form, index) => (
                                <FormCard key={index} {...form} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Index;
