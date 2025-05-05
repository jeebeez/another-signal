'use client'

import { StarsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  size?: number
  className?: string
  onClick?: () => void
}

export function MagicIcon({ size = 16, className, onClick }: Props) {
  return <StarsIcon size={size} className={cn(className)} onClick={onClick} />
}
