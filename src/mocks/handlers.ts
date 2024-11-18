import { Post } from "@/types/types";
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

  // 게시글 작성
  http.post("/api/posts", async ({ request }) => {
    const newPost = (await request.json()) as Omit<Post, "id">;

    const post: Post = {
      ...newPost,
      id: dummyPosts.length + 1,
    };

    return HttpResponse.json(post);
  }),
];
