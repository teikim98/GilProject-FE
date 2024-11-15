import { MapPin } from "lucide-react";
import { Button } from "../ui/button";

interface PinButtonProps {
    onPinClick: () => void;
    isLoading?: boolean;
}

export function PinButton({ onPinClick, isLoading = false }: PinButtonProps) {
    return (
        <div className="absolute top-4 right-4 z-10">
            <Button
                variant="secondary"
                size="sm"
                className={`flex items-center gap-2 bg-white shadow-md ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                onClick={onPinClick}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        위치 확인 중...
                    </>
                ) : (
                    <>
                        <MapPin className="w-4 h-4" />
                        핀 찍기
                    </>
                )}
            </Button>
        </div>
    );
}