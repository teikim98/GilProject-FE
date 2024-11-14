import { useEffect, useState } from 'react';
import { Post } from '@/types/types';
import BoardCard from '@/components/layout/BoardListCard';

export default function BoardList() {
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            title: "한강 러닝 코스",
            routeData: {
                path: [
                    { lat: 37.5113, lng: 127.0980 },
                    { lat: 37.5114, lng: 127.0985 },
                ],
                markers: [
                    {
                        id: "marker-1",
                        position: { lat: 37.5113, lng: 127.0980 },
                        content: "시작점 - 잠실한강공원",
                        image: "/icons/icon-192x192.png"
                    },
                ],
                recordedTime: 45,
                distance: 5.2,
                startAddress: "서울특별시 송파구 잠실동 한강공원",
                startLocation: { lat: 37.5113, lng: 127.0980 }
            },
            author: {
                id: 123,
                name: "김대리",
                profileImage: "/icons/icon-192x192.jpg"
            },
            stats: {
                commentCount: 5,
                likeCount: 10,
                distanceFromUser: 2.3
            },
            createdAt: "2024-01-15T09:30:00Z"
        },
        {
            id: 2,
            title: "한강 러닝 코스",
            routeData: {
                path: [
                    { lat: 37.5113, lng: 127.0980 },
                    { lat: 37.5114, lng: 127.0985 },
                ],
                markers: [
                    {
                        id: "marker-1",
                        position: { lat: 37.5113, lng: 127.0980 },
                        content: "시작점 - 잠실한강공원",
                        image: "/icons/icon-192x192.png"
                    },
                ],
                recordedTime: 45,
                distance: 5.2,
                startAddress: "서울특별시 송파구 잠실동 한강공원",
                startLocation: { lat: 37.5113, lng: 127.0980 }
            },
            author: {
                id: 123,
                name: "러너",
                profileImage: "/icons/icon-192x192.png"
            },
            stats: {
                commentCount: 5,
                likeCount: 10,
                distanceFromUser: 2.3
            },
            createdAt: "2024-01-15T09:30:00Z"
        },
        {
            id: 3,
            title: "한강 러닝 코스",
            routeData: {
                path: [
                    { lat: 37.5113, lng: 127.0980 },
                    { lat: 37.5114, lng: 127.0985 },
                ],
                markers: [
                    {
                        id: "marker-1",
                        position: { lat: 37.5113, lng: 127.0980 },
                        content: "시작점 - 잠실한강공원",
                        image: "/icons/icon-192x192.png"
                    },
                ],
                recordedTime: 45,
                distance: 5.2,
                startAddress: "서울특별시 송파구 잠실동 한강공원",
                startLocation: { lat: 37.5113, lng: 127.0980 }
            },
            author: {
                id: 123,
                name: "러너",
                profileImage: "/icons/icon-192x192.png"
            },
            stats: {
                commentCount: 5,
                likeCount: 10,
                distanceFromUser: 2.3
            },
            createdAt: "2024-01-15T09:30:00Z"
        },
        {
            id: 1,
            title: "한강 러닝 코스",
            routeData: {
                path: [
                    { lat: 37.5113, lng: 127.0980 },
                    { lat: 37.5114, lng: 127.0985 },
                ],
                markers: [
                    {
                        id: "marker-1",
                        position: { lat: 37.5113, lng: 127.0980 },
                        content: "시작점 - 잠실한강공원",
                        image: "/icons/icon-192x192.png"
                    },
                ],
                recordedTime: 45,
                distance: 5.2,
                startAddress: "서울특별시 송파구 잠실동 한강공원",
                startLocation: { lat: 37.5113, lng: 127.0980 }
            },
            author: {
                id: 123,
                name: "러너",
                profileImage: "/icons/icon-192x192.png"
            },
            stats: {
                commentCount: 5,
                likeCount: 10,
                distanceFromUser: 2.3
            },
            createdAt: "2024-01-15T09:30:00Z"
        },
        {
            id: 4,
            title: "한강 러닝 코스",
            routeData: {
                path: [
                    { lat: 37.5113, lng: 127.0980 },
                    { lat: 37.5114, lng: 127.0985 },
                ],
                markers: [
                    {
                        id: "marker-1",
                        position: { lat: 37.5113, lng: 127.0980 },
                        content: "시작점 - 잠실한강공원",
                        image: "/icons/icon-192x192.png"
                    },
                ],
                recordedTime: 45,
                distance: 5.2,
                startAddress: "서울특별시 송파구 잠실동 한강공원",
                startLocation: { lat: 37.5113, lng: 127.0980 }
            },
            author: {
                id: 123,
                name: "김대리",
                profileImage: "/icons/icon-192x192.jpg"
            },
            stats: {
                commentCount: 5,
                likeCount: 10,
                distanceFromUser: 2.3
            },
            createdAt: "2024-01-15T09:30:00Z"
        },
    ]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

    // 게시글 데이터 가져오기 (임시로 로컬스토리지에서)
    useEffect(() => {
        const fetchPosts = () => {
            const savedPosts = localStorage.getItem('posts');
            if (savedPosts) {
                const parsedPosts = JSON.parse(savedPosts);
                // 사용자 위치가 있다면 거리 계산하여 추가
                if (userLocation) {
                    const postsWithDistance = parsedPosts.map((post: Post) => ({
                        ...post,
                        stats: {
                            ...post.stats,
                            distanceFromUser: calculateDistance(
                                userLocation,
                                post.routeData.startLocation
                            )
                        }
                    }));
                    setPosts(postsWithDistance);
                } else {
                    setPosts(parsedPosts);
                }
            }
        };

        fetchPosts();
    }, [userLocation]);

    if (!posts.length) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">아직 등록된 게시글이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-4">
            {posts.map((post) => (
                <BoardCard key={post.id} post={post} />
            ))}
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
    return Math.round(R * c * 10) / 10; // 소수점 첫째자리까지
}