'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from './button';
import React from 'react';
import { type AnchorHTMLAttributes } from 'react';

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    href: string;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <Link
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
LinkButton.displayName = 'LinkButton';

export { LinkButton };
