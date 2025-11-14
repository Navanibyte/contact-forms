import { Button } from "../components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    return (
        <header className="border-b border-border bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={onMenuClick}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
                            <span className="text-xl font-bold text-foreground">FormBuilder</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
                                My Workspace
                            </a>
                            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
                                Templates
                            </a>
                            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
                                Integrations
                            </a>
                            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
                                Pricing
                            </a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                            Login
                        </Button>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <span className="hidden sm:inline">Sign Up Free</span>
                            <span className="sm:hidden">Sign Up</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
