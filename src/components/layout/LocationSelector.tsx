'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ChevronsUpDown, Check } from 'lucide-react'
import { useState } from 'react'

type Location = {
    value: string;
    label: string;
}

const location: Location[] = [
    {
        value: "내 현재위치",
        label: "내 현재위치",
    },
    {
        value: "집 주변",
        label: "집 주변",
    },
]


export default function LocationSelector() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("내 현재위치")

    const handleSelect = (currentValue: string) => {
        setValue(currentValue)
        setOpen(false)
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? location.find((location) => location.value === value)?.label
                        : "Select location..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {location.map((location) => (
                                <CommandItem
                                    key={location.value}
                                    value={location.value}
                                    onSelect={handleSelect}
                                >
                                    {location.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === location.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>)
}
