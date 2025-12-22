'use client'

import { useVoiceInput } from '@/hooks/useVoiceInput'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  appendMode?: boolean // If true, append to existing text; if false, replace
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

export function VoiceInputButton({
  onTranscript,
  appendMode = true,
  className,
  size = 'md',
  showTooltip = true,
}: VoiceInputButtonProps) {
  const { isListening, isSupported, toggleListening, error } = useVoiceInput({
    onResult: (transcript) => {
      onTranscript(transcript)
    },
    continuous: false,
  })

  if (!isSupported) {
    return null // Don't render if browser doesn't support speech recognition
  }

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={toggleListening}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 animate-pulse'
            : 'bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 focus:ring-emerald-500',
          sizeClasses[size],
          className
        )}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        title={isListening ? 'Click to stop' : 'Click to speak'}
      >
        {isListening ? (
          <Mic className={cn(iconSizes[size], 'animate-pulse')} />
        ) : (
          <Mic className={iconSizes[size]} />
        )}
      </button>

      {/* Listening indicator */}
      {isListening && (
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !isListening && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Voice input
        </div>
      )}

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-xs rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  )
}

// Wrapper component for inputs that adds voice input capability
interface VoiceInputWrapperProps {
  children: React.ReactNode
  onTranscript: (text: string) => void
  className?: string
  buttonPosition?: 'left' | 'right'
  buttonSize?: 'sm' | 'md' | 'lg'
}

export function VoiceInputWrapper({
  children,
  onTranscript,
  className,
  buttonPosition = 'right',
  buttonSize = 'sm',
}: VoiceInputWrapperProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2',
          buttonPosition === 'right' ? 'right-2' : 'left-2'
        )}
      >
        <VoiceInputButton onTranscript={onTranscript} size={buttonSize} />
      </div>
    </div>
  )
}

