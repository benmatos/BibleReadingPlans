
"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

const Prose = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'prose dark:prose-invert prose-p:text-foreground/90 max-w-none',
                className
            )}
            {...props}
        />
    )
})

Prose.displayName = "Prose";

export { Prose }
