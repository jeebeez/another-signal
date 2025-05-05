'use client'

import type React from 'react'

import { useState } from 'react'
import Sheet from '@/components/Sheet.tsx'
import { Button } from '@/components/ui/button'

import { QuestionInput } from '@/components/MagicColumSheet/QuestionInput'
import { toast } from 'sonner'
import { useGenerateMagic } from '@/api/accounts'

interface MagicColumnSideSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Side sheet component for adding a new magic column
 */
export function MagicColumnSideSheet({ open, onOpenChange }: MagicColumnSideSheetProps) {
  const [question, setQuestion] = useState('')

  const { mutateAsync: generateMagic, isPending: isLoading } = useGenerateMagic()

  const handleClose = () => {
    onOpenChange(false)
  }

  const validateForm = (): string => {
    if (!question.trim()) {
      return 'Please enter a question'
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateForm()

    if (error) {
      toast.error(error)
      return
    }

    try {
      await generateMagic({ question })

      handleClose()
    } catch {
      toast.error('Failed to create magic column')
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Add Magic Column"
      description="Create a new magic column based on your question and target field."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <QuestionInput
          value={question}
          onChange={setQuestion}
          placeholder="Has this company raised funding in the last 6 months?"
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Add'}
        </Button>
      </form>
    </Sheet>
  )
}
