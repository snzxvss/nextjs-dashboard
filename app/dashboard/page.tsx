'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { analyticsService, AnalyticsData } from '../services/analyticsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const analyticsData = await analyticsService.getDashboardData();
                setData(analyticsData);
            } catch (err) {
                setError('Error al cargar los datos del dashboard');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
          <div className="relative flex flex-col items-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <span className="mt-4 text-muted-foreground">Cargando...</span>
          </div>
        </div>
      );
    if (error) return <div className="text-red-500">{error}</div>;
    if (!data) return <div>No hay datos disponibles</div>;

    // Formatear número como moneda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="flex flex-col space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.allTime.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Total histórico
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.allTime.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Pedidos totales
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.allTime.countByStatus.new + data.allTime.countByStatus.processing}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Nuevos y en proceso
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Valor promedio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.allTime.avgOrderValue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Por pedido
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Sección de ventas recientes y productos top */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Vista general</CardTitle>
                        <CardDescription>Ventas recientes por día</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data.recentSales}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#8884d8" 
                                    activeDot={{ r: 8 }} 
                                    name="Ingresos"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Productos más vendidos</CardTitle>
                        <CardDescription>
                            Top {data.topProducts.length} productos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {data.topProducts.map((product) => (
                                <div key={product.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={product.imageUrl}
                                            alt={product.name}
                                        />
                                        <AvatarFallback>{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {product.count} vendidos
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {formatCurrency(product.totalRevenue)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}