import { Post, RouteCoordinate, Pin } from "@/types/types";

export const convertSavedPathToPost = (): Post | null => {
  const savedPathString = localStorage.getItem("savedRoute");
  if (!savedPathString) return null;

  try {
    const savedPath = JSON.parse(savedPathString);
    const now = new Date().toISOString();

    // Path 형식의 데이터로 변환
    const pathData = {
      id: 999,
      user: { id: 0 },
      content: "테스트 경로 내용",
      state: 0,
      title: "테스트 경로",
      time: savedPath.recordedTime || 0,
      distance: savedPath.distance || 0,
      startLat: savedPath.path[0]?.lat || 0,
      startLong: savedPath.path[0]?.lng || 0,
      startAddr: null,
      createdDate: now,
      routeCoordinates: savedPath.path.map((pos: any) => ({
        latitude: pos.lat.toString(),
        longitude: pos.lng.toString(),
      })),
      pins: (savedPath.markers || []).map((marker: any) => ({
        id: parseInt(marker.id),
        latitude: marker.position.lat,
        longitude: marker.position.lng,
        content: marker.content,
        imageUrl: marker.image || null,
      })),
    };

    // 새로운 Post 형식으로 변환
    const convertedPost: Post = {
      postId: 999,
      postUserId: 999,
      nickName: "테스트 사용자",
      pathId: 999,
      startLat: savedPath.path[0]?.lat || 0,
      startLong: savedPath.path[0]?.lng || 0,
      state: 1,
      title: "테스트 경로",
      content: "로컬스토리지에서 가져온 테스트 경로입니다.",
      tag: "테스트",
      writeDate: now,
      updateDate: now,
      readNum: 0,
      likesCount: 0,
      repliesCount: 0,
      postWishListsNum: 0,
      userImgUrl: "",
      pathResDTO: pathData,
      imageUrls: [],
      liked: false,
      wishListed: false,
    };

    return convertedPost;
  } catch (error) {
    console.error("Failed to convert saved path:", error);
    return null;
  }
};
