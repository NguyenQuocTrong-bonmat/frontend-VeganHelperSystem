import axiosInstance from '../lib/axios';

const shopService = {
  getNearbyShops: async (lat, lng, radiusKm = 5, pageIndex = 1, pageSize = 20) => {
    try {
      const response = await axiosInstance.get('/Shops/nearby', {
        params: {
          Lat: lat,
          Lng: lng,
          RadiusKm: radiusKm,
          PageIndex: pageIndex,
          PageSize: pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      throw error;
    }
  },

  searchShops: async (keyword, lat, lng, pageIndex = 1, pageSize = 20) => {
    try {
      const response = await axiosInstance.get('/Shops/search', {
        params: {
          Keyword: keyword,
          Lat: lat,
          Lng: lng,
          PageIndex: pageIndex,
          PageSize: pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching shops:', error);
      throw error;
    }
  },

  getShopDetail: async (id, lat, lng) => {
    try {
      const response = await axiosInstance.get(`/Shops/${id}`, {
        params: {
          Lat: lat,
          Lng: lng
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shop details:', error);
      throw error;
    }
  }
};

export default shopService;
