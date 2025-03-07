export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export interface Order {
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
// Se define PAYMENT_PROOF_BASE_URL para mayor flexibilidad, si lo requieres.
const PAYMENT_PROOF_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_PROOF_BASE_URL || '';

/*
  Esta función obtiene el token de localStorage, consulta el endpoint
  y mapea la respuesta ajustando la URL del comprobante de pago para que apunte a "/media/payments/"
*/
export async function fetchOrders(): Promise<Order[]> {
  const token = localStorage.getItem('token');
  const endpoint = `${API_BASE}/api/orders`;
  const res = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.map((order: any) => ({
    id: order.id,
    image: order.product.imageUrl,
    amount: order.payment.total,
    status: order.status,
    date: new Date(order.timestamp).toISOString(),
    customer: order.customer.name,
    items: 1,
    address: order.customer.address,
    phone: order.customer.phone,
    email: order.customer.email || '',
    // Se construye la URL con la ruta fija /media/payments/
    paymentProof: `${API_BASE}${order.payment.imagePath}`,
    products: [
      {
        id: String(order.product.id),
        name: order.product.name,
        quantity: 1,
        price: order.product.price,
      }
    ]
  }));
}

export async function updateOrderStatus(id: string, status: 'processing' | 'completed' | 'cancelled'): Promise<Order> {
  const token = localStorage.getItem('token');
  const endpoint = `${API_BASE}/api/orders/${id}/status`;
  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
}