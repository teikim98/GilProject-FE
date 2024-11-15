import { BaseKakaoMapProps } from '@/types/types';
import { Map } from 'react-kakao-maps-sdk'


export function BaseKakaoMap({ center, width = "w-full", height = "h-72", onClick, children }: BaseKakaoMapProps) {
    return (
        <div className={`relative ${width} ${height}`}>
            <Map
                center={center}
                style={{ width: '100%', height: '100%', minHeight: '100px' }}
                level={3}
                onClick={onClick}
                className="rounded-lg"
            >
                {children}
            </Map>
        </div>
    );
}