"use client"
import BackHeader from "@/components/layout/BackHeader";
import LocationSelector from "@/components/layout/LocationSelector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import BoardList from "./BoardList";
import SearchPage from "../../../components/layout/Search";
import { useSearchParams } from 'next/navigation';
import { useLocationStore } from "@/store/useLocationStore";
import { useSearchStore } from "@/store/useSearchStore";

export default function Board() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchParams = useSearchParams();
    const setSelectedLocation = useLocationStore(state => state.setSelectedLocation);
    const setQuery = useSearchStore(state => state.setQuery);

    // URL의 태그 파라미터 처리
    useEffect(() => {
        const tag = searchParams.get('tag');
        if (tag) {
            setSelectedLocation('검색결과');
            setQuery('');
        }
    }, [searchParams, setSelectedLocation, setQuery]);

    return (
        <div className="flex flex-col animate-fade-in pb-20">
            <BackHeader content="산책길 목록" />
            <div className="w-full h-full flex justify-between">
                <LocationSelector />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                    <Search className="!w-7 !h-7" />
                </Button>

                <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <DialogContent
                        className="animate-slide-up w-4/5 h-[80vh] sm:h-[600px] p-0 rounded-lg"
                    >
                        <SearchPage onClose={() => setIsSearchOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <BoardList />
        </div>
    )
}