import { Card } from '@/components/ui/card';

const BoardCardSkeleton = () => {
    return (
        <Card className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex gap-3">
                    {/* Profile Image Skeleton */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />

                    <div className="space-y-2">
                        {/* Username Skeleton */}
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        {/* Date Skeleton */}
                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>

                {/* View Count Skeleton */}
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Title Skeleton */}
            <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />

            {/* Map Skeleton */}
            <div className="h-48 mb-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

            {/* Footer Section */}
            <div className="flex justify-between items-center">
                {/* Like and Comment Skeleton */}
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>

                {/* Distance, Time, and Tag Skeleton */}
                <div className="flex gap-3">
                    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        </Card>
    );
};

export default BoardCardSkeleton;