'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
	const _values = React.useMemo(
		() =>
			Array.isArray(value)
				? value
				: Array.isArray(defaultValue)
				? defaultValue
				: [min, max],
		[value, defaultValue, min, max]
	)

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			className={cn(
				'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
				className
			)}
			{...props}
		>
			<SliderPrimitive.Track
				data-slot="slider-track"
				className={
					'bg-slate-700/50 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 shadow-lg'
				}
			>
				<SliderPrimitive.Range
					data-slot="slider-range"
					className={
						'bg-gradient-to-r from-purple-600 to-purple-500 absolute shadow-lg shadow-purple-500/60 data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
					}
				/>
			</SliderPrimitive.Track>
			{Array.from({ length: _values.length }, (_, index) => (
				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					key={index}
					className="border-purple-400 bg-white ring-purple-400/50 block h-5 w-5 shrink-0 rounded-full border-2 shadow-lg shadow-purple-500/60 transition-all duration-300 hover:ring-4 hover:shadow-purple-400/80 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110"
				/>
			))}
		</SliderPrimitive.Root>
	)
}

export { Slider }
