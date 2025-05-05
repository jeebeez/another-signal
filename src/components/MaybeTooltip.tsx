'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface MaybeTooltipProps {
  text: string
  className?: string
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  tooltipAlign?: 'start' | 'center' | 'end'
  maxWidth?: string
  as?: React.ElementType
}

export function MaybeTooltip({
  text,
  className,
  tooltipSide = 'top',
  tooltipAlign = 'center',
  maxWidth = '100%',
  as: Component = 'span',
}: MaybeTooltipProps) {
  const textRef = useRef<HTMLElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current
      if (element) {
        setIsTruncated(element.scrollWidth > element.clientWidth)
      }
    }

    checkTruncation()

    // Re-check on window resize
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [text])

  if (!isTruncated) {
    return (
      <Component ref={textRef} className={cn('block truncate', className)} style={{ maxWidth }}>
        {text}
      </Component>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Component
            ref={textRef}
            className={cn('block cursor-default truncate', className)}
            style={{ maxWidth }}
          >
            {text}
          </Component>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" side={tooltipSide} align={tooltipAlign}>
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
