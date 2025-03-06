'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react'; 

export default function DynamicBreadcrumb() {
    const pathname = usePathname();

    if (!pathname) return null;

    const segments = pathname.split('/').filter(Boolean);

    return (
        <nav aria-label="breadcrumb" className="hidden md:flex">
            <ol className="flex items-center gap-1.5">
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = `/${segments.slice(0, index + 1).join('/')}`;
                    const formattedSegment = segment
                        .split('-')
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ');

                    return (
                        <li
                            key={index}
                            className="inline-flex items-center gap-1.5"
                        >
                            {!isLast ? (
                                <>
                                    <Link
                                        href={href}
                                        className="text-sm font-medium hover:underline"
                                    >
                                        {formattedSegment}
                                    </Link>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />{' '}
                                </>
                            ) : (
                                <span className="text-sm font-normal text-foreground">
                                    {formattedSegment}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
