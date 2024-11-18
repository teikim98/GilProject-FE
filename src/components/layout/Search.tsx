'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchPageProps {
    onClose: () => void
}

export default function SearchPage({ onClose }: SearchPageProps) {
    return (
        <div className="flex flex-col h-full">
            {/* 검색 헤더 */}
            <div className="flex items-center gap-2 p-4 border-b">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                    placeholder="산책로 검색..."
                    className="flex-1 border-none focus-visible:ring-0"
                    autoFocus
                />
                <button
                    className=' w-0 h-0'
                    onClick={onClose}
                >
                </button>
            </div>

            {/* 검색 결과 영역 */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* 검색 결과가 여기에 표시됩니다 */}
                <div className="text-center text-gray-500">
                    검색어를 입력하세요
                </div>
            </div>
        </div>
    )
}