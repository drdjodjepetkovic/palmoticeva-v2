import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface DataCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: React.ReactNode
    subtitle?: React.ReactNode
    status?: React.ReactNode
    icon?: React.ReactNode
    actions?: React.ReactNode
}

const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
    ({ className, title, subtitle, status, icon, actions, children, ...props }, ref) => {
        return (
            <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex gap-3">
                        {icon && <div className="text-muted-foreground">{icon}</div>}
                        <div className="space-y-1">
                            {title && <h3 className="font-semibold leading-none tracking-tight text-foreground">{title}</h3>}
                            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                    </div>
                    {status && <div>{status}</div>}
                </CardHeader>
                <CardContent className="pb-2">
                    {children}
                </CardContent>
                {actions && (
                    <CardFooter className="bg-muted/50 px-6 py-3">
                        {actions}
                    </CardFooter>
                )}
            </Card>
        )
    }
)
DataCard.displayName = "DataCard"

export { DataCard }
