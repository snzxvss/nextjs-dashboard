'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SheetRow {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
}

export default function SheetPage() {
    const [rows, setRows] = useState<SheetRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    useEffect(() => {
        async function fetchData() {
            const initialData: SheetRow[] = [
                {
                    id: 1,
                    name: 'ZORVELLIS',
                    description: 'Different widths and colors.',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/-WFkI/MADzDK-WFkI/1/s.jpg',
                    stock: 10
                },
                {
                    id: 2,
                    name: 'BORTENZA',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-private.canva.com/hkB6U/MAFos8hkB6U/1/s.jpg?...',
                    stock: 20
                },
                {
                    id: 3,
                    name: 'KORVELT',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/MADGvzpI3zs/7/screen.jpg',
                    stock: 30
                },
                {
                    id: 4,
                    name: 'LORZELLIN',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/OxzSQ/MAEaLuOxzSQ/1/s.jpg',
                    stock: 40
                },
                {
                    id: 5,
                    name: 'VORCELOM',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/aI2k4/MAEcFIaI2k4/1/s.jpg',
                    stock: 50
                },
                {
                    id: 6,
                    name: 'NARZELIA',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/aI2k4/MAEcFIaI2k4/1/s.jpg',
                    stock: 60
                },
                {
                    id: 7,
                    name: 'TREVORCEL',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/VosOA/MAE4u9VosOA/1/s2.jpg',
                    stock: 70
                },
                {
                    id: 8,
                    name: 'BORZENNIS',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/OxzSQ/MAEaLuOxzSQ/1/s.jpg',
                    stock: 80
                },
                {
                    id: 9,
                    name: 'DORVELLAN',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/OxzSQ/MAEaLuOxzSQ/1/s.jpg',
                    stock: 90
                },
                {
                    id: 10,
                    name: 'SERBOLLE',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/OxzSQ/MAEaLuOxzSQ/1/s.jpg',
                    stock: 100
                },
                {
                    id: 11,
                    name: 'MORZELLIS',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/OxzSQ/MAEaLuOxzSQ/1/s.jpg',
                    stock: 110
                },
                {
                    id: 12,
                    name: 'ZORBELLUM',
                    description: 'Descripción Articulo',
                    price: 20000,
                    imageUrl: 'https://media-public.canva.com/OxzSQ/MAEaLuOxzSQ/1/s.jpg',
                    stock: 120
                }
            ];
            setRows(initialData);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleSave = async () => {
        console.log('Guardando filas:', rows);
        alert('Datos guardados exitosamente');
    };

    const handleDelete = (id: number) => {
        setRows(prev => prev.filter(r => r.id !== id));
    };

    const handleAddRow = () => {
        const newRow: SheetRow = {
            id: rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1,
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            stock: 0
        };
        setRows(prev => [...prev, newRow]);
    };

    const handleDownloadCSV = () => {
        const header = ['ID', 'Nombre', 'Descripción', 'Precio', 'ImagenURL', 'Stock'].join(';');
        const data = rows.map(r => [r.id, r.name, r.description, r.price, r.imageUrl, r.stock].join(';'));
        const csvContent = "\ufeff" + [header, ...data].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sheet.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const headers = [['ID', 'Nombre', 'Descripción', 'Precio', 'ImagenURL', 'Stock']];
        const data = rows.map(r => [r.id, r.name, r.description, r.price, r.imageUrl, r.stock]);
        autoTable(doc, { head: headers, body: data, startY: 20, theme: 'grid', headStyles: { fillColor: [211,211,211] } });
        doc.save('sheet.pdf');
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) return <div>Cargando datos...</div>;

    return (
        <Card className="p-4">
            <CardHeader className="flex flex-col gap-2">
                <CardTitle>Editor de Hoja de Cálculo</CardTitle>
                <div className="flex flex-wrap gap-2">
                    <Button onClick={handleAddRow}>Agregar fila</Button>
                    <Button onClick={handleDownloadCSV}>Descargar CSV</Button>
                    <Button onClick={handleDownloadPDF}>Descargar PDF</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2 p-2 bg-gray-100 font-bold text-sm">
                    <span>ID</span>
                    <span>Nombre</span>
                    <span>Descripción</span>
                    <span>Precio</span>
                    <span>ImagenURL</span>
                    <span>Stock</span>
                    <span>Acciones</span>
                </div>
                {currentRows.map(row => (
                    <div key={row.id} className="grid grid-cols-7 gap-2 p-2 border-b border-gray-200 items-center text-sm">
                        <div>{row.id}</div>
                        <div>
                            <input
                                type="text"
                                value={row.name}
                                onChange={(e) =>
                                    setRows(prev =>
                                        prev.map(r => r.id === row.id ? { ...r, name: e.target.value } : r)
                                    )
                                }
                                className="w-full border rounded p-1 text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={row.description}
                                onChange={(e) =>
                                    setRows(prev =>
                                        prev.map(r => r.id === row.id ? { ...r, description: e.target.value } : r)
                                    )
                                }
                                className="w-full border rounded p-1 text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                value={row.price}
                                onChange={(e) =>
                                    setRows(prev =>
                                        prev.map(r => r.id === row.id ? { ...r, price: Number(e.target.value) } : r)
                                    )
                                }
                                className="w-full border rounded p-1 text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={row.imageUrl}
                                onChange={(e) =>
                                    setRows(prev =>
                                        prev.map(r => r.id === row.id ? { ...r, imageUrl: e.target.value } : r)
                                    )
                                }
                                className="w-full border rounded p-1 text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                value={row.stock}
                                onChange={(e) =>
                                    setRows(prev =>
                                        prev.map(r => r.id === row.id ? { ...r, stock: Number(e.target.value) } : r)
                                    )
                                }
                                className="w-full border rounded p-1 text-sm"
                            />
                        </div>
                        <div>
                            <Button variant="destructive" onClick={() => handleDelete(row.id)}>Eliminar</Button>
                        </div>
                    </div>
                ))}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                    <div className="flex gap-2">
                        <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                        <Button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</Button>
                    </div>
                    <div className="text-sm">
                        Página {currentPage} de {totalPages}
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <Button onClick={handleSave}>Guardar cambios</Button>
                </div>
            </CardContent>
        </Card>
    );
}