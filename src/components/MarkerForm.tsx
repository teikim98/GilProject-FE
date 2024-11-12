'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react'; // X 아이콘 추가

interface MarkerFormProps {
    onSubmit: (content: string, image: string) => void;
    onCancel: () => void;
}

const MarkerForm = ({ onSubmit, onCancel }: MarkerFormProps) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        onSubmit(content, image);
        setContent('');
        setImage('');
    };

    const handleCancel = () => {
        setContent('');
        setImage('');
        onCancel();
    };

    return (
        <Card className="relative p-4 bg-white rounded-lg shadow-lg w-[300px]">
            <button
                onClick={handleCancel}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close form"
            >
                <X size={16} />
            </button>

            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="마커에 대한 설명을 입력하세요"
                className="mb-2 resize-none"
                rows={4}
            />

            <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-2"
            />

            {image && (
                <div className="mb-2">
                    <img
                        src={image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                    />
                </div>
            )}

            <div className="flex gap-2 mt-4">
                <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={!content.trim()}
                >
                    저장
                </Button>
                <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                >
                    취소
                </Button>
            </div>
        </Card>
    );
};

export default MarkerForm;