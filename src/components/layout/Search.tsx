'use client'

import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useSearchStore } from '@/store/useSearchStore'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SearchPageProps {
    onClose: () => void
}

export default function SearchPage({ onClose }: SearchPageProps) {
    const [localQuery, setLocalQuery] = useState('')
    const { setQuery, searchHistory, removeHistoryItem, clearHistory, setSearchHistory } = useSearchStore()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!localQuery.trim()) return;

        const newHistory = [
            localQuery,
            ...searchHistory.filter((item) => item !== localQuery),
        ].slice(0, 10);

        if (typeof window !== "undefined") {
            localStorage.setItem("searchHistory", JSON.stringify(newHistory));
            useSearchStore.getState().setSearchHistory(newHistory);
        }

        setQuery(localQuery)
        onClose()
        setLocalQuery("")
    }

    const handleHistoryClick = (item: string, e: React.FormEvent) => {
        setQuery(item)
        onClose()
    }

    useEffect(() => {
        useSearchStore.getState().initializeHistory()
    }, [])

    return (
        <Card className="h-full border-none">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <CardHeader className="px-4 py-2 space-y-0">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <Input
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            placeholder="산책로 검색..."
                            className="flex-1 border-none focus-visible:ring-0"
                            autoFocus
                        />
                        <Button type="submit" variant="ghost" size="sm">
                            검색
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <div className="h-full">
                        {!localQuery && (
                            <div className="p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm font-medium">최근 검색어</CardTitle>
                                    {searchHistory.length > 0 && (
                                        <Button
                                            onClick={clearHistory}
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground"
                                        >
                                            전체 삭제
                                        </Button>
                                    )}
                                </div>
                                {searchHistory.length > 0 ? (
                                    <ul className="space-y-2">
                                        {searchHistory.map((item) => (
                                            <li key={item} className="flex items-center justify-between group">
                                                <Button
                                                    onClick={(e) => handleHistoryClick(item, e)}
                                                    variant="ghost"
                                                    className="w-full justify-start font-normal"
                                                >
                                                    {item}
                                                </Button>
                                                <Button
                                                    onClick={() => removeHistoryItem(item)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-50 group-hover:opacity-100"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        최근 검색 기록이 없습니다
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}