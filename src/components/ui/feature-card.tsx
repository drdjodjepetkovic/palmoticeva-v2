import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    actionText?: string;
    className?: string;
    variant?: 'default' | 'highlight';
}

export function FeatureCard({
    title,
    description,
    icon: Icon,
    href,
    actionText = "Otvori",
    className,
    variant = 'default'
}: FeatureCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <Card className={cn(
                "h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-transparent",
                variant === 'highlight'
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
                    : "bg-card hover:border-primary/20",
                className
            )}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className={cn(
                        "text-lg font-bold",
                        variant === 'highlight' ? "text-primary-foreground" : "text-foreground"
                    )}>
                        {title}
                    </CardTitle>
                    <div className={cn(
                        "p-2 rounded-full transition-colors",
                        variant === 'highlight' ? "bg-primary-foreground/10" : "bg-primary/10 group-hover:bg-primary/20"
                    )}>
                        <Icon className={cn(
                            "h-5 w-5",
                            variant === 'highlight' ? "text-primary-foreground" : "text-primary"
                        )} />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className={cn(
                        "text-sm mb-4 line-clamp-2",
                        variant === 'highlight' ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                        {description}
                    </p>
                    <div className={cn(
                        "flex items-center text-sm font-semibold transition-all group-hover:gap-2",
                        variant === 'highlight' ? "text-primary-foreground" : "text-primary"
                    )}>
                        {actionText}
                        <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
