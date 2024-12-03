'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ChevronsUpDown, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocationStore } from '@/store/useLocationStore'
import { useSearchStore } from '@/store/useSearchStore'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

type Location = {
    value: '내 현재위치' | '집 주변' | '검색결과';
    label: string;
}

const locations: Location[] = [
    {
        value: "내 현재위치",
        label: "내 현재위치",
    },
    {
        value: "집 주변",
        label: "집 주변",
    }
]

export default function LocationSelector() {
    const [open, setOpen] = useState(false)
    const { selectedLocation, setSelectedLocation } = useLocationStore()
    const { query } = useSearchStore()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const tag = searchParams.get('tag')

    // URL 변경 감지 및 처리
    useEffect(() => {
        if (tag) {
            setSelectedLocation('검색결과')
        } else if (selectedLocation === '검색결과' && !query) {
            // tag가 없어지고 검색결과가 선택된 상태라면 기본값으로 변경
            setSelectedLocation('집 주변')
        }
    }, [tag, query, setSelectedLocation, selectedLocation])

    const handleSelect = (currentValue: string) => {
        setSelectedLocation(currentValue as '내 현재위치' | '집 주변' | '검색결과')
        if (currentValue !== '검색결과' && tag) {
            // 태그 검색 상태에서 다른 위치 선택 시 태그 파라미터 제거
            router.push(pathname)
        }
        setOpen(false)
    }

    // 현재 선택된 위치의 표시 텍스트 결정
    const getDisplayText = () => {
        if (selectedLocation === '검색결과') {
            if (tag) return '태그';
            if (query) return '검색결과';
        }
        return locations.find((location) => location.value === selectedLocation)?.label || "위치 선택...";
    }

    // 현재 표시할 위치 옵션들
    const currentLocations = [...locations]
    if (query || tag) {
        currentLocations.push({
            value: "검색결과",
            label: "검색결과",
        })
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
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {currentLocations.map((location) => (
                                <CommandItem
                                    key={location.value}
                                    value={location.value}
                                    onSelect={handleSelect}
                                >
                                    {location.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedLocation === location.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}