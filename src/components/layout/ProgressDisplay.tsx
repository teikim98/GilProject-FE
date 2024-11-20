import { Progress } from "@/components/ui/progress";
import { useFollowStore } from "@/store/useFollowStore";
import { motion, AnimatePresence } from "framer-motion";

export function ProgressDisplay() {
    const {
        progressPercent,
        isFollowing,
        currentDistance,
        remainingDistance,
        originalRoute  // originalRoute 추가
    } = useFollowStore();

    if (!isFollowing || !originalRoute) return null;

    const totalDistance = originalRoute.routeData.distance * 1000; // km를 m로 변환

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-4"
            >
                <div className="bg-white rounded-lg shadow-lg p-4 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">진행률</span>
                        <span className="text-sm font-bold text-primary">
                            {progressPercent.toFixed(1)}%
                        </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>시작</span>
                        <span>{(currentDistance / 1000).toFixed(2)}m / {(totalDistance / 1000).toFixed(2)}m 완료</span>
                        <span>종료</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}