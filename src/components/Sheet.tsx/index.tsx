'use client'

import React from 'react'
import {
  Sheet as UISheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { X } from 'lucide-react'

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
  children: React.ReactNode
}

const Sheet = ({
  open,
  onOpenChange,
  title,
  description,
  side = 'right',
  className,
  children,
}: SheetProps) => {
  return (
    <UISheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={className}>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>

        {(title || description) && (
          <SheetHeader className="mb-6 border-b border-border px-4 py-4">
            {title && <SheetTitle>{title}</SheetTitle>}
          </SheetHeader>
        )}
        <div className="px-4 py-2">{children}</div>
      </SheetContent>
    </UISheet>
  )
}

export default Sheet
