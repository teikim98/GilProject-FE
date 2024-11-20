import { CreatePostRequest, Post, PostImage } from "@/types/types";
import { http, HttpResponse } from "msw";
import { dummyPosts } from "./dummyData"; // 아까 만든 더미 데이터

export const handlers = [
  // 게시글 목록 조회
  http.get("/api/posts", () => {
    return HttpResponse.json(dummyPosts);
  }),

  // 게시글 상세 조회
  http.get("/api/posts/:id", ({ params }) => {
    const { id } = params;
    const post = dummyPosts.find((post) => post.id === Number(id));

    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  http.post("/api/posts", async ({ request }) => {
    const formData = await request.formData();
    const postDataString = formData.get("postData");

    if (!postDataString || typeof postDataString !== "string") {
      return new HttpResponse(null, {
        status: 400,
        statusText: "Bad Request: Missing or invalid postData",
      });
    }

    const postData = JSON.parse(postDataString) as CreatePostRequest;
    const imageFiles = formData.getAll("images") as File[];

    // 실제 서버에서는 이미지를 저장하고 URL을 반환하겠지만,
    // MSW에서는 임시 URL을 생성
    const images: PostImage[] = imageFiles.map((_, index) => ({
      id: index + 1,
      url: `/api/placeholder/400/300`, // 실제 환경에서는 실제 이미지 URL
      fileName: `image-${index + 1}.jpg`,
    }));

    const post: Post = {
      ...postData,
      id: dummyPosts.length + 1,
      userNickName: "현재 로그인한 사용자",
      pathId: 1,
      startLat: postData.routeData.path[0].lat,
      startLong: postData.routeData.path[0].lng,
      state: 1,
      images: imageFiles.map(() => `/api/placeholder/400/300`), // 단순 문자열 배열로 수정
      writeDate: new Date().toISOString(),
      updateDate: "",
      readNum: 0,
      postLikesUsers: [],
      postLikesNum: 0,
      repliesUsers: [],
      repliesNum: 0,
      postWishListsUsers: [],
      postWishListsNum: 0,
    };

    console.log(post);

    return HttpResponse.json(post);
  }),

  http.get("/api/routes/:id", ({ params }) => {
    const { id } = params;

    // id가 999인 경우 (테스트 경로)
    if (id === "999") {
      // window 객체가 있는지 확인 (브라우저 환경인지 체크)
      if (typeof window !== "undefined") {
        const testRouteString = window.localStorage.getItem("testRoute");
        if (testRouteString) {
          try {
            const testRoute = JSON.parse(testRouteString);
            return HttpResponse.json(testRoute);
          } catch (error) {
            console.error("Failed to parse test route:", error);
            return new HttpResponse(null, { status: 500 });
          }
        }
      }
      return new HttpResponse(null, {
        status: 404,
        statusText: "Test route not found",
      });
    }

    // 일반 경로 조회
    const post = dummyPosts.find((post) => post.id === Number(id));
    if (!post) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "Route not found",
      });
    }

    return HttpResponse.json(post);
  }),
];
