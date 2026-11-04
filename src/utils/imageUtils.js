export const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim().replace(/\\/g, '/');
    if (!cleanUrl) return null;
    
    // If it's already an absolute URL, blob URL, or data URI, return as is
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:')) {
        return cleanUrl;
    }
    
    // Extract base URL from API route (e.g. https://localhost:7180/api -> https://localhost:7180)
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7180/api';
    const hostBase = apiBase.replace(/\/api\/?$/, '');
    
    return `${hostBase}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

export const isVideoMedia = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.trim().split('?')[0].toLowerCase();
    return (
        /\.(mp4|webm|ogg|mov|m4v|avi|mkv|3gp)$/i.test(cleanUrl) ||
        url.includes('/videos/') ||
        url.includes('Screen_Recording') ||
        url.startsWith('data:video/')
    );
};
