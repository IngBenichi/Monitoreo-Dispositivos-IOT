'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface StatCardProps {
	name: string
	value: string | number
	icon: React.ComponentType<{ className?: string }>
	change?: string
	changeType?: 'positive' | 'negative' | 'neutral'
	description?: string
	unit?: string
}

export function StatCard({
	name,
	value,
	icon: Icon,
	change,
	changeType = 'neutral',
	description,
	unit,
}: StatCardProps) {
	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger asChild>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="cursor-help"
					>
						<Card className="bg-gradient-to-br from-slate-900/80 via-purple-900/10 to-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-purple-200 group-hover:text-purple-100 transition-colors flex items-center gap-2">
									{name}
									<Info className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
								</CardTitle>
								<Icon
									className={`h-4 w-4 ${
										changeType === 'positive'
											? 'text-purple-400'
											: changeType === 'negative'
											? 'text-pink-400'
											: 'text-purple-300'
									}`}
								/>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
									{value}
								</div>
								{change && (
									<p className="text-xs text-purple-200/70 mt-1">
										<span
											className={
												changeType === 'positive'
													? 'text-purple-400 font-semibold'
													: changeType === 'negative'
													? 'text-pink-400 font-semibold'
													: 'text-purple-300'
											}
										>
											{change}
										</span>{' '}
										desde la última hora
									</p>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</TooltipTrigger>
				<TooltipContent
					side="top"
					className="bg-gradient-to-r from-purple-900/98 to-purple-800/98 border-purple-500/60"
				>
					<div className="space-y-1 text-left">
						<p className="font-semibold text-purple-100">{name}</p>
						{description && (
							<p className="text-xs text-purple-200/80">{description}</p>
						)}
						{unit && (
							<p className="text-xs text-purple-200/70">Unidad: {unit}</p>
						)}
						<p className="text-xs text-purple-200/70 mt-2">
							Valor actual:{' '}
							<span className="font-semibold text-purple-300">{value}</span>
						</p>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
