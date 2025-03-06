import './globals.css';

export const metadata = {
    title: 'E events',
    description: 'E events est un site web pour la gestion des événements.'
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="flex min-h-screen w-full flex-col">
                {children}
            </body>
        </html>
    );
}
