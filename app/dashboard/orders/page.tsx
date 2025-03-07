'use client';

import { useState, useEffect } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

interface Order {
    id: string;
    timestamp: number;
    status: string;
    customer: {
        name: string;
        idNumber: string;
        phone: string;
        address: string;
        barrio: string;
        city: string;
    };
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        imageUrl: string;
    };
    payment: {
        total: number;
        productPrice: number;
        deliveryCost: number;
        imagePath: string;
    };
    attendedBy?: string;
    attendedTimestamp?: number;
    notes?: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'table' | 'chart'>('chart');

    useEffect(() => {
        async function fetchOrders() {
            // Simulación de llamada al endpoint
            const fakeData: Order[] = [
                {
                    id: "eeb1131f-59a5-4c40-8da0-a52effd1cb14",
                    timestamp: 1741201355315,
                    status: "new",
                    customer: { name: "Camilo", idNumber: "000", phone: "+573023606047", address: "Carrera 32 #21-26", barrio: "Rebolo", city: "Barranquilla" },
                    product: { id: 7, name: "TREVORCEL", description: "Descripción Articulo", price: 20000, imageUrl: "https://media-public.canva.com/VosOA/MAE4u9VosOA/1/s2.jpg" },
                    payment: { total: 35611.88, productPrice: 20000, deliveryCost: 15611.88, imagePath: "/media/payments/payment_1741201355313-28107951.jpg" }
                },
                {
                    id: "555131ab-c62e-475b-9b21-a6afe2de37fb",
                    timestamp: 1741202339658,
                    status: "new",
                    customer: { name: "Camilo", idNumber: "00", phone: "+573023606047", address: "Carrera 32 #21-26", barrio: "Rebolo", city: "Barranquilla" },
                    product: { id: 7, name: "TREVORCEL", description: "Descripción Articulo", price: 20000, imageUrl: "https://media-public.canva.com/VosOA/MAE4u9VosOA/1/s2.jpg" },
                    payment: { total: 35611.88, productPrice: 20000, deliveryCost: 15611.88, imagePath: "/media/payments/payment_1741202339656-34513375.jpg" }
                },
                {
                    id: "67ab192c-f8d1-4ec9-b237-4d5f6ac8b7e5",
                    timestamp: 1741103276543,
                    status: "completed",
                    customer: { name: "Laura Martínez", idNumber: "1234567", phone: "+573145678921", address: "Calle 45 #23-15", barrio: "Boston", city: "Barranquilla" },
                    product: { id: 3, name: "METRONIDAZOL", description: "Antibiótico tópico para piel", price: 15000, imageUrl: "https://media-public.canva.com/VosOA/MAE4u9VosOA/1/s3.jpg" },
                    payment: { total: 28500, productPrice: 15000, deliveryCost: 13500, imagePath: "/media/payments/payment_1741103276540-91253478.jpg" },
                    attendedBy: "operator1",
                    attendedTimestamp: 1741113578923
                }
                // ...más órdenes
            ];
            setOrders(fakeData);
            setLoading(false);
        }
        fetchOrders();
    }, []);

    // Cálculos básicos y complejos
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.payment.total, 0);
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const totalDeliveryCost = orders.reduce((acc, order) => acc + order.payment.deliveryCost, 0);
    const averageDeliveryCost = totalOrders ? totalDeliveryCost / totalOrders : 0;
    const netRevenue = totalRevenue - totalDeliveryCost;

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const revenueByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + order.payment.total;
        return acc;
    }, {} as Record<string, number>);

    const chartData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: 'Cantidad de Órdenes',
                data: Object.values(statusCounts),
                backgroundColor: 'rgba(75,192,192,0.6)'
            }
        ]
    };

    const revenueData = {
        labels: Object.keys(revenueByStatus),
        datasets: [
            {
                label: 'Ingresos por Estado',
                data: Object.values(revenueByStatus),
                backgroundColor: 'rgba(153,102,255,0.6)'
            }
        ]
    };

    const pieData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: 'Distribución de Órdenes',
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(255,99,132,0.6)',
                    'rgba(54,162,235,0.6)',
                    'rgba(255,206,86,0.6)',
                    'rgba(75,192,192,0.6)',
                    'rgba(153,102,255,0.6)',
                    'rgba(255,159,64,0.6)'
                ]
            }
        ]
    };

    if (loading) return <div>Cargando órdenes...</div>;

    return (
        <div className="flex flex-col space-y-4 p-4">
            {/* Tarjetas con cálculos básicos */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total de Órdenes</CardTitle>
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
                            {totalDeliveryCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Suma de costos de envío
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Costo Promedio de Envío</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {averageDeliveryCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Promedio por envío
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Completadas</CardTitle>
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
                        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos por Estado</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <Bar data={revenueData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Distribución de Órdenes</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos por Día</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <Line
                            data={{
                                labels: orders.map(order => new Date(order.timestamp).toLocaleDateString('es-CO')),
                                datasets: [
                                    {
                                        label: 'Ingresos',
                                        data: orders.map(order => order.payment.total),
                                        borderColor: 'rgba(75,192,192,1)',
                                        backgroundColor: 'rgba(75,192,192,0.2)',
                                        fill: true
                                    }
                                ]
                            }}
                            options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}