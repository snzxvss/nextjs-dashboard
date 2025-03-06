'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleIcon, VercelLogo } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
// Para mostrar alertas, instala sweetalert2: npm install sweetalert2
import Swal from 'sweetalert2';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Verificar si el usuario ya está autenticado
        if (authService.isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.login(formData.username, formData.password);
            // Redireccionar al dashboard en caso de éxito
            router.push('/dashboard');
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'Usuario o contraseña incorrectos',
                confirmButtonText: 'Intentar de nuevo'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="p-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="size-5 mr-2" />
                    <VercelLogo className="size-6 transition-all group-hover:scale-110" />
                </Link>
            </div>

            <div className="flex-1 flex justify-center items-start md:items-center p-8">
                <Card className="w-full max-w-sm">
                    <form onSubmit={handleLogin}>
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">
                                Iniciar sesión
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Input 
                                        type="text" 
                                        name="username"
                                        placeholder="Nombre de usuario" 
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </Button>
                            
                            {loading && (
                                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-primary animate-indeterminateProgress" />
                                </div>
                            )}
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}