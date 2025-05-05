'use client'

import type React from 'react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface QuestionInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  className?: string
  required?: boolean
  id?: string
}

/**
 * Input component for magic column questions
 */
export function QuestionInput({
  value,
  onChange,
  maxLength = 200,
  placeholder = 'Enter your question...',
  className,
  required = true,
  id = 'magic-column-question',
}: QuestionInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  const charactersRemaining = maxLength - value.length
  const isNearLimit = charactersRemaining <= 20

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          Question {required && <span className="text-destructive">*</span>}
        </Label>
        <span className={cn('text-xs', isNearLimit ? 'text-amber-500' : 'text-muted-foreground')}>
          {charactersRemaining} characters remaining
        </span>
      </div>

      <Textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
        required={required}
      />
    </div>
  )
}
