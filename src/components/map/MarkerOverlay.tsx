import { OverlayProps } from "@/types/types";
import { X } from "lucide-react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function MarkerOverlay({ content, imageUrl, pinId, position, visible, onClose }: OverlayProps) {
    const [showImageModal, setShowImageModal] = useState(false);

    if (!visible) return null;

    return (
        <>
            <CustomOverlayMap
                position={{
                    lat: parseFloat(position.latitude),
                    lng: parseFloat(position.longitude)
                }}
                yAnchor={1.2}
                clickable={true}
            >
                <div
                    className="marker-overlay relative bottom-12 -left-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg min-w-[200px] max-w-[300px]"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800" />
                    <div className="relative p-4">
                        <button
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            <X size={16} />
                        </button>
                        <div className="mb-2 pr-6 marker-overlay-content">
                            {content}
                        </div>
                        {imageUrl && (
                            <div className="w-full mt-2">
                                <AspectRatio ratio={4 / 3} className="bg-muted">
                                    <img
                                        src={imageUrl}
                                        alt="Marker image"
                                        className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setShowImageModal(true)}
                                    />
                                </AspectRatio>
                            </div>
                        )}
                    </div>
                </div>
            </CustomOverlayMap>

            {imageUrl && showImageModal && (
                <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
                    <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0">
                        <DialogHeader className="p-4">
                            <DialogTitle>이미지 상세보기</DialogTitle>
                        </DialogHeader>
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src={imageUrl}
                                alt="Full size marker image"
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}