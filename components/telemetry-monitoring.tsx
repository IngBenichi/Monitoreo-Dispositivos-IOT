'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
	Activity,
	TrendingUp,
	TrendingDown,
	Minus,
	RefreshCw,
	Play,
	Pause,
	AlertCircle,
	Zap,
	Gauge,
	LineChart,
	BarChart3,
} from 'lucide-react'
import {
	LineChart as RechartsLine,
	Line,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	useSimulatedDevices,
	useSimulatedTelemetry,
	type SimulatedDevice,
} from '@/hooks/use-simulation'

const CHART_COLORS = [
	'#00d4ff', // Cyan
	'#ff006e', // Pink
	'#00f081', // Green
	'#ffb703', // Orange
	'#9d4edd', // Purple
	'#3a86ff', // Blue
]

const TELEMETRY_KEYS = [
	'temperature',
	'humidity',
	'cpu',
	'memory',
	'pressure',
	'speed',
]

export function TelemetryMonitoring() {
	// Datos simulados - actualiza cada 1 segundo
	const { devices, loading: devicesLoading } = useSimulatedDevices(1000)
	const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
	const [selectedKeys, setSelectedKeys] = useState<string[]>([
		'temperature',
		'cpu',
		'memory',
	])
	const [isRealTime, setIsRealTime] = useState(true)

	// Obtener telemetría del dispositivo seleccionado
	const { telemetry, loading: telemetryLoading, refetch } =
		useSimulatedTelemetry(
			selectedDeviceId || undefined,
			isRealTime ? 1000 : 0
		)

	// Auto-seleccionar primer dispositivo
	useEffect(() => {
		if (devices && devices.length > 0 && !selectedDeviceId) {
			setSelectedDeviceId(devices[0].id)
		}
	}, [devices, selectedDeviceId])

	// Estados
	const loading = devicesLoading || telemetryLoading
	const selectedDevice = selectedDeviceId
		? devices?.find((d) => d.id === selectedDeviceId)
		: null

	// Preparar datos para gráficos
	const chartData = useMemo(() => {
		if (
			!telemetry ||
			typeof telemetry !== 'object' ||
			!('history' in telemetry)
		)
			return []
		return (telemetry as any).history || []
	}, [telemetry])

	// Preparar estadísticas de telemetría actual
	const currentTelemetry = useMemo(() => {
		if (
			!telemetry ||
			typeof telemetry !== 'object' ||
			!('current' in telemetry)
		)
			return null
		return (telemetry as any).current
	}, [telemetry])

	// Calcular tendencias
	const calculateTrend = (key: string): 'up' | 'down' | 'stable' => {
		if (!chartData || chartData.length < 2) return 'stable'
		const recent = chartData.slice(-5).map((d: any) => d[key] || 0)
		const avg = recent.reduce((a: number, b: number) => a + b, 0) / recent.length
		const last = recent[recent.length - 1] || 0
		const diff = Math.abs(last - avg)
		if (diff < 1) return 'stable'
		return last > avg ? 'up' : 'down'
	}

	// Calcular estadísticas
	const calculateStats = (key: string) => {
		if (!chartData || chartData.length === 0) return null
		const values = chartData.map((d: any) => d[key] || 0).filter(Boolean)
		if (values.length === 0) return null

		const min = Math.min(...values)
		const max = Math.max(...values)
		const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length
		const current = currentTelemetry?.[key] || values[values.length - 1] || 0

		return {
			current: current.toFixed(1),
			avg: avg.toFixed(1),
			min: min.toFixed(1),
			max: max.toFixed(1),
			trend: calculateTrend(key),
			count: values.length,
		}
	}

	// Toggle key selection
	const toggleKey = (key: string) => {
		setSelectedKeys((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		)
	}

	// Loading states
	if (devicesLoading && !devices) {
		return (
			<div className="space-y-8">
				<motion.div
					className="flex items-center justify-center py-12"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<p className="text-cyan-300 text-lg">Cargando dispositivos...</p>
				</motion.div>
			</div>
		)
	}

	if (devices && devices.length === 0) {
		return (
			<div className="space-y-8">
				<div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black via-cyan-950/20 to-black p-8">
					<div className="flex items-center gap-3 text-cyan-300 mb-3">
						<AlertCircle className="w-6 h-6" />
						<h2 className="text-xl font-bold">Sin dispositivos</h2>
					</div>
					<p className="text-cyan-100/70">
						No hay dispositivos disponibles. Crea uno primero en la sección de
						Dispositivos.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<motion.div
				className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black via-cyan-950/20 to-black p-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,212,255,0.1),transparent)]" />
				<div className="relative flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-3">
							Monitoreo de Telemetría
						</h1>
						<p className="text-cyan-100/70 text-lg">
							Visualización en tiempo real de datos de dispositivos IoT (Simulación)
						</p>
					</div>
					<Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/50">
						<Zap className="w-3 h-3 mr-1" />
						Actualización cada 1s
					</Badge>
				</div>
			</motion.div>

			{/* Controls */}
			<motion.div
				className="grid gap-4 lg:grid-cols-3"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				{/* Device Selector */}
				<Card className="border-cyan-500/20 bg-card">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-cyan-300">
							Dispositivo
						</CardTitle>
					</CardHeader>
					<CardContent>
						<select
							value={selectedDeviceId || ''}
							onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
							className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-cyan-300 text-sm focus:outline-none focus:border-cyan-500"
						>
							<option value="">Selecciona dispositivo</option>
							{devices?.map((device: SimulatedDevice) => (
								<option key={device.id} value={device.id}>
									{device.type} ({device.ip})
								</option>
							))}
						</select>
					</CardContent>
				</Card>

				{/* Real-time Toggle */}
				<Card className="border-cyan-500/20 bg-card">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-cyan-300">
							En tiempo real
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => setIsRealTime(!isRealTime)}
							className={`w-full ${
								isRealTime
									? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
									: 'bg-gray-700 hover:bg-gray-600'
							}`}
						>
							{isRealTime ? (
								<>
									<Play className="w-4 h-4 mr-2" />
									Activo
								</>
							) : (
								<>
									<Pause className="w-4 h-4 mr-2" />
									Pausado
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				{/* Refresh */}
				<Card className="border-cyan-500/20 bg-card">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-cyan-300">
							Acciones
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => refetch()}
							disabled={loading}
							className="w-full bg-purple-600 hover:bg-purple-700"
						>
							<RefreshCw className="w-4 h-4 mr-2" />
							Actualizar
						</Button>
					</CardContent>
				</Card>
			</motion.div>

			{/* Key Selector */}
			<motion.div
				className="rounded-2xl border border-cyan-500/20 bg-black/30 p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
					<Gauge className="w-5 h-5" />
					Selecciona los datos a monitorear
				</h3>
				<div className="flex flex-wrap gap-2">
					{TELEMETRY_KEYS.map((key) => (
						<motion.div
							key={key}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Badge
								onClick={() => toggleKey(key)}
								className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
									selectedKeys.includes(key)
										? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
										: 'bg-gray-800 text-gray-400 hover:bg-gray-700'
								}`}
							>
								{key}
							</Badge>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Stats Cards */}
			{selectedKeys.length > 0 && chartData.length > 0 && (
				<motion.div
					className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					{selectedKeys.map((key, idx) => {
						const stats = calculateStats(key)
						if (!stats) return null

						const color = CHART_COLORS[idx % CHART_COLORS.length]
						const Icon =
							stats.trend === 'up'
								? TrendingUp
								: stats.trend === 'down'
								? TrendingDown
								: Minus

						return (
							<Card
								key={key}
								className="border-cyan-500/20 bg-gradient-to-br from-black via-cyan-950/10 to-black"
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-sm font-medium text-cyan-300">
												{key}
											</CardTitle>
											<p className="text-xs text-cyan-100/50 mt-1">
												{stats.count} puntos
											</p>
										</div>
										<Icon
											className={`w-5 h-5 ${
												stats.trend === 'up'
													? 'text-green-400'
													: stats.trend === 'down'
													? 'text-red-400'
													: 'text-gray-400'
											}`}
										/>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="grid grid-cols-2 gap-3">
										<div>
											<p className="text-xs text-cyan-100/50">Actual</p>
											<motion.p
												className="text-xl font-bold"
												style={{ color }}
												key={stats.current}
												initial={{ scale: 1.2 }}
												animate={{ scale: 1 }}
												transition={{ duration: 0.3 }}
											>
												{stats.current}
											</motion.p>
										</div>
										<div>
											<p className="text-xs text-cyan-100/50">Promedio</p>
											<p className="text-xl font-bold text-cyan-300">
												{stats.avg}
											</p>
										</div>
										<div>
											<p className="text-xs text-cyan-100/50">Mínimo</p>
											<p className="text-lg font-semibold text-blue-300">
												{stats.min}
											</p>
										</div>
										<div>
											<p className="text-xs text-cyan-100/50">Máximo</p>
											<p className="text-lg font-semibold text-cyan-300">
												{stats.max}
											</p>
										</div>
									</div>
									{stats.trend !== 'stable' && (
										<div className="text-xs text-cyan-100/70 pt-2 border-t border-cyan-500/20">
											Tendencia:{' '}
											<span
												className={
													stats.trend === 'up'
														? 'text-green-400'
														: 'text-red-400'
												}
											>
												{stats.trend === 'up' ? 'Subida' : 'Bajada'}
											</span>
										</div>
									)}
								</CardContent>
							</Card>
						)
					})}
				</motion.div>
			)}

			{/* Charts */}
			{selectedKeys.length > 0 && chartData.length > 0 && (
				<>
					{/* Line Chart */}
					<motion.div
						className="rounded-2xl border border-cyan-500/20 bg-black/30 p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
							<LineChart className="w-5 h-5" />
							Tendencias Históricas
						</h3>
						<ResponsiveContainer width="100%" height={400}>
							<RechartsLine
								data={chartData}
								margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#1a472a" />
								<XAxis
									dataKey="time"
									stroke="#00d4ff"
									tick={{ fill: '#00d4ff', fontSize: 12 }}
									interval={Math.max(0, Math.floor(chartData.length / 10))}
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
									labelStyle={{ color: '#00d4ff' }}
									itemStyle={{ color: '#00d4ff' }}
								/>
								<Legend wrapperStyle={{ color: '#00d4ff' }} />
								{selectedKeys.map((key, idx) => (
									<Line
										key={key}
										type="monotone"
										dataKey={key}
										stroke={CHART_COLORS[idx % CHART_COLORS.length]}
										dot={false}
										strokeWidth={2}
									/>
								))}
							</RechartsLine>
						</ResponsiveContainer>
					</motion.div>

					{/* Area Chart */}
					<motion.div
						className="rounded-2xl border border-cyan-500/20 bg-black/30 p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
							<BarChart3 className="w-5 h-5" />
							Distribución de Valores
						</h3>
						<ResponsiveContainer width="100%" height={350}>
							<AreaChart
								data={chartData}
								margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#1a472a" />
								<XAxis
									dataKey="time"
									stroke="#00d4ff"
									tick={{ fill: '#00d4ff', fontSize: 12 }}
									interval={Math.max(0, Math.floor(chartData.length / 10))}
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
									labelStyle={{ color: '#00d4ff' }}
									itemStyle={{ color: '#00d4ff' }}
								/>
								{selectedKeys.map((key, idx) => (
									<Area
										key={key}
										type="monotone"
										dataKey={key}
										stroke={CHART_COLORS[idx % CHART_COLORS.length]}
										fill={CHART_COLORS[idx % CHART_COLORS.length]}
										fillOpacity={0.1}
									/>
								))}
							</AreaChart>
						</ResponsiveContainer>
					</motion.div>
				</>
			)}

			{/* Current Values */}
			{selectedKeys.length > 0 && currentTelemetry && (
				<motion.div
					className="rounded-2xl border border-cyan-500/20 bg-black/30 p-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
						<Activity className="w-5 h-5" />
						Valores Actuales - {selectedDevice?.type} ({selectedDevice?.ip})
					</h3>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{selectedKeys.map((key, idx) => {
							const value = currentTelemetry[key]
							if (value === undefined) return null

							return (
								<div
									key={key}
									className="p-4 rounded-lg border border-cyan-500/20 bg-black/50"
								>
									<p className="text-sm text-cyan-100/70 mb-2 capitalize">
										{key}
									</p>
									<motion.p
										className="text-2xl font-bold mb-1"
										style={{ color: CHART_COLORS[idx % CHART_COLORS.length] }}
										key={value}
										initial={{ scale: 1.3 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.3 }}
									>
										{typeof value === 'number' ? value.toFixed(1) : value}
									</motion.p>
									<p className="text-xs text-cyan-100/50">Actualizado ahora</p>
								</div>
							)
						})}
					</div>
				</motion.div>
			)}
		</div>
	)
}
