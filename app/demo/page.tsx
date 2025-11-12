'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import {
	Activity,
	AlertTriangle,
	Cpu,
	Database,
	HardDrive,
	Network,
	Power,
	Router,
	Server,
	Shield,
	TrendingDown,
	TrendingUp,
	Wifi,
	Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	LineChart,
	Line,
	AreaChart,
	Area,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'
import {
	useSimulatedDashboard,
	useSimulatedDevices,
	useSimulatedAlerts,
	resetSimulation,
} from '@/hooks/use-simulation'

const COLORS = [
	'#00d4ff',
	'#ff006e',
	'#00f081',
	'#ffb703',
	'#9d4edd',
	'#3a86ff',
	'#ff006e',
	'#00f7ff',
]

export default function DemoPage() {
	const [refreshInterval, setRefreshInterval] = useState(1000)

	const { dashboard, loading: dashboardLoading } =
		useSimulatedDashboard(refreshInterval)
	const { devices, loading: devicesLoading } =
		useSimulatedDevices(refreshInterval)
	const { alerts, loading: alertsLoading } = useSimulatedAlerts(refreshInterval)

	const handleReset = async () => {
		await resetSimulation()
	}

	// Preparar datos para gráficas
	const deviceTypeData = useMemo(() => {
		if (!devices) return []
		const typeCounts: Record<string, number> = {}
		devices.forEach((device) => {
			typeCounts[device.type] = (typeCounts[device.type] || 0) + 1
		})
		return Object.entries(typeCounts).map(([name, value], idx) => ({
			name,
			value,
			color: COLORS[idx % COLORS.length],
		}))
	}, [devices])

	const deviceStatusData = useMemo(() => {
		if (!devices) return []
		const statusCounts: Record<string, number> = {}
		devices.forEach((device) => {
			statusCounts[device.status] = (statusCounts[device.status] || 0) + 1
		})
		return Object.entries(statusCounts).map(([name, value]) => ({
			name,
			value,
		}))
	}, [devices])

	const protocolData = useMemo(() => {
		if (!devices) return []
		const protocolCounts: Record<string, number> = {}
		devices.forEach((device) => {
			protocolCounts[device.protocol] = (protocolCounts[device.protocol] || 0) + 1
		})
		return Object.entries(protocolCounts).map(([name, value]) => ({
			name,
			value,
		}))
	}, [devices])

	const activeAlerts = useMemo(() => {
		if (!alerts) return []
		return alerts.filter((a) => !a.resolved)
	}, [alerts])

	const criticalAlerts = useMemo(() => {
		if (!activeAlerts) return []
		return activeAlerts.filter((a) => a.severity === 'Crítico')
	}, [activeAlerts])

	if (dashboardLoading || devicesLoading || alertsLoading) {
		return (
			<div className="container mx-auto p-8 space-y-8">
				<motion.div
					className="flex items-center justify-center py-12"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<p className="text-cyan-300 text-lg">Cargando simulación...</p>
				</motion.div>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-8 space-y-8">
			{/* Header */}
			<motion.div
				className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-black via-purple-950/20 to-black p-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(183,0,255,0.1),transparent)]" />
				<div className="relative flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-purple-200 to-pink-300 bg-clip-text text-transparent mb-3">
							🚀 Demo de Simulación IoT
						</h1>
						<p className="text-purple-100/70 text-lg">
							Datos aleatorios generados cada segundo en tiempo real
						</p>
					</div>
					<div className="flex gap-3">
						<Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/50">
							<Zap className="w-3 h-3 mr-1" />
							Simulación Activa
						</Badge>
						<Button
							onClick={handleReset}
							variant="outline"
							className="border-purple-500/50 hover:bg-purple-500/20"
						>
							🔄 Reiniciar
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Controls */}
			<motion.div
				className="flex gap-4 items-center justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.1 }}
			>
				<span className="text-purple-300">Actualización:</span>
				{[500, 1000, 2000, 5000].map((interval) => (
					<Button
						key={interval}
						onClick={() => setRefreshInterval(interval)}
						variant={refreshInterval === interval ? 'default' : 'outline'}
						size="sm"
						className={
							refreshInterval === interval
								? 'bg-purple-600 hover:bg-purple-700'
								: 'border-purple-500/30'
						}
					>
						{interval}ms
					</Button>
				))}
			</motion.div>

			{/* Stats Cards */}
			<motion.div
				className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<Card className="border-purple-500/20 bg-gradient-to-br from-black via-purple-950/10 to-black">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2">
							<Router className="w-4 h-4" />
							Dispositivos Totales
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-white">
							{dashboard?.data?.totalDevices || 0}
						</div>
						<p className="text-xs text-purple-300/70 mt-1">
							{dashboard?.data?.activeDevices || 0} activos
						</p>
					</CardContent>
				</Card>

				<Card className="border-cyan-500/20 bg-gradient-to-br from-black via-cyan-950/10 to-black">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-cyan-300 flex items-center gap-2">
							<Activity className="w-4 h-4" />
							Dispositivos Activos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-white">
							{dashboard?.data?.activeDevices || 0}
						</div>
						<p className="text-xs text-cyan-300/70 mt-1">
							{dashboard?.data?.totalDevices > 0
								? (
										(dashboard.data.activeDevices /
											dashboard.data.totalDevices) *
										100
								  ).toFixed(1)
								: 0}
							% del total
						</p>
					</CardContent>
				</Card>

				<Card className="border-orange-500/20 bg-gradient-to-br from-black via-orange-950/10 to-black">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-orange-300 flex items-center gap-2">
							<AlertTriangle className="w-4 h-4" />
							Alertas Activas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-white">
							{dashboard?.data?.activeAlerts || 0}
						</div>
						<p className="text-xs text-orange-300/70 mt-1">
							{dashboard?.data?.criticalAlerts || 0} críticas
						</p>
					</CardContent>
				</Card>

				<Card className="border-pink-500/20 bg-gradient-to-br from-black via-pink-950/10 to-black">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-pink-300 flex items-center gap-2">
							<Network className="w-4 h-4" />
							Tipos de Dispositivos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-white">
							{dashboard?.data?.deviceTypes || 0}
						</div>
						<p className="text-xs text-pink-300/70 mt-1">Diferentes tipos</p>
					</CardContent>
				</Card>
			</motion.div>

			{/* Charts Row 1 */}
			<motion.div
				className="grid gap-6 lg:grid-cols-2"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				{/* Device Types */}
				<Card className="border-purple-500/20 bg-black/30">
					<CardHeader>
						<CardTitle className="text-purple-300 flex items-center gap-2">
							<Server className="w-5 h-5" />
							Distribución por Tipo
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={deviceTypeData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									paddingAngle={2}
									dataKey="value"
									stroke="#0a0a0f"
									strokeWidth={2}
								>
									{deviceTypeData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: '#1a1a2e',
										border: '2px solid #b700ff',
										borderRadius: '12px',
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="mt-4 space-y-2">
							{deviceTypeData.slice(0, 6).map((item) => (
								<div key={item.name} className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: item.color }}
										/>
										<span className="text-sm text-purple-200">{item.name}</span>
									</div>
									<span className="text-sm font-semibold text-purple-300">
										{item.value}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Device Status */}
				<Card className="border-cyan-500/20 bg-black/30">
					<CardHeader>
						<CardTitle className="text-cyan-300 flex items-center gap-2">
							<Shield className="w-5 h-5" />
							Estado de Dispositivos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={deviceStatusData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1a472a" />
								<XAxis
									dataKey="name"
									stroke="#00d4ff"
									tick={{ fill: '#00d4ff', fontSize: 12 }}
								/>
								<YAxis
									stroke="#00d4ff"
									tick={{ fill: '#00d4ff', fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#0a0e27',
										border: '1px solid #00d4ff',
										borderRadius: '8px',
									}}
								/>
								<Bar dataKey="value" fill="#00d4ff" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</motion.div>

			{/* Charts Row 2 */}
			<motion.div
				className="grid gap-6 lg:grid-cols-3"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				{/* Protocols */}
				<Card className="border-green-500/20 bg-black/30">
					<CardHeader>
						<CardTitle className="text-green-300 flex items-center gap-2">
							<Wifi className="w-5 h-5" />
							Protocolos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{protocolData.map((protocol, idx) => (
								<div key={protocol.name} className="space-y-1">
									<div className="flex justify-between text-sm">
										<span className="text-green-200">{protocol.name}</span>
										<span className="text-green-300 font-semibold">
											{protocol.value}
										</span>
									</div>
									<div className="h-2 bg-green-950/30 rounded-full overflow-hidden">
										<motion.div
											className="h-full rounded-full"
											style={{
												backgroundColor: COLORS[idx % COLORS.length],
											}}
											initial={{ width: 0 }}
											animate={{
												width: `${(protocol.value / devices.length) * 100}%`,
											}}
											transition={{ duration: 0.5 }}
										/>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* System Metrics */}
				<Card className="border-blue-500/20 bg-black/30">
					<CardHeader>
						<CardTitle className="text-blue-300 flex items-center gap-2">
							<Cpu className="w-5 h-5" />
							Métricas del Sistema
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-blue-200">CPU Promedio</span>
								<span className="text-blue-300 font-semibold">
									{dashboard?.data?.avgCpu?.toFixed(1)}%
								</span>
							</div>
							<div className="h-2 bg-blue-950/30 rounded-full overflow-hidden">
								<motion.div
									className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
									initial={{ width: 0 }}
									animate={{ width: `${dashboard?.data?.avgCpu || 0}%` }}
									transition={{ duration: 0.5 }}
								/>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-blue-200">Memoria Promedio</span>
								<span className="text-blue-300 font-semibold">
									{dashboard?.data?.avgMemory?.toFixed(1)}%
								</span>
							</div>
							<div className="h-2 bg-blue-950/30 rounded-full overflow-hidden">
								<motion.div
									className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
									initial={{ width: 0 }}
									animate={{ width: `${dashboard?.data?.avgMemory || 0}%` }}
									transition={{ duration: 0.5 }}
								/>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-blue-200">Temperatura Promedio</span>
								<span className="text-blue-300 font-semibold">
									{dashboard?.data?.avgTemperature?.toFixed(1)}°C
								</span>
							</div>
							<div className="h-2 bg-blue-950/30 rounded-full overflow-hidden">
								<motion.div
									className="h-full bg-gradient-to-r from-orange-600 to-red-400 rounded-full"
									initial={{ width: 0 }}
									animate={{
										width: `${((dashboard?.data?.avgTemperature || 0) / 100) * 100}%`,
									}}
									transition={{ duration: 0.5 }}
								/>
							</div>
						</div>

						<div className="pt-2 border-t border-blue-500/20">
							<div className="flex justify-between text-sm">
								<span className="text-blue-200">Uptime</span>
								<span className="text-blue-300 font-semibold">
									{dashboard?.data?.uptime?.toFixed(2)}%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Network Stats */}
				<Card className="border-yellow-500/20 bg-black/30">
					<CardHeader>
						<CardTitle className="text-yellow-300 flex items-center gap-2">
							<Database className="w-5 h-5" />
							Red
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/20">
							<div className="flex items-center gap-3">
								<HardDrive className="w-5 h-5 text-yellow-400" />
								<div>
									<p className="text-xs text-yellow-200/70">Tráfico Total</p>
									<p className="text-lg font-bold text-yellow-300">
										{((dashboard?.data?.totalTraffic || 0) / 1024).toFixed(2)} MB
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/20">
							<div className="flex items-center gap-3">
								<Activity className="w-5 h-5 text-yellow-400" />
								<div>
									<p className="text-xs text-yellow-200/70">Latencia</p>
									<p className="text-lg font-bold text-yellow-300">
										{dashboard?.data?.networkLatency?.toFixed(2)} ms
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/20">
							<div className="flex items-center gap-3">
								<Power className="w-5 h-5 text-yellow-400" />
								<div>
									<p className="text-xs text-yellow-200/70">
										Dispositivos Inactivos
									</p>
									<p className="text-lg font-bold text-yellow-300">
										{dashboard?.data?.inactiveDevices || 0}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Alerts */}
			<motion.div
				className="grid gap-6 lg:grid-cols-2"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				{/* Active Alerts */}
				<Card className="border-red-500/20 bg-black/30">
					<CardHeader>
						<CardTitle className="text-red-300 flex items-center gap-2">
							<AlertTriangle className="w-5 h-5" />
							Alertas Activas ({activeAlerts.length})
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 max-h-96 overflow-y-auto">
						{activeAlerts.slice(0, 10).map((alert) => (
							<div
								key={alert.id}
								className="p-3 rounded-lg bg-red-950/30 border border-red-500/30"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex items-start gap-2">
										<Badge
											variant="destructive"
											className={`text-xs ${
												alert.severity === 'Crítico'
													? 'bg-red-500/20 text-red-300 border-red-500/50'
													: alert.severity === 'Alto'
													? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
													: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
											}`}
										>
											{alert.severity}
										</Badge>
										<Badge variant="outline" className="text-xs">
											{alert.type}
										</Badge>
									</div>
								</div>
								<h4 className="text-sm font-semibold text-red-200 mb-1">
									{alert.title}
								</h4>
								<p className="text-xs text-red-100/70 mb-2">{alert.message}</p>
								<div className="flex items-center justify-between text-xs text-red-300/60">
									<span>{alert.device}</span>
									<span>{alert.protocol}</span>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Recent Devices */}
				<Card className="border-purple-500/20 bg-black/30">
					<CardHeader>
						<CardTitle className="text-purple-300 flex items-center gap-2">
							<Router className="w-5 h-5" />
							Dispositivos Recientes
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 max-h-96 overflow-y-auto">
						{devices
							.sort((a, b) => b.lastActivityRaw - a.lastActivityRaw)
							.slice(0, 10)
							.map((device) => (
								<div
									key={device.id}
									className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30"
								>
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center gap-2">
											<Badge
												className={`text-xs ${
													device.status === 'active'
														? 'bg-green-500/20 text-green-300 border-green-500/50'
														: device.status === 'inactive'
														? 'bg-gray-500/20 text-gray-300 border-gray-500/50'
														: device.status === 'suspicious'
														? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
														: 'bg-red-500/20 text-red-300 border-red-500/50'
												}`}
											>
												{device.status}
											</Badge>
											<Badge variant="outline" className="text-xs">
												{device.protocol}
											</Badge>
										</div>
									</div>
									<h4 className="text-sm font-semibold text-purple-200 mb-1">
										{device.type}
									</h4>
									<div className="grid grid-cols-2 gap-2 text-xs text-purple-100/70">
										<div>IP: {device.ip}</div>
										<div>MAC: {device.mac.substring(0, 11)}...</div>
										<div>CPU: {device.cpu.toFixed(1)}%</div>
										<div>Temp: {device.temperature.toFixed(1)}°C</div>
									</div>
									<p className="text-xs text-purple-300/60 mt-2">
										Última actividad: {device.lastActivity}
									</p>
								</div>
							))}
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}
