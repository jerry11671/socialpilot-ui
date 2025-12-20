'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface SheetContentProps {
  className?: string
  children: React.ReactNode
  onClose?: () => void
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      {children}
    </div>
  )
}

const SheetContent = ({ className, children, onClose }: SheetContentProps) => {
  return (
    <div className={cn(
      'fixed right-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50',
      className
    )}>
      {children}
    </div>
  )
}

export { Sheet, SheetContent }