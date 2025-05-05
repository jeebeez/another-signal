'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Pagination } from '@/components/Pagination'
import { useAccount } from '@/api/accounts'
import { useAccountProspects } from '@/api/prospects'
import type { Prospect } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useProspectsTable } from './useProspectsTable'
import { flexRender } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import type { HeaderGroup, Row, Cell } from '@tanstack/react-table'

export default function ProspectsTable() {
  const params = useParams()

  const accountName = atob(decodeURIComponent(params.id as string))

  const [searchTerm, setSearchTerm] = useState('')

  const { data: account, isLoading: isLoadingAccount } = useAccount(accountName)
  const { data: prospectsData, isLoading: isLoadingProspects } = useAccountProspects(accountName)

  const prospects = useMemo(() => prospectsData || [], [prospectsData])

  // Filter prospects based on search term
  const filteredProspects = useMemo(() => {
    if (!prospects.length) return []

    // Start with all prospects
    let filtered = [...prospects]

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter((prospect) =>
        Object.values(prospect).some(
          (value) => value && String(value).toLowerCase().includes(lowerSearchTerm)
        )
      )
    }

    return filtered
  }, [prospects, searchTerm])

  const { table, total, pagination } = useProspectsTable({
    filteredProspects,
  })

  const currentRows = table.getRowModel().rows
  const pageCount = table.getPageCount()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    table.setPageIndex(0) // Reset to first page when search changes
  }

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1)
  }

  if (isLoadingAccount) {
    return <div className="py-8 text-center">Loading account information...</div>
  }

  const isLoading = isLoadingAccount || isLoadingProspects
  const noProspects = !isLoading && prospects.length === 0

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {account?.name ? `${account.name}'s Prospects` : 'Prospects'}
        </h1>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {total > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {currentRows.length} of {total} prospects
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Prospect>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn('w-[180px]', header.column.getCanSort() ? 'cursor-pointer' : '')}
                    onClick={header.column.getToggleSortingHandler()}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <span className="ml-2">↑</span>,
                      desc: <span className="ml-2">↓</span>,
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingProspects ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="py-8 text-center">
                  Loading prospects...
                </TableCell>
              </TableRow>
            ) : null}
            {noProspects ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="py-8 text-center">
                  {searchTerm ? 'No matching prospects found' : 'No prospects found'}
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map((row: Row<Prospect>) => (
                <TableRow
                  key={row.id}
                  className="max-h-4 cursor-pointer"
                  data-testid={`prospect-row-${row.original.name}`}
                  data-state={row.getIsSelected() ? 'selected' : ''}
                >
                  {row.getVisibleCells().map((cell: Cell<Prospect, unknown>) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && pageCount > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalPages={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
