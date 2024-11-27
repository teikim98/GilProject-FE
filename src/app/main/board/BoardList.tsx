'use client'

import { useEffect, useState } from 'react';
import { Post } from '@/types/types';
import BoardCard from '@/components/layout/BoardListCard';
import { getPostNear, getPosts } from '@/api/post';
import { useSearchStore } from '@/store/useSearchStore';
import { Search } from 'lucide-react';
import { useLocationStore } from '@/store/useLocationStore';

export default function BoardList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialUserLocation, setInitialUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { searchTerm } = useSearchStore();
    const { selectedLocation } = useLocationStore();
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const size = 10;
    const [isInitialLocationSet, setIsInitialLocationSet] = useState(false);



    // 현재 위치 가져오기
    useEffect(() => {
        if (!isInitialLocationSet && selectedLocation === '내 현재위치' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setInitialUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setIsInitialLocationSet(true);
                },
                (error) => {
                    console.error('위치 가져오기 실패:', error);
                    setError('위치 정보를 가져오는데 실패했습니다.');
                    setIsInitialLocationSet(true);
                }
            );
        }
    }, [selectedLocation, isInitialLocationSet]);

    // API로 게시글 데이터 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                let response;

                if (selectedLocation === '내 현재위치' && initialUserLocation) {
                    response = await getPostNear(initialUserLocation.lat, initialUserLocation.lng, page, size);
                } else {
                    response = await getPosts(page, size);
                }

                const fetchedPosts = response.content || [];
                setTotalElements(response.totalElements);

                // 초기 위치가 있고 현재 위치 모드일 때만 거리 계산
                if (initialUserLocation && selectedLocation === '내 현재위치') {
                    const postsWithDistance = fetchedPosts.map((post: Post) => ({
                        ...post,
                        distanceFromUser: calculateDistance(
                            initialUserLocation,
                            { lat: post.startLat, lng: post.startLong }
                        )
                    }));
                    setPosts(prev => page === 0 ? postsWithDistance : [...prev, ...postsWithDistance]);
                } else {
                    setPosts(prev => page === 0 ? fetchedPosts : [...prev, ...fetchedPosts]);
                }
            } catch (err) {
                console.error('게시글 로딩 실패:', err);
                setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (isInitialLocationSet || selectedLocation === '집 주변') {
            fetchPosts();
        }
    }, [initialUserLocation, page, searchTerm, selectedLocation, isInitialLocationSet]);

    useEffect(() => {
        return () => {
            useSearchStore.getState().submitSearch()
            useSearchStore.getState().setQuery('')
            useSearchStore.getState().setSearchTerm('')
        }
    }, [])

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4 mt-4">
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">로딩 중...</p>
                </div>
            )}

            {error && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!loading && !error && filteredPosts.length > 0 ? (
                <>
                    {filteredPosts.map((post) => (
                        <BoardCard key={post.postId} post={post} />
                    ))}
                    {totalElements > (page + 1) * size && (
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            className="w-full py-2 text-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            더 보기
                        </button>
                    )}
                </>
            ) : (
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
