// app/dashboard/orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import websocketService from '../../services/websocketService';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

interface Order {
    id: string;
    date: string;
    customer: string;
    total: number;
    status: 'new' | 'processing' | 'completed' | 'cancelled';
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/orders'); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data);
        } catch (e: any) {
            setError(`Failed to fetch orders: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // WebSocket integration
    const handleWebSocketMessage = useCallback((data: any) => {
        if (data.type === 'orders_updated') {
            console.log('Orders updated via WebSocket');
            fetchOrders();
        }
    }, [fetchOrders]);

    websocketService(handleWebSocketMessage);

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    // Basic calculations
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group orders by status
    const statusCounts = orders.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    // Net revenue calculation (assuming a fixed shipping cost)
    const shippingCost = 10;
    const netRevenue = totalRevenue - (totalOrders * shippingCost);

    // Chart data
    const orderStatusData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: 'Número de Órdenes',
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            {/* Display calculations and charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Órdenes registradas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalRevenue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ingresos generados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Valor Promedio por Orden</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {averageOrderValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Promedio de ingresos por pedido
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos Netos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {netRevenue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ingresos después de envíos
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Calculaciones adicionales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Costo Total de Envíos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {shippingCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Costo total de envíos
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Nuevas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts['new'] || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Órdenes nuevas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Finalizadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts['completed'] || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Órdenes finalizadas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Canceladas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts['cancelled'] || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Órdenes canceladas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos de órdenes y cálculos complejos */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes por Estado</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <Pie data={orderStatusData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}