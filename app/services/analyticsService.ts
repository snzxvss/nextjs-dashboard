import { authService } from './authService';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_BACKEND || 'http://localhost:3000/api';


export interface AnalyticsData {
  allTime: {
    totalOrders: number;
    totalRevenue: number;
    totalProductSales: number;
    totalDeliveryCost: number;
    avgOrderValue: number;
    countByStatus: {
      new: number;
      processing: number;
      completed: number;
      cancelled: number;
    };
  };
  recent: {
    totalOrders: number;
    totalRevenue: number;
    totalProductSales: number;
    totalDeliveryCost: number;
    avgOrderValue: number;
    countByStatus: {
      new: number;
      processing: number;
      completed: number;
      cancelled: number;
    };
  };
  topProducts: Array<{
    id: number;
    name: string;
    count: number;
    totalRevenue: number;
    imageUrl: string;
  }>;
  recentSales: Array<{
    period: string;
    count: number;
    revenue: number;
  }>;
}

// Reemplaza con tu URL base

export const analyticsService = {
  async getDashboardData(): Promise<AnalyticsData> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    console.log('API_URL: ', API_URL);
    
    const response = await fetch(`${API_URL}/analytics/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener datos del dashboard');
    }
    
    return await response.json();
  }
};