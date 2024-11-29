'use client'

import { useEffect, useState } from 'react';
import { Post } from '@/types/types';
import BoardCard from '@/components/layout/BoardListCard';
import { getPostNear, getPosts, getPostsByKeyword } from '@/api/post';
import { useSearchStore } from '@/store/useSearchStore';
import { Search } from 'lucide-react';
import { useLocationStore } from '@/store/useLocationStore';

export default function BoardList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialUserLocation, setInitialUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { query } = useSearchStore();
    const { selectedLocation } = useLocationStore();
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const size = 10;

    useEffect(() => {
        setPage(0); // 위치 변경 시 페이지 초기화
        setPosts([]); // 위치 변경 시 posts 초기화
        setError(null); // 에러 상태도 초기화

        if (selectedLocation === '내 현재위치') {
            setLoading(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setInitialUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        setLoading(false);
                    },
                    (error) => {
                        console.error('위치 가져오기 실패:', error);
                        setError('위치 정보를 가져오는데 실패했습니다.');
                        setLoading(false);
                    }
                );
            }
        } else {
            // "집 주변" 선택 시 위치 정보 초기화
            setInitialUserLocation(null);
            setLoading(false);
        }
    }, [selectedLocation]);

    // 게시물 가져오기
    useEffect(() => {
        fetchPosts();
    }, [page, selectedLocation, initialUserLocation]);

    useEffect(() => {
        if (query) {
            setPage(0);
            setPosts([]);
            useLocationStore.getState().setSelectedLocation('검색결과');
            fetchPosts();
        }
    }, [query]);


    useEffect(() => {
        // 컴포넌트 마운트 시 위치를 '내 현재위치'로 설정
        useLocationStore.getState().setSelectedLocation('내 현재위치')

        return () => {
            // 컴포넌트 언마운트 시 검색어 초기화
            useSearchStore.getState().setQuery('')
        }
    }, [])

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null); // 새 요청 시작할 때 에러 초기화
            setPosts([]);

            let response;
            if (selectedLocation === '검색결과') {
                console.log(query)
                response = await getPostsByKeyword(query, page, size);

                // 검색 결과가 없을 때 posts를 빈 배열로 설정
                if (!response.content || response.content.length === 0) {
                    setPosts([]);
                    setTotalElements(0);
                    return;
                }
            } else if (selectedLocation === '내 현재위치') {
                if (!initialUserLocation) return;
                response = await getPostNear(initialUserLocation.lat, initialUserLocation.lng, page, size);
            } else {
                response = await getPosts(page, size);
            }

            const fetchedPosts = response.content || [];
            setTotalElements(response.totalElements);

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
            setPosts([]); // 에러 발생 시 posts 초기화
        } finally {
            setLoading(false);
        }
    };

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

            {!loading && !error && posts.length > 0 ? (
                <>
                    {posts.map((post) => (
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
