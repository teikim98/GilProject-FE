'use client'


import PostForm from "@/components/layout/PostForm";
import { useParams } from "next/navigation";

export default function EditPostPage() {
    const params = useParams();
    const postId = typeof params.id === 'string' ? parseInt(params.id) : undefined;

    return (
        <PostForm
            isEdit={true}
            postId={postId}
        />
    );
}