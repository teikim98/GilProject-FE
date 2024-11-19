import { Progress } from "@/components/ui/progress";
import { useFollowStore } from "@/store/useFollowStore";
import { motion, AnimatePresence } from "framer-motion";

export function ProgressDisplay() {
    const { progressPercent, isFollowing, originalRoute } = useFollowStore();

    if (!originalRoute) return null;

    return (
        <AnimatePresence>
            {isFollowing && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-24 left-0 right-0 px-4"
                >
                    <div className="bg-white rounded-lg shadow-lg p-4 space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">
                                {originalRoute.title}
                            </span>
                            <span className="text-sm font-bold text-primary">
                                {progressPercent}%
                            </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>시작</span>
                            <span className="text-xs text-gray-500">
                                총 거리: {(originalRoute.routeData.distance / 1000).toFixed(2)}km
                            </span>
                            <span>종료</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
