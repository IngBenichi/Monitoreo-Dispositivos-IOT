'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

export function TooltipProvider({
	children,
	delayDuration = 200,
	skipDelayDuration = 500,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider> & {
	delayDuration?: number
	skipDelayDuration?: number
}) {
	return (
		<TooltipPrimitive.Provider
			delayDuration={delayDuration}
			skipDelayDuration={skipDelayDuration}
			{...props}
		>
			{children}
		</TooltipPrimitive.Provider>
	)
}

export const Tooltip = TooltipPrimitive.Root

export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				sideOffset={sideOffset}
				className={cn(
					'bg-gradient-to-r from-purple-900/95 to-purple-800/95 text-purple-100 border border-purple-500/60 shadow-lg shadow-purple-500/40 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-lg px-4 py-2.5 text-xs text-balance',
					className
				)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className="fill-purple-900" />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}
