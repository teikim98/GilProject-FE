import { Progress } from "@/components/ui/progress";
import { useFollowStore } from "@/store/useFollowStore";
import { motion, AnimatePresence } from "framer-motion";

export function ProgressDisplay() {
    const {
        progressPercent,
        isFollowing,
        currentDistance,
        remainingDistance,
        originalRoute
    } = useFollowStore();

    if (!isFollowing || !originalRoute) return null;

    const formatDistance = (meters: number) => {
        if (meters < 1000) {
            return `${Math.round(meters)}m`;
        }
        return `${(meters / 1000).toFixed(2)}km`;
    };

    const totalDistanceMeters = originalRoute.distance * 1000;

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
                        <motion.span
                            className="text-sm font-bold text-primary"
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {progressPercent.toFixed(1)}%
                        </motion.span>
                    </div>
                    <motion.div
                        className="relative"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                    >
                        <Progress
                            value={progressPercent}
                            className="h-2"
                            style={{
                                transition: "all 0.5s ease-out"
                            }}
                        />
                    </motion.div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>시작</span>
                        <span>
                            {formatDistance(totalDistanceMeters)} 중{' '}
                            {formatDistance(currentDistance)} 완료
                        </span>
                        <span>종료</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}