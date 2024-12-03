'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, ImagePlus } from 'lucide-react';
import { processMarkerImage } from '@/util/imageUtils';

interface MarkerFormProps {
    onSubmit: (content: string, image: string) => void;
    onCancel: () => void;
}

const MarkerForm = ({ onSubmit, onCancel }: MarkerFormProps) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState<string>('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        const { errorMessage, compressedImage } = await processMarkerImage(file);

        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        if (compressedImage) {
            setImage(compressedImage);
        }
    };

    const handleSubmit = () => {
        if (!content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }
        onSubmit(content, image);
        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    const resetForm = () => {
        setContent('');
        setImage('');
        setError('');
    };

    return (
        <Card className="relative p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[300px]">
            <button
                onClick={handleCancel}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close form"
            >
                <X size={16} className="dark:text-gray-300" />
            </button>

            <div className="space-y-4">
                <div>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="마커에 대한 설명을 입력하세요"
                        className="resize-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        rows={4}
                    />
                </div>

                <div className="relative">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 cursor-pointer p-2 border dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                    >
                        <ImagePlus size={20} />
                        <span>이미지 추가</span>
                    </label>
                </div>

                {image && (
                    <div className="relative">
                        <img
                            src={image}
                            alt="Preview"
                            className="w-full h-32 sm:h-16 object-cover rounded"
                        />
                        <button
                            onClick={() => setImage('')}
                            className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Remove image"
                        >
                            <X size={16} className="dark:text-gray-300" />
                        </button>
                    </div>
                )}

                {error && (
                    <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
                )}

                <div className="flex gap-2">
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
                        className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        취소
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default MarkerForm;