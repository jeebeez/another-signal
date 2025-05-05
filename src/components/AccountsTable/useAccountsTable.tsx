import { useState, useMemo } from 'react'
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  PaginationState,
  CellContext,
} from '@tanstack/react-table'
import type { Account } from '@/lib/types'
import { MaybeTooltip } from '@/components/MaybeTooltip'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { MagicIcon } from '../icons/MagicColumnIcon'

interface UseAccountsTableProps {
  filteredAccounts: Account[]
  initialPageSize?: number
}

export function useAccountsTable({
  filteredAccounts,
  initialPageSize = 10,
}: UseAccountsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  const renderCell = (cell: CellContext<Account, string>) => {
    return (
      <>
        {cell.getValue() ? (
          <MaybeTooltip text={cell.getValue() || ''} tooltipSide="top" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </>
    )
  }

  const renderMagicHeader = (question: string) => {
    return (
      <div className="flex items-center gap-2">
        <MagicIcon size={16} className="flex-shrink-0" />
        <MaybeTooltip text={question} maxWidth="100%" tooltipSide="top" />
      </div>
    )
  }

  const columns = useMemo<ColumnDef<Account>[]>(
    () => {
      // Base static columns
      const staticColumns: ColumnDef<Account>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableHiding: true,
          enableSorting: true,
          cell: renderCell,
        },
        {
          accessorKey: 'domain',
          header: 'Domain',
          enableHiding: true,
          enableSorting: true,
          cell: renderCell,
        },
        {
          accessorKey: 'linkedinUrl',
          header: 'LinkedIn',
          enableHiding: true,
          enableSorting: true,
          cell: renderCell,
        },
        {
          accessorKey: 'signalDescription',
          header: 'Signal',
          enableHiding: true,
          enableSorting: true,
          cell: renderCell,
        },
        {
          accessorKey: 'signalLink',
          header: 'Signal Link',
          enableHiding: true,
          enableSorting: true,
          cell: renderCell,
        },
        {
          accessorKey: 'employees',
          header: 'Employees',
          enableHiding: true,
          enableSorting: true,
          cell: renderCell,
        },
        {
          accessorKey: 'fundingStage',
          header: 'Funding Stage',
          enableHiding: true,
          enableSorting: true,
          cell: renderCell,
        },
      ]

      // Extract unique magic column questions from the current data
      const magicQuestions = new Set<string>()
      // Ensure accounts is an array before iterating
      if (Array.isArray(filteredAccounts)) {
        filteredAccounts.forEach((account) => {
          account.magicColumns?.forEach((mc) => {
            magicQuestions.add(mc.question)
          })
        })
      }

      // Create dynamic columns for each unique magic question
      const dynamicMagicColumns: ColumnDef<Account>[] = Array.from(magicQuestions).map(
        (question) => ({
          id: question,
          header: () => renderMagicHeader(question),
          enableSorting: true,
          enableHiding: true,
          cell: ({ row }) => {
            const magicCol = row.original.magicColumns?.find((mc) => mc.question === question)

            if (!magicCol) {
              return null
            }

            return (
              <div className="flex items-center justify-start gap-2">
                {magicCol.generated.answer}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="flex-shrink-0 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        {magicCol.generated.reasoning || 'No reasoning available'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          },
        })
      )

      return [...staticColumns, ...dynamicMagicColumns]
    },
    [filteredAccounts] // Dependency array requires accounts
  )

  const table = useReactTable({
    data: filteredAccounts,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualSorting: false,
  })

  const total = filteredAccounts.length

  return {
    table,
    total,
    pagination,
  }
}
