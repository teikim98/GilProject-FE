import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getPosts,
  getPostNear,
  getPostsByKeyword,
  getPost,
  togglePostLike,
  togglePostWishlist,
  deletePost,
  getPostsByTag,
} from "@/api/post";
import { Post } from "@/types/types";

interface PostResponse {
  content: Post[];
  totalElements: number;
}

type PostQueryKey = [
  "posts",
  string,
  string,
  { lat: number; lng: number } | null,
  string | null
];

export function useBoardListQuery(
  selectedLocation: string,
  query: string,
  userLocation: { lat: number; lng: number } | null,
  tag: string | null
) {
  // 현재 위치일 때의 페이지 사이즈를 5로 설정
  const pageSize = selectedLocation === "내 현재위치" ? 5 : 10;

  return useInfiniteQuery({
    queryKey: ["posts", selectedLocation, query, userLocation, tag] as const,
    queryFn: async ({ pageParam = 0 }) => {
      if (tag) {
        return getPostsByTag(tag, pageParam, 10);
      }
      if (selectedLocation === "검색결과") {
        return getPostsByKeyword(query, pageParam, 10);
      } else if (selectedLocation === "내 현재위치" && userLocation) {
        return getPostNear(userLocation.lat, userLocation.lng, pageParam, 5); // 여기를 5로 변경
      }
      return getPosts(pageParam, 10);
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // 현재 위치인 경우와 아닌 경우에 따라 다른 페이지 사이즈 적용
      const currentPageSize = selectedLocation === "내 현재위치" ? 5 : 10;
      return lastPage.content.length === currentPageSize
        ? allPages.length
        : undefined;
    },
    enabled: selectedLocation !== "내 현재위치" || userLocation !== null,
    initialPageParam: 0,
  });
}
// 나머지 코드는 동일하게 유지
export function usePostDetailQuery(postId: number) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePostMutations(postId: number) {
  const queryClient = useQueryClient();

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["post", postId] });
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const like = async () => {
    await togglePostLike(postId);
    await onSuccess();
  };

  const wishlist = async () => {
    await togglePostWishlist(postId);
    await onSuccess();
  };

  const remove = async () => {
    await deletePost(postId);
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return { like, wishlist, remove };
}
