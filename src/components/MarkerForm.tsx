'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="마커에 대한 설명을 입력하세요"
                className="mb-2"
            />
            <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-2"
            />
            <div className="flex gap-2">
                <Button onClick={() => onSubmit(content, image)}>저장</Button>
                <Button variant="outline" onClick={onCancel}>취소</Button>
            </div>
        </div>
    );
};

export default MarkerForm;