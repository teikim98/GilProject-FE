'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CelebrationAnimationProps {
    elapsedTime: number;
    distance: number;
    onConfirm: () => void;
}

const CelebrationAnimation = ({ elapsedTime, distance, onConfirm }: CelebrationAnimationProps) => {
    const [showConfetti, setShowConfetti] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}분 ${remainingSeconds}초`;
    };

    const confettiElements = Array.from({ length: 100 }, (_, i) => i);
    useEffect(() => {
        // 약간의 딜레이 후에 꽃가루 효과 시작
        const timer = setTimeout(() => setShowConfetti(true), 300);
        return () => clearTimeout(timer);
    }, []);
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                type: "spring",
                stiffness: 300
            }
        }
    };
    const confettiVariants = {
        hidden: {
            y: 0,
            x: 0,
            opacity: 0,
            scale: 0.2
        },
        visible: (i: number) => ({
            y: [0, -200 + Math.random() * 100],
            x: [0, (i % 2 === 0 ? 1 : -1) * (100 + Math.random() * 200)],
            rotate: [0, Math.random() * 360 * (i % 2 === 0 ? 1 : -1)],
            opacity: [1, 0],
            scale: [1, 0],
            transition: {
                duration: 2 + Math.random(),
                ease: [0.2, 0.8, 0.4, 1],
                delay: Math.random() * 0.2,
                repeat: Infinity,
                repeatDelay: 3
            }
        })
    };
    const titleVariants = {
        initial: { scale: 0.5, opacity: 0 },
        animate: {
            scale: [1, 1.2, 1],
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                times: [0, 0.5, 1]
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative"
            >
                <Card className="p-8 text-center bg-white/90 backdrop-blur">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-4"
                    >
                        <PartyPopper className="w-16 h-16 mx-auto text-yellow-500" />
                    </motion.div>
                    <motion.h2
                        variants={titleVariants}
                        initial="initial"
                        animate="animate"
                        className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent"
                    >
                        🎉 축하합니다! 🎉
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2 mb-6"
                    >
                        <p className="text-lg text-gray-600">
                            모든 경로를 완주하셨습니다!
                        </p>
                        <p className="text-md text-gray-500">
                            총 소요 시간: {formatTime(elapsedTime)}
                        </p>
                        <p className="text-md text-gray-500">
                            이동 거리: {(distance / 1000).toFixed(2)}km
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button
                            onClick={onConfirm}
                            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600"
                        >
                            확인
                        </Button>
                    </motion.div>

                    <AnimatePresence>
                        {showConfetti && confettiElements.map((i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={confettiVariants}
                                initial="hidden"
                                animate="visible"
                                className="absolute"
                                style={{
                                    width: Math.random() * 15 + 5 + "px",
                                    height: Math.random() * 15 + 5 + "px",
                                    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                                    background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
};

export default CelebrationAnimation;