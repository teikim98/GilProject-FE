import { Post } from "@/types/types";

export const convertSavedPathToPost = (): Post | null => {
  // 로컬스토리지에서 저장된 경로 가져오기
  const savedPathString = localStorage.getItem("savedRoute");
  if (!savedPathString) return null;

  try {
    const savedPath = JSON.parse(savedPathString);

    // 현재 시간 기준으로 작성 시간 생성
    const now = new Date().toISOString();

    // Post 형식으로 변환
    const convertedPost: Post = {
      id: 999, // 테스트용 고유 ID
      userNickName: "테스트 사용자",
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
      postLikesUsers: [],
      postLikesNum: 0,
      repliesUsers: [],
      repliesNum: 0,
      postWishListsUsers: [],
      postWishListsNum: 0,
      routeData: {
        path: savedPath.path,
        markers: savedPath.markers || [],
        recordedTime: savedPath.recordedTime || 0,
        distance: savedPath.distance || 0,
      },
    };

    return convertedPost;
  } catch (error) {
    console.error("Failed to convert saved path:", error);
    return null;
  }
};
