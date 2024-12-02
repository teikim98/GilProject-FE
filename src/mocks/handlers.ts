import { CreatePostRequest, Post } from "@/types/types";
import { http, HttpResponse } from "msw";
import { dummyPosts } from "./dummyData";

export const handlers = [
  // 게시글 목록 조회
  http.get("/api/posts", () => {
    return HttpResponse.json(dummyPosts);
  }),

  // 게시글 상세 조회
  http.get("/api/posts/:id", ({ params }) => {
    const { id } = params;
    const post = dummyPosts.find((post) => post.postId === Number(id)); // id -> postId

    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  http.post("/api/posts", async ({ request }) => {
    const formData = await request.formData();
    const postDataString = formData.get("postCreateRequest"); // postData -> postCreateRequest

    if (!postDataString || typeof postDataString !== "string") {
      return new HttpResponse(null, {
        status: 400,
        statusText: "Bad Request: Missing or invalid postCreateRequest",
      });
    }

    const postData = JSON.parse(postDataString) as CreatePostRequest;
    const imageFiles = formData.getAll("images") as File[];

    const now = new Date().toISOString();

    const post: Post = {
      postId: dummyPosts.length + 1, // id -> postId
      postUserId: 1,
      nickName: "현재 로그인한 사용자", // userNickName -> nickName
      pathId: postData.pathId,
      startLat: 0, // pathResDTO에서 가져올 값
      startLong: 0, // pathResDTO에서 가져올 값
      state: 1,
      title: postData.title,
      content: postData.content,
      tag: postData.tag,
      writeDate: now,
      updateDate: now,
      readNum: 0,
      likesCount: 0, // postLikesNum -> likesCount
      repliesCount: 0, // repliesNum -> repliesCount
      postWishListsNum: 0,
      userImgUrl: "", // 새로 추가
      pathResDTO: {
        // routeData -> pathResDTO
        id: dummyPosts.length + 1,
        user: { id: 1 }, // 임시 사용자 ID
        content: postData.content,
        state: 0,
        title: postData.title,
        time: 0, // 기본값
        distance: 0, // 기본값
        startLat: 0, // 기본값
        startLong: 0, // 기본값
        startAddr: null,
        createDate: now, // 새로 추가
        routeCoordinates: [], // API 요청에서 받아와야 함
        pins: [], // API 요청에서 받아와야 함
      },
      imageUrls: imageFiles.map(() => `/api/placeholder/400/300`), // images -> imageUrls
      liked: false, // 새로 추가
      wishListed: false, // 새로 추가
    };

    console.log(post);
    return HttpResponse.json(post);
  }),

  http.get("/api/routes/:id", ({ params }) => {
    const { id } = params;

    // id가 999인 경우 (테스트 경로)
    if (id === "999") {
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
    const post = dummyPosts.find((post) => post.postId === Number(id)); // id -> postId
    if (!post) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "Route not found",
      });
    }

    return HttpResponse.json(post);
  }),
];
