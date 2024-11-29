"use client"
import BackHeader from "@/components/layout/BackHeader";
import LocationSelector from "@/components/layout/LocationSelector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useState } from "react";
import BoardList from "./BoardList";
import SearchPage from "../../../components/layout/Search";

export default function Board() {

    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <div className="flex flex-col animate-fade-in pb-20">
            <BackHeader content="산책길 목록" />
            <div className="w-full h-full flex justify-between">
                <LocationSelector />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="hover:bg-purple-100"
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