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
import type { Prospect } from '@/lib/types'
import { MaybeTooltip } from '@/components/MaybeTooltip'

interface UseProspectsTableProps {
  filteredProspects: Prospect[]
  initialPageSize?: number
}

export function useProspectsTable({
  filteredProspects,
  initialPageSize = 10,
}: UseProspectsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  const renderCell = (cell: CellContext<Prospect, unknown>) => {
    const value = cell.getValue()
    return (
      <>
        {value ? (
          <MaybeTooltip text={String(value)} tooltipSide="top" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </>
    )
  }

  // Define columns using ColumnDef
  const columns = useMemo<ColumnDef<Prospect>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: renderCell,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: true,
        cell: renderCell,
      },
      {
        accessorKey: 'company',
        header: 'Company',
        enableSorting: true,
        cell: renderCell,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        enableSorting: true,
        cell: renderCell,
      },
      {
        accessorKey: 'linkedinUrl',
        header: 'LinkedIn',
        enableSorting: true,
        cell: renderCell,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
        cell: renderCell,
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredProspects,
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

  const total = filteredProspects.length // total based on filtered data

  return {
    table,
    total,
    pagination, // Return pagination state for the Pagination component
  }
}
