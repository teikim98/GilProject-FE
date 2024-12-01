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
    InfiniteData<PostResponse>,
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

export function usePostDetailQuery(postId: number) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}

export function usePostMutations(postId: number) {
  const queryClient = useQueryClient();

  const onSuccess = async () => {
    // 상세 데이터와 목록 데이터 모두 갱신
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
