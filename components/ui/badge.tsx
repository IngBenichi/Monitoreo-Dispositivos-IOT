import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-purple-400 focus-visible:ring-purple-400/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-300 overflow-hidden shadow-md',
	{
		variants: {
			variant: {
				default:
					'border-purple-400/50 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-100 [a&]:hover:from-purple-500/30 [a&]:hover:to-purple-600/30 shadow-purple-500/40',
				secondary:
					'border-pink-400/50 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-100 [a&]:hover:from-pink-500/30 [a&]:hover:to-purple-500/30 shadow-pink-500/30',
				destructive:
					'border-pink-400/50 bg-gradient-to-r from-pink-500/20 to-red-500/20 text-pink-100 [a&]:hover:from-pink-500/30 [a&]:hover:to-red-500/30 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 shadow-pink-500/30',
				outline:
					'text-purple-200 border-purple-500/30 bg-slate-900/30 [a&]:hover:bg-purple-500/10 [a&]:hover:text-purple-100 [a&]:hover:border-purple-400/50 hover:shadow-purple-500/20',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'span'

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	)
}

export { Badge, badgeVariants }
