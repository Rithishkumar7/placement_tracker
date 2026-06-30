import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassCardProps extends React.ComponentPropsWithoutRef<typeof Card> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => (
    <Card ref={ref} className={cn("glass-panel border-white/5", className)} {...props} />
  )
)
GlassCard.displayName = "GlassCard"

export { GlassCard, CardHeader as GlassCardHeader, CardTitle as GlassCardTitle, CardDescription as GlassCardDescription, CardContent as GlassCardContent, CardFooter as GlassCardFooter }
