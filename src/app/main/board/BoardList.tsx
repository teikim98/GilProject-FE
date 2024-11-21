'use client'

import { useEffect, useState } from 'react';
import { Post } from '@/types/types';
import BoardCard from '@/components/layout/BoardListCard';
import { getPosts } from '@/api/post';
import { useSearchStore } from '@/store/useSearchStore';
import { Search } from 'lucide-react';

export default function BoardList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { searchTerm } = useSearchStore()

    // 현재 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error('위치 가져오기 실패:', error)
            );
        }
    }, []);

    // API로 게시글 데이터 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getPosts();

                // 사용자 위치가 있다면 시작점과의 거리 계산
                if (userLocation) {
                    const postsWithDistance = fetchedPosts.map((post: Post) => ({
                        ...post,
                        distanceFromUser: calculateDistance(
                            userLocation,
                            { lat: post.startLat, lng: post.startLong }
                        )
                    }));
                    setPosts(postsWithDistance);
                } else {
                    setPosts(fetchedPosts);
                }
            } catch (err) {
                console.error('게시글 로딩 실패:', err);
                setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [searchTerm]);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!posts.length) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 dark:text-gray-400">아직 등록된 게시글이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-4">
            {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <BoardCard key={post.id} post={post} />
                ))
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
