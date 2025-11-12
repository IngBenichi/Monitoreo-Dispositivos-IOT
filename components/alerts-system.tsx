'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	AlertTriangle,
	Shield,
	Activity,
	Wifi,
	Lock,
	Eye,
	Filter,
	Clock,
	CheckCircle,
	XCircle,
	Info,
	RefreshCw,
	Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSimulatedAlerts } from '@/hooks/use-simulation'

interface Alert {
	id: number
	type: 'security' | 'network' | 'device' | 'system' | 'performance'
	severity: string
	title: string
	message: string
	timestamp: string
	device?: string
	protocol?: string
	resolved: boolean
	details?: string
}

const severityConfig: Record<string, any> = {
	Crítico: {
		variant: 'destructive' as const,
		icon: XCircle,
		color: 'text-red-400',
		bgColor: 'bg-red-500/10',
		borderColor: 'border-red-500/20',
		label: 'Crítico',
	},
	Alto: {
		variant: 'secondary' as const,
		icon: AlertTriangle,
		color: 'text-orange-500',
		bgColor: 'bg-orange-500/10',
		borderColor: 'border-orange-500/20',
		label: 'Alto',
	},
	Medio: {
		variant: 'outline' as const,
		icon: Info,
		color: 'text-yellow-500',
		bgColor: 'bg-yellow-500/10',
		borderColor: 'border-yellow-500/20',
		label: 'Medio',
	},
	Bajo: {
		variant: 'outline' as const,
		icon: Info,
		color: 'text-blue-500',
		bgColor: 'bg-blue-500/10',
		borderColor: 'border-blue-500/20',
		label: 'Bajo',
	},
}

const typeConfig: Record<string, any> = {
	security: {
		icon: Shield,
		label: 'Seguridad',
		color: 'text-red-400',
	},
	network: {
		icon: Activity,
		label: 'Red',
		color: 'text-purple-400',
	},
	device: {
		icon: Wifi,
		label: 'Dispositivo',
		color: 'text-yellow-500',
	},
	system: {
		icon: Lock,
		label: 'Sistema',
		color: 'text-blue-500',
	},
	performance: {
		icon: Zap,
		label: 'Performance',
		color: 'text-cyan-400',
	},
}

export function AlertsSystem() {
	// Usar datos simulados - actualiza cada 1 segundo
	const { alerts: simulatedAlerts, loading, refetch } = useSimulatedAlerts(1000)

	const [severityFilter, setSeverityFilter] = useState<string>('all')
	const [typeFilter, setTypeFilter] = useState<string>('all')
	const [statusFilter, setStatusFilter] = useState<string>('all')

	const alerts: Alert[] = simulatedAlerts || []

	// Aplicar filtros
	const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(alerts)

	useEffect(() => {
		let filtered = alerts

		// Apply severity filter
		if (severityFilter !== 'all') {
			filtered = filtered.filter((alert) => alert.severity === severityFilter)
		}

		// Apply type filter
		if (typeFilter !== 'all') {
			filtered = filtered.filter((alert) => alert.type === typeFilter)
		}

		// Apply status filter
		if (statusFilter !== 'all') {
			if (statusFilter === 'resolved') {
				filtered = filtered.filter((alert) => alert.resolved)
			} else if (statusFilter === 'active') {
				filtered = filtered.filter((alert) => !alert.resolved)
			} else if (statusFilter === 'acknowledged') {
				filtered = filtered.filter(
					(alert) => alert.acknowledged && !alert.resolved
				)
			}
		}

		setFilteredAlerts(filtered)
	}, [alerts, severityFilter, typeFilter, statusFilter])

	const handleResolveAlert = async (alertId: number) => {
		// En modo simulación, solo actualizamos localmente
		const updatedAlerts = alerts.map((alert) =>
			alert.id === alertId ? { ...alert, resolved: true } : alert
		)
		// En producción, aquí harías la llamada a la API
		console.log('Resolviendo alerta:', alertId)
	}

	const getAlertStats = () => {
		const stats = {
			total: alerts.length,
			critical: alerts.filter((a) => a.severity === 'Crítico' && !a.resolved)
				.length,
			major: alerts.filter((a) => a.severity === 'Alto' && !a.resolved).length,
			minor: alerts.filter((a) => a.severity === 'Medio' && !a.resolved).length,
			resolved: alerts.filter((a) => a.resolved).length,
		}
		return stats
	}

	const stats = getAlertStats()

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">Cargando alertas...</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Page header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent">
						Sistema de Alertas
					</h1>
					<p className="text-pink-200/70 mt-2">
						Monitoreo y gestión de eventos críticos de seguridad (Datos simulados en tiempo real)
					</p>
					<Badge className="mt-2 bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/50">
						<Zap className="w-3 h-3 mr-1" />
						Simulación Activa - Actualización cada 1s
					</Badge>
				</div>
			</div>

			{/* Stats cards */}
			<div className="grid gap-4 md:grid-cols-5">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/30 to-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 neon-glow-purple">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-blue-200">Total</p>
									<p className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
										{stats.total}
									</p>
								</div>
								<AlertTriangle className="h-8 w-8 text-purple-400" />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className="bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 border border-pink-500/40 hover:border-pink-500/70 rounded-2xl shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-pink-200">Críticas</p>
									<p className="text-3xl font-bold text-pink-400">
										{stats.critical}
									</p>
								</div>
								<XCircle className="h-8 w-8 text-pink-400" />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card className="bg-gradient-to-br from-slate-900 via-yellow-900/20 to-slate-900 border border-yellow-500/40 hover:border-yellow-500/70 rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-yellow-200">Mayores</p>
									<p className="text-3xl font-bold text-yellow-400">
										{stats.major}
									</p>
								</div>
								<AlertTriangle className="h-8 w-8 text-yellow-400" />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border border-blue-500/40 hover:border-blue-500/70 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-blue-200">Menores</p>
									<p className="text-3xl font-bold text-blue-400">
										{stats.minor}
									</p>
								</div>
								<Info className="h-8 w-8 text-blue-400" />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Card className="bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 border border-green-500/40 hover:border-green-500/70 rounded-2xl shadow-lg hover:shadow-green-500/20 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-green-200">
										Resueltas
									</p>
									<p className="text-3xl font-bold text-green-400">
										{stats.resolved}
									</p>
								</div>
								<CheckCircle className="h-8 w-8 text-green-400" />
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
			>
				<Card className="bg-card border-border rounded-2xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-foreground">
							<Filter className="h-5 w-5" />
							Filtros
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-center">
							<select
								value={severityFilter}
								onChange={(e) => setSeverityFilter(e.target.value)}
								className="w-full md:w-48 h-9 px-3 rounded-md bg-slate-800/50 border border-purple-500/30 text-purple-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
							>
								<option value="all">Todas las severidades</option>
								<option value="Crítico">Crítico</option>
								<option value="Alto">Alto</option>
								<option value="Medio">Medio</option>
								<option value="Bajo">Bajo</option>
							</select>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className="w-full md:w-48 h-9 px-3 rounded-md bg-slate-800/50 border border-purple-500/30 text-purple-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
							>
								<option value="all">Todos los tipos</option>
								<option value="security">Seguridad</option>
								<option value="network">Red</option>
								<option value="device">Dispositivo</option>
								<option value="system">Sistema</option>
								<option value="performance">Performance</option>
							</select>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="w-full md:w-48 h-9 px-3 rounded-md bg-slate-800/50 border border-purple-500/30 text-purple-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
							>
								<option value="all">Todos los estados</option>
								<option value="active">Activas</option>
								<option value="acknowledged">Reconocidas</option>
								<option value="resolved">Resueltas</option>
							</select>
							<Button
								onClick={() => refetch()}
								variant="outline"
								size="icon"
								className="bg-slate-800/50 border border-purple-500/30 text-purple-100 hover:bg-purple-500/20"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Alerts timeline */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7 }}
			>
				<Card className="bg-card border-border rounded-2xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-foreground">
							<Clock className="h-5 w-5" />
							Timeline de alertas ({filteredAlerts.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredAlerts.map((alert, index) => {
								const severityInfo = severityConfig[alert.severity] || severityConfig['Bajo']
								const typeInfo = typeConfig[alert.type] || typeConfig['device']
								const SeverityIcon = severityInfo.icon
								const TypeIcon = typeInfo.icon

								return (
									<motion.div
										key={alert.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.05 }}
										className={`relative p-6 rounded-2xl border ${
											severityInfo.bgColor
										} ${severityInfo.borderColor} ${
											alert.resolved ? 'opacity-60' : ''
										}`}
									>
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0">
												<div
													className={`p-3 rounded-full ${severityInfo.bgColor}`}
												>
													<SeverityIcon
														className={`h-6 w-6 ${severityInfo.color}`}
													/>
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<Badge
																variant={severityInfo.variant}
																className="text-xs"
															>
																{alert.severity}
															</Badge>
															<div className="flex items-center gap-1">
																<TypeIcon
																	className={`h-4 w-4 ${typeInfo.color}`}
																/>
																<span className="text-xs text-muted-foreground">
																	{typeInfo.label}
																</span>
															</div>
															{alert.protocol && (
																<Badge
																	variant="outline"
																	className="text-xs bg-cyan-500/10 text-cyan-300"
																>
																	{alert.protocol}
																</Badge>
															)}
															{alert.resolved && (
																<Badge
																	variant="outline"
																	className="text-xs bg-green-500/10 text-green-300"
																>
																	Resuelta
																</Badge>
															)}
														</div>
														<h3 className="text-lg font-semibold text-foreground mb-1">
															{alert.title}
														</h3>
														<p className="text-muted-foreground mb-3">
															{alert.message}
														</p>
														<div className="flex items-center gap-4 text-sm text-muted-foreground">
															<span className="flex items-center gap-1">
																<Clock className="h-4 w-4" />
																{new Date(alert.timestamp).toLocaleString('es-ES')}
															</span>
															{alert.device && (
																<span className="flex items-center gap-1">
																	<Wifi className="h-4 w-4" />
																	{alert.device}
																</span>
															)}
														</div>
														{alert.details && (
															<div className="mt-3 p-3 rounded-lg bg-muted/50">
																<p className="text-sm text-muted-foreground">
																	{alert.details}
																</p>
															</div>
														)}
													</div>
													<div className="flex-shrink-0">
														{!alert.resolved && (
															<Button
																variant="outline"
																size="sm"
																onClick={() => handleResolveAlert(alert.id)}
																className="text-xs"
															>
																<CheckCircle className="h-4 w-4 mr-1" />
																Resolver
															</Button>
														)}
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								)
							})}
							{filteredAlerts.length === 0 && (
								<div className="text-center py-12">
									<Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
									<p className="text-muted-foreground">
										No se encontraron alertas con los filtros aplicados
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}
