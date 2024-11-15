
// 기본 핀 마커
export const createPinMarker = (color: string = '#6366F1') => {
    const svgString = `
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C9 0 0 9 0 20C0 35 20 48 20 48C20 48 40 35 40 20C40 9 31 0 20 0ZM20 28C15.6 28 12 24.4 12 20C12 15.6 15.6 12 20 12C24.4 12 28 15.6 28 20C28 24.4 24.4 28 20 28Z" fill="${color}"/>
            <circle cx="20" cy="20" r="10" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// 동그란 마커
export const createCircleMarker = (color: string = '#6366F1') => {
    const svgString = `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="${color}"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
            <circle cx="16" cy="16" r="2" fill="${color}"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// 물방울 모양 마커
export const createDropMarker = (color: string = '#6366F1') => {
    const svgString = `
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4C16 4 4 16 4 24C4 31.732 9.26801 38 16 38C22.732 38 28 31.732 28 24C28 16 16 4 16 4Z" fill="${color}"/>
            <circle cx="16" cy="24" r="6" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// 육각형 마커
export const createHexagonMarker = (color: string = '#6366F1') => {
    const svgString = `
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0L35.3205 10V30L18 40L0.679491 30V10L18 0Z" fill="${color}"/>
            <circle cx="18" cy="20" r="6" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// 깃발 모양 마커
export const createFlagMarker = (color: string = '#6366F1') => {
    const svgString = `
        <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h4v48H0z" fill="${color}"/>
            <path d="M4 4v16l12-8L4 4z" fill="${color}"/>
            <circle cx="2" cy="24" r="2" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// 별 모양 마커
export const createStarMarker = (color: string = '#6366F1') => {
    const svgString = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0l4.33 13.33h14.019l-11.34 8.24 4.33 13.33L20 26.66l-11.339 8.24 4.33-13.33-11.34-8.24h14.019L20 0z" fill="${color}"/>
            <circle cx="20" cy="20" r="6" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// 시작점용 특별 마커
export const createStartMarker = () => {
    const svgString = `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" fill="#22C55E" fill-opacity="0.2"/>
            <circle cx="24" cy="24" r="12" fill="#22C55E"/>
            <path d="M20 18L28 24L20 30V18Z" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// 종료점용 특별 마커
export const createEndMarker = () => {
    const svgString = `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" fill="#EF4444" fill-opacity="0.2"/>
            <circle cx="24" cy="24" r="12" fill="#EF4444"/>
            <rect x="18" y="22" width="12" height="4" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};