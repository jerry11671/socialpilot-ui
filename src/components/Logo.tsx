'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Image
        src="/logo.png"
        alt="You Fit Run Am"
        width={size === 'sm' ? 120 : size === 'md' ? 160 : 200}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
        className={cn('object-contain', sizeClasses[size])}
        priority
      />
    </div>
  )
}