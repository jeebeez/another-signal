'use client'

import type React from 'react'
import { useState, useMemo } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { MagicColumnSideSheet } from '@/components/MagicColumSheet'
import { Pagination } from '@/components/Pagination'
import { useAllAccounts } from '@/api/accounts'
import type { Account } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAccountsTable } from './useAccountsTable'
import { FilterBar, type Filter } from '@/components/AccountsTable/FilterBar'
import { flexRender } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'

/**
 * Main accounts table component
 */
export function AccountsTable() {
  const router = useRouter()

  const [isMagicColumnOpen, setIsMagicColumnOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Filter[]>([
    {
      id: 'fundingStage',
      filter: 'Funding Stage',
      options: [],
    },
  ])

  const { data: accountsData, isLoading: isLoadingAccounts } = useAllAccounts()

  const accounts = useMemo(() => accountsData || [], [accountsData])

  // Get available filter options from the data
  const filterOptions = useMemo(() => {
    if (!accounts.length) return []

    // Extract unique funding stages
    const fundingStages = new Set<string>()

    // We can add more filters here
    accounts.forEach((account) => {
      if (account.fundingStage) fundingStages.add(account.fundingStage)
    })

    const filters = []

    if (fundingStages.size > 0) {
      filters.push({
        id: 'fundingStage',
        filter: 'Funding Stage',
        options: Array.from(fundingStages),
      })
    }

    return filters
  }, [accounts])

  // Filter accounts based on search term and active filters
  const filteredAccounts = useMemo(() => {
    if (!accounts.length) return []

    // Start with all accounts
    let filtered = [...accounts]

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter((account) =>
        Object.values(account).some(
          (value) => value && String(value).toLowerCase().includes(lowerSearchTerm)
        )
      )
    }

    const fundingStageFilter = activeFilters.find((filter) => filter.id === 'fundingStage')

    if (fundingStageFilter?.options?.length) {
      filtered = filtered.filter((account) =>
        fundingStageFilter.options.includes(account.fundingStage)
      )
    }

    return filtered
  }, [accounts, searchTerm, activeFilters])

  const { table, total, pagination } = useAccountsTable({
    filteredAccounts,
    initialPageSize: 10,
  })

  const currentRows = table.getRowModel().rows
  const pageCount = table.getPageCount()

  const handleFilterChange = (filters: Filter[]) => {
    setActiveFilters(filters)
    table.setPageIndex(0)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    table.setPageIndex(0)
  }

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1)
  }

  const handleRowClick = (account: Account) => {
    router.push(`/${btoa(account.name)}`)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounts</h1>

        <Button
          size="sm"
          className={'gap-2'}
          onClick={() => setIsMagicColumnOpen(true)}
          data-testid="add-magic-column-button"
        >
          <PlusCircle size={16} />
          <span>Add Magic Column</span>
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {filterOptions.length > 0 && (
            <FilterBar
              filters={filterOptions}
              onFilterChange={handleFilterChange}
              className="flex-shrink-0"
            />
          )}
        </div>

        {total > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {currentRows.length} of {total} accounts
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
            {isLoadingAccounts ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="py-8 text-center">
                  Loading accounts...
                </TableCell>
              </TableRow>
            ) : currentRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="py-8 text-center">
                  {searchTerm || activeFilters.length > 0
                    ? 'No matching accounts found'
                    : 'No accounts found'}
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer"
                  data-testid={`account-row-${row.original.name}`}
                  data-state={row.getIsSelected() ? 'selected' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="overflow-hidden text-ellipsis">
                      <div className="overflow-hidden text-ellipsis">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalPages={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {isMagicColumnOpen && (
        <MagicColumnSideSheet onOpenChange={() => setIsMagicColumnOpen(false)} />
      )}
    </div>
  )
}
