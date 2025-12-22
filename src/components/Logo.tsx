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
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20'
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Image
        src="/logo.png"
        alt="You Fit Run Am"
        width={size === 'sm' ? 150 : size === 'md' ? 200 : 250}
        height={size === 'sm' ? 40 : size === 'md' ? 64 : 80}
        className={cn('object-contain', sizeClasses[size])}
        priority
      />
    </div>
  )
}