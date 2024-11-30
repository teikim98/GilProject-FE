'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
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
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const size = 10;

    const observer = useRef<IntersectionObserver>();
    const lastPostElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        // 위치나 검색어 변경 시 초기화
        setPage(0);
        setPosts([]);
        setHasMore(true);
        setError(null);

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
            setInitialUserLocation(null);
            setLoading(false);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (query) {
            setPage(0);
            setPosts([]);
            setHasMore(true);
            useLocationStore.getState().setSelectedLocation('검색결과');
        }
    }, [query]);

    useEffect(() => {
        return () => {
            useSearchStore.getState().setQuery('');
        }
    }, []);

    // 게시물 가져오기
    useEffect(() => {
        fetchPosts();
    }, [page, selectedLocation, initialUserLocation]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (selectedLocation === '검색결과') {
                response = await getPostsByKeyword(query, page, size);
            } else if (selectedLocation === '내 현재위치') {
                if (!initialUserLocation) return;
                response = await getPostNear(initialUserLocation.lat, initialUserLocation.lng, page, size);
            } else {
                response = await getPosts(page, size);
            }

            const fetchedPosts = response.content || [];
            setTotalElements(response.totalElements);
            setHasMore(response.totalElements > (page + 1) * size);

            if (initialUserLocation && selectedLocation === '내 현재위치') {
                const postsWithDistance = fetchedPosts.map((post: Post) => ({
                    ...post,
                    distanceFromUser: calculateDistance(
                        initialUserLocation,
                        { lat: post.startLat, lng: post.startLong }
                    )
                }));
                setPosts(prev => [...prev, ...postsWithDistance]);
            } else {
                setPosts(prev => [...prev, ...fetchedPosts]);
            }
        } catch (err) {
            console.error('게시글 로딩 실패:', err);
            setError('게시글을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 mt-4">
            {posts.map((post, index) => (
                <div
                    key={post.postId}
                    ref={posts.length === index + 1 ? lastPostElementRef : undefined}
                >
                    <BoardCard post={post} />
                </div>
            ))}

            {loading && (
                <div className="flex justify-center items-center h-20">
                    <p className="text-gray-500">로딩 중...</p>
                </div>
            )}

            {error && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!loading && !error && posts.length === 0 && (
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