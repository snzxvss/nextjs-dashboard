import './globals.css';

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="flex min-h-screen w-full flex-col">
                {children}
            </body>
        </html>
    );
}