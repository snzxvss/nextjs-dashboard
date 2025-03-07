'use client';

import { useState } from 'react';
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
import { CheckCircle, XCircle, FileImage, X } from 'lucide-react';
import Image from 'next/image';

type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

interface Order {
    id: string;
    image: string;
    amount: number;
    status: OrderStatus;
    date: string;
    customer: string;
    items: number;
    address?: string;
    phone?: string;
    email?: string;
    paymentProof?: string;
    products?: Array<{ id: string; name: string; quantity: number; price: number }>;
}

// Sample data
const sampleOrders: Order[] = [
    {
        id: 'ORD-001',
        image: '/placeholder.svg',
        amount: 125000,
        status: 'new',
        date: '2023-05-15',
        customer: 'Juan Pérez',
        items: 3,
        address: 'Calle 123 #45-67, Bogotá',
        phone: '300 123 4567',
        email: 'juan.perez@example.com',
        paymentProof: '/placeholder.svg',
        products: [
            { id: 'P1', name: 'Producto 1', quantity: 1, price: 50000 },
            { id: 'P2', name: 'Producto 2', quantity: 2, price: 37500 }
        ]
    },
    {
        id: 'ORD-002',
        image: '/placeholder.svg',
        amount: 78500,
        status: 'processing',
        date: '2023-05-14',
        customer: 'María López',
        items: 2,
        address: 'Avenida 78 #23-45, Medellín',
        phone: '310 987 6543',
        email: 'maria.lopez@example.com',
        paymentProof: '/placeholder.svg',
        products: [
            { id: 'P3', name: 'Producto 3', quantity: 1, price: 45000 },
            { id: 'P4', name: 'Producto 4', quantity: 1, price: 33500 }
        ]
    },
    {
        id: 'ORD-003',
        image: '/placeholder.svg',
        amount: 245000,
        status: 'completed',
        date: '2023-05-10',
        customer: 'Carlos Rodríguez',
        items: 5,
        address: 'Carrera 45 #12-34, Cali',
        phone: '320 456 7890',
        email: 'carlos.rodriguez@example.com',
        paymentProof: '/placeholder.svg',
        products: [
            { id: 'P1', name: 'Producto 1', quantity: 2, price: 100000 },
            { id: 'P5', name: 'Producto 5', quantity: 3, price: 145000 }
        ]
    },
    {
        id: 'ORD-004',
        image: '/placeholder.svg',
        amount: 56000,
        status: 'cancelled',
        date: '2023-05-09',
        customer: 'Ana Martínez',
        items: 1,
        address: 'Calle 67 #89-12, Barranquilla',
        phone: '315 234 5678',
        email: 'ana.martinez@example.com',
        paymentProof: '/placeholder.svg',
        products: [
            { id: 'P6', name: 'Producto 6', quantity: 1, price: 56000 }
        ]
    },
    {
        id: 'ORD-005',
        image: '/placeholder.svg',
        amount: 189000,
        status: 'new',
        date: '2023-05-15',
        customer: 'Roberto Sánchez',
        items: 4,
        address: 'Diagonal 23 #45-67, Bucaramanga',
        phone: '305 678 9012',
        email: 'roberto.sanchez@example.com',
        paymentProof: '/placeholder.svg',
        products: [
            { id: 'P7', name: 'Producto 7', quantity: 2, price: 89000 },
            { id: 'P8', name: 'Producto 8', quantity: 2, price: 100000 }
        ]
    },
    {
        id: 'ORD-006',
        image: '/placeholder.svg',
        amount: 92500,
        status: 'processing',
        date: '2023-05-13',
        customer: 'Laura González',
        items: 2,
        address: 'Transversal 56 #78-90, Cartagena',
        phone: '350 123 4567',
        email: 'laura.gonzalez@example.com',
        paymentProof: '/placeholder.svg',
        products: [
            { id: 'P9', name: 'Producto 9', quantity: 1, price: 42500 },
            { id: 'P10', name: 'Producto 10', quantity: 1, price: 50000 }
        ]
    },
];

// Status color mapping
const statusColors: Record<OrderStatus, string> = {
    new: 'bg-blue-500',
    processing: 'bg-amber-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500'
};

// Status label mapping
const statusLabels: Record<OrderStatus, string> = {
    new: 'Nuevo',
    processing: 'Procesando',
    completed: 'Completado',
    cancelled: 'Cancelado'
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(sampleOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showProofModal, setShowProofModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToChange, setStatusToChange] = useState<'completed' | 'cancelled'>('completed');

    // Formatear número como moneda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Handle card click
    const handleCardClick = (order: Order) => {
        // If the order is new, change it to processing
        if (order.status === 'new') {
            const updatedOrders = orders.map(o => 
                o.id === order.id ? { ...o, status: 'processing' as OrderStatus } : o
            );
            setOrders(updatedOrders);
            // Update the order to show in modal
            const updatedOrder = { ...order, status: 'processing' as OrderStatus };
            setSelectedOrder(updatedOrder);
        } else {
            setSelectedOrder(order);
        }
    };

    // Handle status change
    const handleStatusChange = () => {
        if (!selectedOrder) return;
        
        const updatedOrders = orders.map(o => 
            o.id === selectedOrder.id ? { ...o, status: statusToChange } : o
        );
        setOrders(updatedOrders);
        setSelectedOrder({ ...selectedOrder, status: statusToChange });
        setShowStatusModal(false);
    };

    // Open status change confirmation dialog
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
                                src={order.image}
                                alt={`Orden ${order.id}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{order.id}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${statusColors[order.status]}`} />
                                    <span className="text-sm text-muted-foreground">{statusLabels[order.status]}</span>
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
                                <span>{order.customer}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <span className="text-sm text-muted-foreground">{order.items} productos</span>
                            <Badge variant={order.status === 'cancelled' ? 'destructive' : 'outline'}>
                                {statusLabels[order.status]}
                            </Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Orden {selectedOrder.id}</h2>
                                    <p className="text-sm text-muted-foreground">Creada el {formatDate(selectedOrder.date)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${statusColors[selectedOrder.status]}`} />
                                    <span className="text-sm">{statusLabels[selectedOrder.status]}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedOrder(null)} 
                                    className="rounded-full p-1 hover:bg-muted"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            <div className="grid gap-4 py-4">
                                <h3 className="font-bold">Información del cliente</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-sm font-medium">Nombre:</p>
                                        <p className="text-sm">{selectedOrder.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Teléfono:</p>
                                        <p className="text-sm">{selectedOrder.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Email:</p>
                                        <p className="text-sm">{selectedOrder.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Dirección:</p>
                                        <p className="text-sm">{selectedOrder.address}</p>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold mt-2">Detalles del pedido</h3>
                                <div className="space-y-2">
                                    {selectedOrder.products && selectedOrder.products.map(product => (
                                        <div key={product.id} className="flex justify-between">
                                            <span>{product.quantity} x {product.name}</span>
                                            <span>{formatCurrency(product.price)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span>{formatCurrency(selectedOrder.amount)}</span>
                                    </div>
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
            
            {/* Payment Proof Modal */}
            {showProofModal && selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Comprobante de pago</h2>
                                    <p className="text-sm text-muted-foreground">Orden {selectedOrder?.id}</p>
                                </div>
                                <button 
                                    onClick={() => setShowProofModal(false)} 
                                    className="rounded-full p-1 hover:bg-muted"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="relative h-96 w-full">
                                <Image
                                    src={selectedOrder.paymentProof || '/placeholder.svg'}
                                    alt="Comprobante de pago"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Status Change Confirmation Modal */}
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