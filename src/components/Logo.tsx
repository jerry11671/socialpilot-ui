'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'rounded-lg bg-emerald-600 flex items-center justify-center',
        sizeClasses[size]
      )}>
        <span className="text-white font-bold text-sm">SP</span>
      </div>
      {showText && (
        <span className={cn(
          'font-bold text-gray-900',
          textSizeClasses[size]
        )}>
          SocialPilot
        </span>
      )}
    </div>
  )
}