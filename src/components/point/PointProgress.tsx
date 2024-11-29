// src/components/point/PointProgress.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface Level {
    name: string;
    requiredPoints: number;
}

const levels: Level[] = [
    { name: "Bronze", requiredPoints: 1000 },
    { name: "Silver", requiredPoints: 3000 },
    { name: "Gold", requiredPoints: 6000 },
    { name: "Platinum", requiredPoints: 10000 }
];

interface PointProgressProps {
    currentPoints: number;
}

const PointProgress = ({ currentPoints }: PointProgressProps) => {
    const getCurrentLevel = () => {
        for (let i = levels.length - 1; i >= 0; i--) {
            if (currentPoints >= levels[i].requiredPoints) {
                return i + 1;
            }
        }
        return 0;
    };

    const getNextLevelProgress = () => {
        const currentLevel = getCurrentLevel();
        if (currentLevel === levels.length) {
            return 100;
        }
        
        const currentLevelPoints = currentLevel > 0 ? levels[currentLevel - 1].requiredPoints : 0;
        const nextLevelPoints = levels[currentLevel].requiredPoints;
        const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-bold">내 포인트</CardTitle>
                <Trophy className="w-6 h-6 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold">{currentPoints.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">
                            Level {getCurrentLevel()} - {levels[getCurrentLevel()]?.name || "MAX"}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Progress value={getNextLevelProgress()} className="h-2" />
                        
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>
                                {getCurrentLevel() < levels.length 
                                    ? `다음 레벨까지: ${(levels[getCurrentLevel()].requiredPoints - currentPoints).toLocaleString()} 포인트`
                                    : '최고 레벨 달성!'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">포인트 획득 방법</h4>
                        <p className="text-sm text-gray-600">
                            • 100m 걸을 때마다 10포인트 획득<br/>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PointProgress;