import Link from 'next/link';
import {
    Home,
    PanelLeft,
    Package,
    Table,
    BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchInput } from './search';
import { User } from './user';
import { VercelLogo } from '@/components/icons';
import Providers from './providers';
import { NavItem } from './nav-item';
import DynamicBreadcrumb from '@/components/ui/dashboard/dynamic-breadcrumb';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <main className="flex min-h-screen w-full flex-col" suppressHydrationWarning={true}>
                <DesktopNav />
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <MobileNav />
                        <User />
                    </header>
                    <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
                        {children}
                    </main>
                </div>
            </main>
        </Providers>
    );
}

function DesktopNav() {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    href="/"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                </Link>

                <NavItem href="/dashboard" label="Panel de control">
                    <Home className="h-5 w-5" />
                </NavItem>
                
                <NavItem href="/dashboard/products" label="Productos">
                    <Package className="h-5 w-5" />
                </NavItem>
                
                <NavItem href="/dashboard/sheet" label="Editor">
                    <Table className="h-5 w-5" />
                </NavItem>
                
                <NavItem href="/dashboard/orders" label="Contabilidad">
                    <BarChart2 className="h-5 w-5" />
                </NavItem>
            </nav>
        </aside>
    );
}

export function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Alternar Menú</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                        href="/"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                        <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
                        <span className="sr-only">Vercel</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Home className="h-5 w-5" />
                        Panel de control
                    </Link>
                    <Link
                        href="/dashboard/products"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Package className="h-5 w-5" />
                        Productos
                    </Link>
                    <Link
                        href="/dashboard/orders"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <BarChart2 className="h-5 w-5" />
                        Contabilidad
                    </Link>
                    <Link
                        href="/dashboard/sheet"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Table className="h-5 w-5" />
                        Editor
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}