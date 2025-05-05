'use client'

import { useState } from 'react'
import { Filter as FilterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type Filter = {
  id: string
  filter: string
  options: string[]
}

interface FilterBarProps {
  filters: Filter[]
  onFilterChange: (filters: Filter[]) => void
  className?: string
}

export function FilterBar({ filters, onFilterChange, className }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const updateActiveFilterCount = (filterValues: Record<string, string[]>) => {
    const count = Object.values(filterValues).reduce(
      (acc, values) => acc + (values && values.length > 0 ? 1 : 0),
      0
    )
    setActiveFilterCount(count)
  }

  const applyFilters = (filterValues: Record<string, string[]>) => {
    const appliedFilters = filters
      .map((filter) => ({
        id: filter.id,
        filter: filter.filter,
        options: filterValues[filter.filter] || [],
      }))
      .filter((filter) => filter.options.length > 0)

    onFilterChange(appliedFilters)
  }

  const handleFilterChange = (filterName: string, value: string, checked: boolean) => {
    const currentValues = selectedFilters[filterName] || []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter((item) => item !== value)
    }

    const newFilters = {
      ...selectedFilters,
      [filterName]: newValues,
    }

    setSelectedFilters(newFilters)
    updateActiveFilterCount(newFilters)
  }

  const resetFilters = () => {
    setSelectedFilters({})
    setActiveFilterCount(0)
    onFilterChange([])
  }

  const handleApply = () => {
    applyFilters(selectedFilters)
    setIsOpen(false)
  }

  const isOptionSelected = (filterName: string, optionValue: string) => {
    return (selectedFilters[filterName] || []).includes(optionValue)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <FilterIcon className="h-4 w-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Filter Accounts</h4>

            {filters.map((filter) => (
              <div key={filter.filter} className="space-y-2">
                <Label className="font-medium">{filter.filter}</Label>
                <div className="max-h-[200px] space-y-1 overflow-y-auto">
                  {filter.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${filter.filter}-${option}`}
                        checked={isOptionSelected(filter.filter, option)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(filter.filter, option, checked === true)
                        }
                      />
                      <Label
                        htmlFor={`${filter.filter}-${option}`}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-9 px-2 text-muted-foreground"
        >
          Clear
        </Button>
      )}
    </div>
  )
}
