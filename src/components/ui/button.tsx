import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-emerald-600 text-white hover:bg-emerald-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "text-black hover:bg-gray-100 hover:text-black",
        link: "text-emerald-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 sm:h-10 px-4 py-2 min-h-[44px] sm:min-h-[40px]",
        sm: "h-9 sm:h-9 rounded-md px-3 min-h-[44px] sm:min-h-[36px]",
        lg: "h-11 sm:h-12 rounded-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px] sm:min-h-[44px]",
        icon: "h-10 w-10 sm:h-10 sm:w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }