'use client'


import { useParams } from "next/navigation";
import PostPage from "../../post/page";

export default function EditPostPage() {
    const params = useParams();
    const postId = typeof params.id === 'string' ? parseInt(params.id) : undefined;

    return (
        <PostPage
            isEdit={true}
            postId={postId}
        />
    );
}