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
    sm: 'h-12',
    md: 'h-20',
    lg: 'h-24'
  }

  return (
    <div className={cn('flex items-center m-0 p-0', className)}>
      <Image
        src="/logo.png"
        alt="You Fit Run Am"
        width={size === 'sm' ? 180 : size === 'md' ? 280 : 360}
        height={size === 'sm' ? 48 : size === 'md' ? 80 : 96}
        className={cn('object-contain m-0 p-0', sizeClasses[size])}
        priority
      />
    </div>
  )
}