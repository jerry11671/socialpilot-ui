'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
  continuous?: boolean
  language?: string
}

interface UseVoiceInputReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
  error: string | null
}

export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const {
    onResult,
    onError,
    continuous = false,
    language = 'en-US',
  } = options

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check for browser support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = continuous
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = language

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              finalTranscript += result[0].transcript
            } else {
              interimTranscript += result[0].transcript
            }
          }

          const currentTranscript = finalTranscript || interimTranscript
          setTranscript(currentTranscript)
          
          if (finalTranscript && onResult) {
            onResult(finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          let errorMessage = 'An error occurred during speech recognition'
          
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.'
              break
            case 'audio-capture':
              errorMessage = 'No microphone found. Please check your microphone.'
              break
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone access.'
              break
            case 'network':
              errorMessage = 'Network error. Please check your connection.'
              break
            case 'aborted':
              errorMessage = 'Speech recognition was aborted.'
              break
            default:
              errorMessage = `Speech recognition error: ${event.error}`
          }
          
          setError(errorMessage)
          setIsListening(false)
          
          if (onError) {
            onError(errorMessage)
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setError(null)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [continuous, language, onResult, onError])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setError(null)
      try {
        recognitionRef.current.start()
      } catch (err) {
        // Recognition might already be running
        console.error('Failed to start recognition:', err)
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    error,
  }
}



