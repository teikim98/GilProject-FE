'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Mail, ChevronUp } from "lucide-react";
import BackHeader from '@/components/layout/BackHeader';

const teamMembers = [
    {
        name: "정형우",
        role: "인증 및 시큐리티 관련 업무 (팀장)",
        description: "항상 성실하게 노력하며 맡은 바에 최선을 다하는 개발자 정형우입니다",
        imageUrl: "/정형우.jpeg",
        github: "https://github.com/jeedd95",
        email: "jeedd95@gmail.com"
    },
    {
        name: "김호석",
        role: "백엔드 개발 및 인프라 관리",
        description: "새로운 기술과 도구를 탐구하며 끊임없이 성장하는 개발자 김호석입니다",
        imageUrl: "/김호석.jpg",
        github: "https://github.com/momoandsana",
        email: "swiftie52@naver.com"
    },
    {
        name: "한은미",
        role: "백엔드 개발 및 SSE 알림 처리",
        description: "진심을 다해 고민하고 개발했습니다. 꾸준히 성장하는 개발자 한은미입니다.",
        imageUrl: "/한은미.jpeg",
        github: "https://github.com/Eunmi-Han",
        email: "leahan0302@gmail.com"
    },
    {
        name: "김태휘",
        role: "프론트엔드 및 UI/UX",
        description: "늘 흥미로운 신기술을 갈구하고 사용해보고 싶은 개발자 김태휘입니다.",
        imageUrl: "/김태휘.jpeg",
        github: "https://github.com/teikim98",
        email: "teikim98@gmail.com"
    },
    {
        name: "염진",
        role: "백엔드 개발 및 검색엔진",
        description: "사용자의 편에 서서 생각하고 고민하고 개발하는 염진입니다.",
        imageUrl: "/염진.jpeg",
        github: "https://github.com/jinyerom1998",
        email: "jinyerom1998@gmail.com"
    },
    {
        name: "최재구",
        role: "PostGIS 최적화 및 경로 데이터 관리",
        description: "버그를 두려워하던 과거의 나약함을 딛고, 에러란 나를 성장시키는 자양분이었음을 깨달고 일어선 앞으로 찬란한 미래가 기대되는 개발자 최재구 입니다. ",
        imageUrl: "/최재구.jpeg",
        github: "https://github.com/choijaegu",
        email: "magic753@naver.com"
    }
];

export default function PeoplePage() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-background py-20 px-4 md:px-8 relative">
            <BackHeader content='만든 사람들' />
            <div className="absolute inset-0 bg-[url('/api/placeholder/20/20')] opacity-5 dark:opacity-[0.07] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto relative"
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-300/20 dark:from-purple-500/10 dark:to-fuchsia-500/10 blur-2xl"
                />

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-center mb-16 text-purple-800 dark:text-purple-300 relative"
                >
                    스택언더플로우 팀
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                x: index % 2 === 0 ? -100 : 100,
                                rotateY: 45
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                                rotateY: 0
                            }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                        >
                            <Card className="overflow-hidden border-purple-200 dark:border-purple-800/50 hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/30 transition-all duration-300 bg-white/80 dark:bg-purple-950/30 backdrop-blur-sm">
                                <CardContent className="p-0">
                                    <motion.div
                                        className="relative w-full h-full"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={member.imageUrl}
                                            alt={member.name}
                                            className="w-full h-full object-contain"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent dark:from-purple-950/70"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>
                                    <div className="p-6 space-y-3">
                                        <motion.h3
                                            className="text-2xl font-semibold text-purple-900 dark:text-purple-200"
                                            whileHover={{ x: 10 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {member.name}
                                        </motion.h3>
                                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{member.role}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{member.description}</p>
                                        <motion.div
                                            className="flex flex-col gap-2 pt-2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <a
                                                href={member.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-200 transition-colors group"
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <Github size={18} className="group-hover:text-purple-500 dark:group-hover:text-purple-300" />
                                                </motion.div>
                                                <span className="group-hover:underline">GitHub</span>
                                            </a>
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail size={18} />
                                                <span>{member.email}</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 bg-purple-600 dark:bg-purple-800 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronUp size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}