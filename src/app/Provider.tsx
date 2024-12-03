'use client';

import { useState, useEffect } from 'react';
import { useDarkMode } from '@/store/useDarkMode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Provider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: 1000 * 60 * 60,//데이터가 캐시되는 시간
                refetchOnWindowFocus: false,
                retry: 3,
                retryOnMount: true,
            },
        },
    }));

    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen h-screen animate-fade-in bg-gradient-to-b from-purple-400 to-purple-500 flex justify-center">
                {children}
            </div>
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}