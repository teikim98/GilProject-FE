export default function Loading() {
    return (
        <div className='p-4 space-y-4 overflow-auto no-scrollbar'>
            <div className="w-full fade-in  animate-fade-in">
                {/* 현재 페이지 레이아웃 유지하면서 스켈레톤 보여주기 */}
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse" />
                    <div className="h-32 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse" />
                </div>
            </div>
        </div>
    )
}