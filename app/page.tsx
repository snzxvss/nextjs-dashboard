'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    
    useEffect(() => {
        router.push('/login');
    }, [router]);
    
    // Retornamos null o un loader mientras se realiza la redirección
    return null;
}