export const getImageUrl = (url) => {
    if (!url) return null;
    
    // If it's already an absolute URL or blob URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
        return url;
    }
    
    // Extract base URL from API route (e.g. https://localhost:7180/api -> https://localhost:7180)
    const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7180/api';
    const hostBase = apiBase.replace(/\/api\/?$/, '');
    
    return `${hostBase}${url.startsWith('/') ? '' : '/'}${url}`;
};
