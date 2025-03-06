'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleIcon, VercelLogo } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // register login

        router.push('/dashboard');
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
                            <CardTitle className="text-2xl">
                                Créer un compte
                            </CardTitle>
                            <CardDescription>
                                Créez un compte pour accéder à votre espace.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full">
                                    <GoogleIcon />
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground">
                                            Ou continuer avec
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Input type="email" placeholder="Email" />
                                    <Input
                                        type="password"
                                        placeholder="Mot de passe"
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Confirmer le mot de passe"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                S'inscirre
                            </Button>
                        </CardFooter>

                        <div className="mb-4 flex justify-center items-center gap-1 text-sm">
                            <span className="text-muted-foreground">
                                Vous avez déjà un compte ?
                            </span>
                            <Link className="font-medium" href="/login">
                                Connectez-vous
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
