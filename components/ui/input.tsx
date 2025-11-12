import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'file:text-purple-100 placeholder:text-purple-400/40 selection:bg-purple-500 selection:text-white bg-slate-900/50 border-purple-500/30 flex h-10 w-full min-w-0 rounded-lg border px-4 py-2 text-base text-purple-100 shadow-md transition-all duration-300 outline-none file:inline-flex file:h-8 file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-purple-600 file:text-sm file:font-medium file:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'focus-visible:border-purple-400 focus-visible:ring-purple-400/50 focus-visible:ring-[3px] focus-visible:shadow-lg focus-visible:shadow-purple-500/30',
				'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:border-purple-400/50',
				className
			)}
			{...props}
		/>
	)
}

export { Input }
