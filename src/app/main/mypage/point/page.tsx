'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PointDialog from "@/components/point/PointComponent"

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      router.back(); // Dialog가 닫히면 이전 페이지(마이페이지)로 돌아감
    }
  };

  return (
    <div className='animate-fade-in flex flex-col relative pb-20'>
      <PointDialog 
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      />
    </div>
  )
}