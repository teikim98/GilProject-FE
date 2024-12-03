'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import BoardCard from '@/components/layout/BoardListCard';
import { Loader, Search } from 'lucide-react';
import { useSearchStore } from '@/store/useSearchStore';
import { useLocationStore } from '@/store/useLocationStore';
import { useBoardListQuery } from '@/hooks/queries/usePostQuery';
import { useSearchParams } from 'next/navigation';

export default function BoardList() {
    const [initialUserLocation, setInitialUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { query, setQuery } = useSearchStore();
    const { selectedLocation, setSelectedLocation } = useLocationStore();
    const searchParams = useSearchParams();
    const tagParam = searchParams.get('tag');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useBoardListQuery(selectedLocation, query, initialUserLocation, tagParam);

    // URL의 태그 파라미터 처리
    useEffect(() => {
        if (tagParam) {
            setSelectedLocation('검색결과');
            setQuery('');
        }
    }, [tagParam, setSelectedLocation, setQuery]);

    // Intersection Observer 설정
    const observer = useRef<IntersectionObserver>();
    const lastPostElementRef = useCallback((node: HTMLDivElement) => {
        if (isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    // 위치 관련 효과
    useEffect(() => {
        if (selectedLocation === '내 현재위치') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setInitialUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error('위치 가져오기 실패:', error);
                    }
                );
            }
        } else {
            setInitialUserLocation(null);
        }
    }, [selectedLocation]);

    // 검색어 변경 시 처리
    useEffect(() => {
        if (query && selectedLocation !== '검색결과') {
            setSelectedLocation('검색결과');
        }
    }, [query, selectedLocation, setSelectedLocation]);

    // 컴포넌트 언마운트 시 검색어 초기화
    useEffect(() => {
        return () => {
            useSearchStore.getState().setQuery('');
            setSelectedLocation('내 현재위치');
        }
    }, []);

    // 모든 페이지의 게시물을 하나의 배열로 병합
    const posts = data?.pages.flatMap(page => page.content) ?? [];

    // 거리 계산이 필요한 경우 처리
    const postsWithDistance = initialUserLocation && selectedLocation === '내 현재위치'
        ? posts.map(post => ({
            ...post,
            distanceFromUser: calculateDistance(
                initialUserLocation,
                { lat: post.startLat, lng: post.startLong }
            )
        }))
        : posts;

    return (
        <div className="space-y-4 mt-4">
            {postsWithDistance.map((post, index) => (
                <div
                    key={post.postId}
                    ref={postsWithDistance.length === index + 1 ? lastPostElementRef : undefined}
                >
                    <BoardCard post={post} />
                </div>
            ))}

            {postsWithDistance.length === 0 && !isLoading && (
                <div className='flex justify-center items-center h-40'>
                    <p className="text-gray-500">게시물이 없습니다...</p>
                </div>
            )}

            {(isLoading || isFetchingNextPage) && (
                <div className="flex justify-center items-center h-20">
                    <Loader className="w-6 h-6 animate-spin text-primary" />
                </div>
            )}

            {isError && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">게시글을 불러오는데 실패했습니다.</p>
                </div>
            )}

            {!isLoading && !isError && postsWithDistance.length === 0 && (query || tagParam) && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Search className="w-12 h-12 mb-4" />
                    <p className="text-lg mb-2">검색 결과가 없습니다</p>
                    <p className="text-sm">다른 키워드로 검색해보세요</p>
                </div>
            )}
        </div>
    );
}

// 거리 계산 함수 (km)
function calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
): number {
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}