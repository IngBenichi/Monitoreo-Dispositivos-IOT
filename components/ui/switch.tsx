'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				'peer data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-purple-600 data-[state=checked]:shadow-lg data-[state=checked]:shadow-purple-500/60 data-[state=unchecked]:bg-slate-700/50 data-[state=unchecked]:border-slate-600 focus-visible:border-purple-400 focus-visible:ring-purple-400/50 inline-flex h-6 w-12 shrink-0 items-center rounded-full border-2 border-slate-600 shadow-md transition-all duration-300 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 hover:border-purple-400/50',
				className
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={
					'data-[state=checked]:bg-white data-[state=unchecked]:bg-slate-400 pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all duration-300 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 data-[state=checked]:shadow-purple-400/60'
				}
			/>
		</SwitchPrimitive.Root>
	)
}

export { Switch }
