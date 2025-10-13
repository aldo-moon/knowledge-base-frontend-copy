// services/favoritoService.js
import api from '../utils/api';

export const favoritoService = {
  addFolderToFavorites: async (userId, folderId) => {
    try {
      const response = await api.patch(`/favoritos/${userId}/add-folder`, {
        folderId: folderId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding folder to favorites:', error);
      throw error;
    }
  },

  addTopicToFavorites: async (userId, topicId) => {
    try {
      const response = await api.patch(`/favoritos/${userId}/add-topic`, {
        topicId: topicId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding topic to favorites:', error);
      throw error;
    }
  },

  addFileToFavorites: async (userId, fileId) => {
    try {
      const response = await api.patch(`/favoritos/${userId}/add-file`, {
        fileId: fileId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding file to favorites:', error);
      throw error;
    }
  },

  getFavoritoById: async (userId) => {
    try {
      const response = await api.get(`/favoritos/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  },

  removeFolderFromFavorites: async (userId, folderId) => {
    try {
      const response = await api.delete(`/favoritos/unfav_folder/user/${userId}`, {
        data: { folderId: folderId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing folder from favorites:', error);
      throw error;
    }
  },

  removeTopicFromFavorites: async (userId, topicId) => {
    try {
      const response = await api.delete(`/favoritos/unfav_topic/user/${userId}`, {
        data: { topicId: topicId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing topic from favorites:', error);
      throw error;
    }
  },

  removeFileFromFavorites: async (userId, fileId) => {
    try {
      const response = await api.delete(`/favoritos/unfav_file/user/${userId}`, {
        data: { fileId: fileId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing file from favorites:', error);
      throw error;
    }
  }
};
