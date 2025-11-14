import { ChevronDown, X } from "lucide-react";
import { Button } from "../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
    const formTypes = [
        { name: "Order Forms", count: 2718 },
        { name: "Registration Forms", count: 3572 },
        { name: "Event Registration Forms", count: 1874 },
        { name: "Payment Forms", count: 856 },
        { name: "Application Forms", count: 4450 },
        { name: "File Upload Forms", count: 170 },
        { name: "Booking Forms", count: 952 },
        { name: "Survey Templates", count: 4166 },
        { name: "Consent Forms", count: 1892 },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static top-0 left-0 z-50
          w-80 border-r border-border bg-background p-6 h-screen lg:h-[calc(100vh-73px)] overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Close button for mobile */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden absolute top-4 right-4"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <div className="space-y-6 mt-12 lg:mt-0">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3">SORT BY</h3>
                        <Select defaultValue="popular">
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popular">Popular</SelectItem>
                                <SelectItem value="recent">Recent</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3">FORM LAYOUT</h3>
                        <Select defaultValue="classic">
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-foreground">TYPES</h3>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-accent hover:text-accent/80">
                                All
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formTypes.map((type) => (
                                <button
                                    key={type.name}
                                    className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary transition-colors text-left group"
                                >
                                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                        {type.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{type.count.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
