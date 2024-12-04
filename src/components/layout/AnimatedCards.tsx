import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Camera, Heart, MapPin, Share2, Users } from 'lucide-react';
import { Flag } from 'lucide-react';

interface BackgroundProps {
    className?: string;
}

interface AnimatedCardProps {
    href: string;
    title: string | React.ReactNode;
    Background: React.ComponentType<BackgroundProps>;
    className?: string;
}

const WalkingPathBackground: React.FC<BackgroundProps> = () => {
    return (
        <motion.div className="absolute inset-0 bg-zinc-100">
            <div className="absolute inset-0"
                style={{
                    backgroundImage: 'url("/near.jpg")', backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />



            {/* 메인 경로 */}
            <svg className="absolute inset-0 w-full h-full">
                {/* 주요 경로들 */}
                <motion.path
                    d="M 50 150 L 50 100 L 150 100 L 150 50"
                    className="stroke-purple-500/80 stroke-[3] fill-none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                />

                <motion.path
                    d="M 100 200 L 200 200 L 200 100 L 300 100"
                    className="stroke-purple-400/70 stroke-[2.5] fill-none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                />

                <motion.path
                    d="M 150 180 L 150 120 L 250 120 L 250 180"
                    className="stroke-purple-300/60 stroke-[2] fill-none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: 0.6 }}
                />

                <motion.path
                    d="M 80 80 L 180 80 L 180 150 L 280 150"
                    className="stroke-purple-200/50 stroke-[2] fill-none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3.2, repeat: Infinity, delay: 0.9 }}
                />
            </svg>

            {/* GPS 핀 */}
            <motion.div
                className="absolute left-1/4 top-3"
                animate={{
                    y: [-10, 10],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                <MapPin className="w-8 h-8 text-red-800" fill="tomato" strokeWidth={1.5} />
            </motion.div>

            <motion.div
                className="absolute right-1/3 bottom-5"
                animate={{
                    y: [-15, 5],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5,
                }}
            >
                <MapPin className="w-6 h-6 text-red-800" fill="tomato" strokeWidth={1.5} />
            </motion.div>

            {/* POI 점들 */}

        </motion.div>
    );
};
const MyRouteBackground: React.FC<BackgroundProps> = () => {
    return (
        <motion.div className="absolute inset-0 bg-green-200">
            <div className="absolute w-full top-[15%] flex justify-center space-x-20">
                <motion.span
                    className="text-4xl"
                    animate={{
                        rotate: [-10, 10],
                        y: [-2, 2]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    🐰
                </motion.span>
                <motion.span
                    className="text-4xl"
                    animate={{
                        rotate: [10, -10],
                        y: [2, -2]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                    }}
                >
                    🐢
                </motion.span>
            </div>

            <svg className="absolute inset-0 w-full h-full">
                <path
                    d="M 100 150 C 180 70, 220 230, 300 150"
                    className="stroke-gray-300 stroke-[32] fill-none"
                    strokeLinecap="round"
                />

                <motion.path
                    d="M 100 150 C 180 70, 220 230, 300 150"
                    className="stroke-red-500 stroke-[8] fill-none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </svg>

            <motion.div
                className="absolute left-[23%] top-[60%]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <Flag className="w-8 h-8 text-green-600" fill='green' />
            </motion.div>

            <motion.div
                className="absolute right-[5%] top-[60%]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
                <Flag className="w-8 h-8 text-red-600" fill="currentColor" />
            </motion.div>

        </motion.div >
    );
};

const ShareBackground: React.FC<BackgroundProps> = () => {
    return (
        <motion.div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 overflow-hidden">
            {/* 중앙 원형 경로 */}
            <svg className="absolute inset-0 w-full h-full">
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r="30"
                    className="stroke-white/40 fill-none stroke-[2]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [1, 2, 1],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r="30"
                    className="stroke-white/30 fill-none stroke-[1.5]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [1.2, 2.2, 1.2],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: 0.5,
                        ease: "easeInOut"
                    }}
                />
            </svg>

            {/* 움직이는 아이콘들 */}
            <div className="absolute inset-0">
                {/* 카메라 아이콘 */}
                <motion.div
                    className="absolute left-[20%] top-[30%]"
                    animate={{
                        x: ["0%", "30%", "0%"],
                        y: ["0%", "-20%", "0%"],
                        rotate: [0, -15, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Camera className="w-6 h-6 text-white" />
                </motion.div>

                {/* 유저 아이콘 */}
                <motion.div
                    className="absolute right-[20%] top-[30%]"
                    animate={{
                        x: ["0%", "-30%", "0%"],
                        y: ["0%", "-20%", "0%"],
                        rotate: [0, 15, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Users className="w-6 h-6 text-white" />
                </motion.div>

                {/* 연결선 */}
                <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                        d="M 30% 50% Q 50% 30%, 70% 50%"
                        className="stroke-white/60 stroke-[2] fill-none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </svg>
            </div>

        </motion.div>
    );
};


const AnimatedCard: React.FC<AnimatedCardProps> = ({ href, title, Background, className = '' }) => {
    return (
        <Link href={href} className={className}>
            <Card className="h-full cursor-pointer relative overflow-hidden group">
                <Background />
                <motion.div
                    className="relative z-10 h-full p-4 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-gray-800 font-semibold text-lg text-center bg-white/30 px-3 py-1.5 rounded-lg">
                        {title}
                    </h2>
                </motion.div>
            </Card>
        </Link>
    );
};

const AnimatedCards: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row justify-between" style={{ height: '20vh' }}>
                <AnimatedCard
                    href="/main/board"
                    title="내 주변 산책길 보러가기"
                    Background={WalkingPathBackground}
                    className="w-[48%] block"
                />
                <AnimatedCard
                    href="/main/mypage/myRoute"
                    title={<span className="whitespace-pre-line">내가 기록한{'\n'}산책길 보러가기</span>}
                    Background={MyRouteBackground}
                    className="w-[48%] block"
                />
            </div>
            <AnimatedCard
                href="/main/board/post"
                title="내 산책길 공유하기"
                Background={ShareBackground}
                className="w-[100%] block mt-4 h-[13vh]"
            />
        </div>
    );
};

export default AnimatedCards;