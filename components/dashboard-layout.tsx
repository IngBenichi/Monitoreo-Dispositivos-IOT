'use client'

import type React from 'react'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
	LayoutDashboard,
	Router,
	AlertTriangle,
	Settings,
	Search,
	User,
	Menu,
	X,
	Activity,
	Zap,
	Database,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
	children: React.ReactNode
}

const navigation = [
	{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
	{ name: 'Dispositivos IoT', href: '/devices', icon: Router },
	{ name: 'Telemetría', href: '/telemetry', icon: Activity },
	{ name: 'Alertas', href: '/alerts', icon: AlertTriangle },
	{ name: 'Configuración', href: '/config', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname()
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="min-h-screen bg-background">
			{/* Mobile sidebar */}
			<motion.div
				initial={false}
				animate={{ x: sidebarOpen ? 0 : '-100%' }}
				transition={{ type: 'tween', duration: 0.3 }}
				className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-purple-500/30 lg:hidden neon-glow-purple"
			>
				<div className="flex h-16 items-center justify-between px-6 border-b border-purple-500/20">
					<h1 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
						IoT SDN Dashboard
					</h1>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSidebarOpen(false)}
						className="text-purple-200 hover:bg-purple-500/20"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>
				<nav className="mt-8 px-4">
					<ul className="space-y-2">
						{navigation.map((item) => {
							const isActive = pathname === item.href
							return (
								<li key={item.name}>
									<a
										href={item.href}
										className={cn(
											'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
											isActive
												? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/40 neon-glow-purple'
												: 'text-purple-100 hover:bg-purple-900/30 hover:border-l-2 hover:border-purple-400'
										)}
									>
										<item.icon className="h-5 w-5" />
										{item.name}
									</a>
								</li>
							)
						})}
					</ul>
				</nav>
			</motion.div>

			{/* Desktop sidebar */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-gradient-to-b lg:from-slate-900 lg:to-slate-950 lg:border-r lg:border-purple-500/30 neon-glow-purple">
				<div className="flex h-16 items-center px-6 border-b border-purple-500/20">
					<h1 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
						IoT SDN Dashboard
					</h1>
				</div>
				<nav className="mt-8 px-4">
					<ul className="space-y-2">
						{navigation.map((item) => {
							const isActive = pathname === item.href
							return (
								<li key={item.name}>
									<a
										href={item.href}
										className={cn(
											'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
											isActive
												? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/40 neon-glow-purple'
												: 'text-purple-100 hover:bg-purple-900/30 hover:border-l-2 hover:border-purple-400'
										)}
									>
										<item.icon className="h-5 w-5" />
										{item.name}
									</a>
								</li>
							)
						})}
					</ul>
				</nav>
			</div>

			{/* Main content */}
			<div className="lg:pl-64">
				{/* Header */}
				<header className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-purple-500/30 bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 neon-glow-purple">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSidebarOpen(true)}
						className="lg:hidden text-purple-300 hover:bg-purple-500/20"
					>
						<Menu className="h-5 w-5" />
					</Button>

					<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
						<div className="relative flex flex-1 items-center">
							<Search className="absolute left-3 h-4 w-4 text-purple-400/50" />
							<Input
								placeholder="Buscar dispositivos, alertas..."
								className="pl-10 bg-slate-800/50 border border-purple-500/30 text-purple-100 placeholder:text-purple-400/40 focus:border-purple-400/60 focus:shadow-lg focus:shadow-purple-500/20"
							/>
						</div>
						<div className="flex items-center gap-x-4 lg:gap-x-6">
							<Button
								variant="ghost"
								size="sm"
								className="relative text-purple-300 hover:bg-purple-500/20"
							>
								<User className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</header>

				{/* Page content */}
				<main className="py-8">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						{children}
					</div>
				</main>
			</div>

			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	)
}
