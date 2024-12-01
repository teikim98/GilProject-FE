import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts, getPostNear, getPostsByKeyword } from "@/api/post";
import { Post } from "@/types/types";

interface PostResponse {
  content: Post[];
  totalElements: number;
}

type PostQueryKey = [
  "posts",
  string,
  string,
  { lat: number; lng: number } | null
];

export function useBoardListQuery(
  selectedLocation: string,
  query: string,
  userLocation: { lat: number; lng: number } | null
) {
  return useInfiniteQuery<
    PostResponse,
    Error,
    PostResponse,
    PostQueryKey,
    number
  >({
    queryKey: ["posts", selectedLocation, query, userLocation],
    queryFn: async ({ pageParam }) => {
      if (selectedLocation === "검색결과") {
        return getPostsByKeyword(query, pageParam, 10);
      } else if (selectedLocation === "내 현재위치" && userLocation) {
        return getPostNear(userLocation.lat, userLocation.lng, pageParam, 10);
      }
      return getPosts(pageParam, 10);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.totalElements > allPages.length * 10
        ? allPages.length
        : undefined;
    },
    enabled: selectedLocation !== "내 현재위치" || userLocation !== null,
    initialPageParam: 0,
  });
}
