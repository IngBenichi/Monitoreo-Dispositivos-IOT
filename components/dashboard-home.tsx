'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import {
	Router,
	Activity,
	Network,
	AlertTriangle,
	TrendingUp,
	Shield,
	Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts'
import {
	useSimulatedDashboard,
	useSimulatedDevices,
	useSimulatedAlerts,
	useSimulatedTelemetry,
} from '@/hooks/use-simulation'

export function DashboardHome() {
	// Usar datos simulados - actualiza cada 1 segundo
	const { dashboard: dashboardStats, loading: statsLoading } = useSimulatedDashboard(1000)
	const { devices, loading: devicesLoading } = useSimulatedDevices(1000)
	const { alerts, loading: alertsLoading } = useSimulatedAlerts(1000)

	// Calcular estadísticas en tiempo real usando useMemo para evitar re-renders infinitos
	const stats = useMemo(() => {
		if (devicesLoading || statsLoading || alertsLoading || !dashboardStats) {
			return [
				{
					name: 'Dispositivos conectados',
					value: '0',
					icon: Router,
					change: '+0',
					changeType: 'neutral' as const,
					description: 'Total de dispositivos IoT conectados en tiempo real',
					unit: 'dispositivos',
				},
				{
					name: 'Dispositivos activos',
					value: '0',
					icon: Activity,
					change: '0%',
					changeType: 'neutral' as const,
					description: 'Dispositivos que están activos en el sistema',
					unit: 'dispositivos',
				},
				{
					name: 'Tipos de dispositivos',
					value: '0',
					icon: Network,
					change: '0',
					changeType: 'neutral' as const,
					description: 'Diferentes tipos de dispositivos conectados',
					unit: 'tipos',
				},
				{
					name: 'Alertas activas',
					value: '0',
					icon: AlertTriangle,
					change: '+0',
					changeType: 'neutral' as const,
					description: 'Alertas activas que requieren atención',
					unit: 'alertas',
				},
			]
		}

		const activeAlerts = alerts?.filter(a => !a.resolved) || []
		const criticalAlerts = activeAlerts.filter(a => a.severity === 'Crítico')

		return [
			{
				name: 'Dispositivos conectados',
				value: dashboardStats.totalDevices.toString(),
				icon: Router,
				change: `+${dashboardStats.totalDevices}`,
				changeType: 'positive' as const,
				description: 'Total de dispositivos IoT conectados en tiempo real',
				unit: 'dispositivos',
			},
			{
				name: 'Dispositivos activos',
				value: dashboardStats.activeDevices.toString(),
				icon: Activity,
				change: `${Math.round((dashboardStats.activeDevices / dashboardStats.totalDevices) * 100)}%`,
				changeType: 'positive' as const,
				description: 'Dispositivos que están activos en el sistema',
				unit: 'dispositivos',
			},
			{
				name: 'Tipos de dispositivos',
				value: dashboardStats.deviceTypes.toString(),
				icon: Network,
				change: `${dashboardStats.deviceTypes}`,
				changeType: 'neutral' as const,
				description: 'Diferentes tipos de dispositivos conectados',
				unit: 'tipos',
			},
			{
				name: 'Alertas activas',
				value: activeAlerts.length.toString(),
				icon: AlertTriangle,
				change: criticalAlerts.length > 0 ? `+${criticalAlerts.length} críticas` : '0',
				changeType: criticalAlerts.length > 0 ? 'negative' as const : 'neutral' as const,
				description: 'Alertas activas que requieren atención',
				unit: 'alertas',
			},
		]
	}, [devicesLoading, statsLoading, alertsLoading, dashboardStats, alerts])

	// Preparar datos de distribución de tipos de dispositivos
	const deviceTypeData = useMemo(() => {
		if (!devices || devices.length === 0) return []
		
		const typeCount = devices.reduce((acc, device) => {
			acc[device.type] = (acc[device.type] || 0) + 1
			return acc
		}, {} as Record<string, number>)
		
		return Object.entries(typeCount).map(([name, value], index) => ({
			name,
			value,
			color: ['#b700ff', '#ff006e', '#ffb703', '#00d084', '#00f7ff'][
				index % 5
			],
		}))
	}, [devices])

	// Preparar datos de telemetría para gráfica de tendencias (últimos 12 puntos)
	const [trafficData, setTrafficData] = useState<any[]>([])

	useEffect(() => {
		// Generar datos de tráfico dinámicos en base a los dispositivos activos
		if (devices && devices.length > 0) {
			const now = Date.now()
			const data = []
			
			for (let i = 11; i >= 0; i--) {
				const time = new Date(now - i * 5 * 60 * 1000)
				const timeStr = time.toLocaleTimeString('es-ES', {
					hour: '2-digit',
					minute: '2-digit',
				})

				// Calcular tráfico promedio basado en dispositivos activos
				const activeDevices = devices.filter(d => d.status === 'active')
				const avgTraffic = activeDevices.reduce((sum, d) => sum + (d.cpu || 0) * 10, 0) / activeDevices.length

				data.push({
					time: timeStr,
					bps: Math.max(800, avgTraffic + (Math.random() - 0.5) * 100),
				})
			}
			setTrafficData(data)
		}
	}, [devices])

	// Preparar datos de alertas recientes
	const recentAlerts = useMemo(() => {
		if (!alerts || alerts.length === 0) return []
		
		return alerts.slice(0, 3).map((alert) => ({
			id: alert.id,
			type:
				alert.severity === 'Crítico'
					? 'critical'
					: alert.severity === 'Alto'
					? 'warning'
					: 'info',
			message: alert.message,
			time: new Date(alert.timestamp).toLocaleString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			}),
			icon:
				alert.severity === 'Crítico'
					? '🚨'
					: alert.severity === 'Alto'
					? '⚠️'
					: '🔵',
		}))
	}, [alerts])

	return (
		<div className="space-y-8">
			{/* Page header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
						Dashboard
					</h1>
					<p className="text-purple-200/70 mt-2">
						Monitoreo en tiempo real de la red IoT SDN (Simulación activa)
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/50 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/20">
						<Zap className="w-3 h-3 mr-1" />
						Actualización cada 1s
					</Badge>
				</div>
			</div>

			{/* Stats cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<StatCard
						key={stat.name}
						name={stat.name}
						value={stat.value}
						icon={stat.icon}
						change={stat.change}
						changeType={stat.changeType}
						description={stat.description}
						unit={stat.unit}
					/>
				))}
			</div>

			{/* Charts and alerts */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Traffic chart */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="lg:col-span-2"
				>
					<Card className="bg-gradient-to-br from-slate-900/80 via-purple-900/10 to-slate-900/80 border border-purple-400/40 hover:border-purple-400/70 rounded-2xl shadow-lg hover:shadow-purple-400/20 transition-all duration-300">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-transparent bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text">
								<TrendingUp className="h-5 w-5 text-purple-400" />
								Tráfico en tiempo real (Mbps)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-64 w-full">
								{trafficData.length > 0 ? (
									<ResponsiveContainer width="100%" height="100%">
										<LineChart
											data={trafficData}
											margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#1e2749"
												opacity={0.3}
											/>
											<XAxis
												dataKey="time"
												stroke="#8891b0"
												fontSize={12}
												tick={{ fill: '#8891b0' }}
											/>
											<YAxis
												stroke="#8891b0"
												fontSize={12}
												tick={{ fill: '#8891b0' }}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: '#111633',
													border: '1px solid #b700ff',
													borderRadius: '8px',
													color: '#e0e6ff',
													boxShadow: '0 0 20px rgba(183, 0, 255, 0.3)',
												}}
												labelStyle={{ color: '#e0e6ff' }}
											/>
											<Line
												type="monotone"
												dataKey="bps"
												stroke="#b700ff"
												strokeWidth={3}
												dot={{ fill: '#b700ff', strokeWidth: 2, r: 5 }}
												activeDot={{ r: 7, stroke: '#b700ff', strokeWidth: 2 }}
												isAnimationActive={true}
											/>
										</LineChart>
									</ResponsiveContainer>
								) : (
									<div className="h-full flex items-center justify-center text-purple-300/60">
										Cargando datos de telemetría...
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Device Type Distribution */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Card className="bg-gradient-to-br from-slate-900 via-pink-900/10 to-slate-900 border border-pink-500/40 hover:border-pink-500/70 rounded-2xl shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text">
								<Network className="h-5 w-5 text-pink-400" />
								Distribución de tipos de dispositivos
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="h-48 w-full">
								{deviceTypeData.length > 0 ? (
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={deviceTypeData}
												cx="50%"
												cy="50%"
												innerRadius={40}
												outerRadius={80}
												paddingAngle={2}
												dataKey="value"
												stroke="#0a0a0f"
												strokeWidth={2}
											>
												{deviceTypeData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
														opacity={0.95}
													/>
												))}
											</Pie>
											<Tooltip
												contentStyle={{
													backgroundColor: '#1a1a2e',
													border: '2px solid #b700ff',
													borderRadius: '12px',
													color: '#e0e6ff',
													boxShadow:
														'0 0 25px rgba(183, 0, 255, 0.4), inset 0 0 15px rgba(183, 0, 255, 0.1)',
													padding: '12px 16px',
												}}
												labelStyle={{ color: '#b700ff', fontWeight: 'bold' }}
												formatter={(value: number) => {
													return [value, 'Cantidad']
												}}
												cursor={{ fill: 'rgba(183, 0, 255, 0.1)' }}
											/>
										</PieChart>
									</ResponsiveContainer>
								) : (
									<div className="h-full flex items-center justify-center text-purple-300/60">
										No hay dispositivos disponibles
									</div>
								)}
							</div>
							{/* Device Type legend */}
							<div className="space-y-2">
								{deviceTypeData.length > 0 ? (
									deviceTypeData.map((deviceType) => (
										<div
											key={deviceType.name}
											className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
										>
											<div className="flex items-center gap-3">
												<div
													className="w-3 h-3 rounded-full shadow-lg"
													style={{
														backgroundColor: deviceType.color,
														boxShadow: `0 0 10px ${deviceType.color}`,
													}}
												/>
												<span className="text-sm font-medium text-purple-200">
													{deviceType.name}
												</span>
											</div>
											<span className="text-sm font-semibold text-purple-300">
												{deviceType.value}
											</span>
										</div>
									))
								) : (
									<div className="text-center text-purple-300/60 text-sm py-4">
										No hay dispositivos disponibles
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Recent alerts */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
			>
				<Card className="bg-gradient-to-br from-slate-900/80 via-orange-900/10 to-slate-900/80 border border-orange-500/40 hover:border-orange-500/70 rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-transparent bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text">
							<Shield className="h-5 w-5 text-orange-400" />
							Últimas alertas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentAlerts.map((alert: any) => (
								<div
									key={alert.id}
									className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-800/40 to-slate-800/20 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:shadow-orange-500/10"
								>
									<span className="text-lg">{alert.icon}</span>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-purple-100">
											{alert.message}
										</p>
										<p className="text-xs text-purple-300/60">{alert.time}</p>
									</div>
									<Badge
										variant={
											alert.type === 'critical' ? 'destructive' : 'secondary'
										}
										className={`text-xs font-semibold ${
											alert.type === 'critical'
												? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
												: 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
										}`}
									>
										{alert.type}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}
