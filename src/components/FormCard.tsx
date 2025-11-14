import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

interface FormCardProps {
    title: string;
    description: string;
    category: string;
    categoryColor: "contact" | "seo" | "info";
    imageUrl: string;
}

const FormCard = ({ title, description, category, categoryColor, imageUrl }: FormCardProps) => {
    const badgeClasses = {
        contact: "bg-badge-contact text-badge-contact-foreground",
        seo: "bg-badge-seo text-badge-seo-foreground",
        info: "bg-badge-info text-badge-info-foreground",
    };

    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover border border-border bg-card animate-fade-in">
            <div className="aspect-[4/3] bg-secondary overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${badgeClasses[categoryColor]}`}>
                        {category}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        Use Template
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default FormCard;
