'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, FileImage, X, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { fetchOrders, updateOrderStatus } from '../../services/ordersService';

type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

interface Order {
    id: string;
    image: string;
    amount: number;
    status: OrderStatus;
    date: string;
    customer: string | {
        name: string;
        idNumber: string;
        phone: string;
        address: string;
        barrio: string;
        city: string;
    };
    items: number;
    address?: string;
    phone?: string;
    paymentProof?: string;
    products?: Array<{ id: string; name: string; quantity: number; price: number }>;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showProofModal, setShowProofModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToChange, setStatusToChange] = useState<'completed' | 'cancelled'>('completed');
    const [isZoomed, setIsZoomed] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [originOffset, setOriginOffset] = useState({ x: 0, y: 0 });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const fetchOrdersData = useCallback(async () => {
        try {
            const ordersData = await fetchOrders();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
        }
    }, []);

    useEffect(() => {
        fetchOrdersData();
    }, [fetchOrdersData]);

    // Sin cambios en la lógica, el handleCardClick queda igual:
const handleCardClick = async (order: Order) => {
    if (order.status === 'new') {
        try {
            const updatedOrder = await updateOrderStatus(order.id, 'processing');
            setOrders((prev) =>
                prev.map(o => (o.id === order.id ? updatedOrder : o))
            );
            setSelectedOrder(updatedOrder);
        } catch (error) {
            console.error('Error al actualizar el estado a "processing":', error);
        }
    } else {
        setSelectedOrder(order);
    }
};

    // En la sección de manejo del cambio de estado...
const handleStatusChange = async () => {
    if (!selectedOrder) return;
    try {
      const updatedOrder = await updateOrderStatus(selectedOrder.id, statusToChange);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
      );
      setSelectedOrder(updatedOrder);
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

    const openStatusModal = (status: 'completed' | 'cancelled') => {
        setStatusToChange(status);
        setShowStatusModal(true);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pedidos</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <Card
                        key={order.id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleCardClick(order)}
                    >
                        <div className="relative h-48 w-full">
                            <Image
                                src={order.image || '/placeholder.svg'}
                                alt={`Orden ${order.id}`}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                            </div>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{order.id}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${{
                                        new: 'bg-blue-500',
                                        processing: 'bg-amber-500',
                                        completed: 'bg-green-500',
                                        cancelled: 'bg-red-500'
                                    }[order.status]}`} />
                                    <span className="text-sm text-muted-foreground">
                                        {{
                                            new: 'Nuevo',
                                            processing: 'Procesando',
                                            completed: 'Completado',
                                            cancelled: 'Cancelado'
                                        }[order.status]}
                                    </span>
                                </div>
                            </div>
                            <CardDescription>{formatDate(order.date)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Monto:</span>
                                <span className="font-bold">{formatCurrency(order.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Cliente:</span>
                                <span>
                                    {typeof order.customer === 'object'
                                    ? order.customer.name
                                    : order.customer}
                                </span>
                                </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <span className="text-sm text-muted-foreground">{order.items} productos</span>
                            <Badge variant={order.status === 'cancelled' ? 'destructive' : 'outline'}>
                                {{
                                    new: 'Nuevo',
                                    processing: 'Procesando',
                                    completed: 'Completado',
                                    cancelled: 'Cancelado'
                                }[order.status]}
                            </Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Modal de detalles de orden */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Orden {selectedOrder.id}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Creada el {formatDate(selectedOrder.date)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${{
                                        new: 'bg-blue-500',
                                        processing: 'bg-amber-500',
                                        completed: 'bg-green-500',
                                        cancelled: 'bg-red-500'
                                    }[selectedOrder.status]}`} />
                                    <span className="text-sm">
                                        {{
                                            new: 'Nuevo',
                                            processing: 'Procesando',
                                            completed: 'Completado',
                                            cancelled: 'Cancelado'
                                        }[selectedOrder.status]}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="rounded-full p-1 hover:bg-muted"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                          
<div className="grid grid-cols-2 gap-2">
  <div>
    <p className="text-sm font-medium">Nombre:</p>
    <p className="text-sm">
      {typeof selectedOrder.customer === 'object'
        ? selectedOrder.customer.name
        : selectedOrder.customer}
    </p>
  </div>
  <div>
    <p className="text-sm font-medium">Teléfono:</p>
    <p className="text-sm">
      {typeof selectedOrder.customer === 'object'
        ? selectedOrder.customer.phone
        : selectedOrder.phone}
    </p>
  </div>
  <div>
    <p className="text-sm font-medium">Dirección:</p>
    <p className="text-sm">
      {typeof selectedOrder.customer === 'object'
        ? selectedOrder.customer.address
        : selectedOrder.address}
    </p>
  </div>
</div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={() => setShowProofModal(true)}
                                >
                                    <FileImage className="mr-2 h-4 w-4" />
                                    Ver comprobante de pago
                                </Button>
                                {selectedOrder.status === 'processing' && (
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="default"
                                            className="flex-1"
                                            onClick={() => openStatusModal('completed')}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Completar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => openStatusModal('cancelled')}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Cancelar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de comprobante de pago */}
            {showProofModal && selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Comprobante de pago</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Orden {selectedOrder?.id}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowProofModal(false);
                                        setIsZoomed(false);
                                    }}
                                    className="rounded-full p-1 hover:bg-muted"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            {/* Imagen con controles de zoom y movimiento al mantener clic */}
                            <div
                                className={`relative h-96 w-full overflow-hidden ${isZoomed ? (dragStart ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
                                onMouseDown={(e) => {
                                    // Only start dragging with left-click (e.button === 0)
                                    if (isZoomed && e.button === 0) {
                                    e.preventDefault(); // prevent default behavior
                                    setDragStart({ x: e.clientX, y: e.clientY });
                                    setOriginOffset(offset);
                                    }
                                }}
                                onMouseMove={(e) => {
                                    // Only move image if left button is pressed (e.buttons === 1)
                                    if (isZoomed && dragStart && e.buttons === 1) {
                                    const dx = e.clientX - dragStart.x;
                                    const dy = e.clientY - dragStart.y;
                                    setOffset({ x: originOffset.x + dx, y: originOffset.y + dy });
                                    setDragStart({ x: e.clientX, y: e.clientY });
                                    }
                                }}
                                onMouseUp={() => isZoomed && setDragStart(null)}
                                onMouseLeave={() => isZoomed && setDragStart(null)}
                                onContextMenu={(e) => e.preventDefault()}  // Disable default right-click menu
                                >
                                <Image
                                    src={selectedOrder.paymentProof || '/placeholder.svg'}
                                    alt="Comprobante de pago"
                                    fill
                                    unoptimized
                                    style={{
                                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${isZoomed ? 1.5 : 1})`,
                                    transition: 'transform 300ms'
                                    }}
                                    className="object-contain"
                                />
                                <button
                                    onClick={() => setIsZoomed(true)}
                                    className={`absolute top-2 ${isZoomed ? 'right-12' : 'right-10'} bg-white rounded-full p-1 shadow-lg`}
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setIsZoomed(false)}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de cambio de estado */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-sm">
                        <div className="p-6">
                            <h2 className="text-xl font-bold">
                                {statusToChange === 'completed' ? '¿Completar pedido?' : '¿Cancelar pedido?'}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                {statusToChange === 'completed'
                                    ? 'Esta acción marcará el pedido como completado.'
                                    : 'Esta acción marcará el pedido como cancelado.'}
                            </p>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowStatusModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant={statusToChange === 'completed' ? 'default' : 'destructive'}
                                    onClick={handleStatusChange}
                                >
                                    {statusToChange === 'completed' ? 'Completar' : 'Cancelar pedido'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}