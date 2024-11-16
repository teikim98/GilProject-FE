'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, ImagePlus } from 'lucide-react';

interface MarkerFormProps {
    onSubmit: (content: string, image: string) => void;
    onCancel: () => void;
}

// 이미지 크기 제한 (예: 1MB)
const MAX_FILE_SIZE = 1024 * 1024;

const MarkerForm = ({ onSubmit, onCancel }: MarkerFormProps) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState<string>('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError('');

        if (file) {
            // 파일 크기 체크
            if (file.size > MAX_FILE_SIZE) {
                setError('이미지 크기는 1MB 이하여야 합니다.');
                return;
            }

            try {
                // 이미지 리사이징 및 압축
                const compressedImage = await compressImage(file);
                setImage(compressedImage);
            } catch (error) {
                setError('이미지 처리 중 오류가 발생했습니다.');
                console.error('Image compression error:', error);
            }
        }
    };

    // 이미지 압축 함수
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    // 이미지 크기 조정
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // 압축된 이미지를 base64로 변환
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedBase64);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
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