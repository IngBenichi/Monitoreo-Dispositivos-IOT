'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import {
	Activity,
	Thermometer,
	Droplet,
	Gauge,
	Battery,
	Signal,
	Cpu,
	HardDrive,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	LineChart,
	Line,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { useSimulatedTelemetry, useSimulatedDevices } from '@/hooks/use-simulation'

export default function TelemetryDemoPage() {
	const { devices, loading: devicesLoading } = useSimulatedDevices(1000)
	const firstDeviceId = devices && devices.length > 0 ? devices[0].id : undefined

	const { telemetry, loading: telemetryLoading } = useSimulatedTelemetry(
		firstDeviceId,
		1000
	)

	const currentData = useMemo(() => {
		if (!telemetry || typeof telemetry !== 'object' || !('current' in telemetry)) {
			return null
		}
		return telemetry.current
	}, [telemetry])

	const historyData = useMemo(() => {
		if (!telemetry || typeof telemetry !== 'object' || !('history' in telemetry)) {
			return []
		}
		// Tomar los últimos 30 puntos
		const history = telemetry.history as Array<{
			timestamp: number
			time: string
			[key: string]: any
		}>
		return history.slice(-30)
	}, [telemetry])

	if (devicesLoading || telemetryLoading) {
		return (
			<div className="container mx-auto p-8 space-y-8">
				<motion.div
					className="flex items-center justify-center py-12"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<p className="text-cyan-300 text-lg">Cargando telemetría...</p>
				</motion.div>
			</div>
		)
	}

	if (!devices || devices.length === 0) {
		return (
			<div className="container mx-auto p-8">
				<p className="text-red-300">No hay dispositivos disponibles</p>
			</div>
		)
	}

	const device = devices[0]

	return (
		<div className="container mx-auto p-8 space-y-8">
			{/* Header */}
			<motion.div
				className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black via-cyan-950/20 to-black p-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,212,255,0.1),transparent)]" />
				<div className="relative">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-3">
						📊 Demo de Telemetría en Tiempo Real
					</h1>
					<p className="text-cyan-100/70 text-lg mb-2">
						Monitoreo de {device.type} ({device.ip})
					</p>
					<p className="text-cyan-300/60 text-sm">
						Datos actualizados cada segundo
					</p>
				</div>
			</motion.div>

			{/* Current Values */}
			{currentData && (
				<motion.div
					className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					{currentData.temperature !== undefined && (
						<Card className="border-orange-500/20 bg-gradient-to-br from-black via-orange-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-orange-300 flex items-center gap-2">
									<Thermometer className="w-4 h-4" />
									Temperatura
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.temperature}
									initial={{ scale: 1.1, color: '#ff6b35' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.temperature.toFixed(1)}°C
								</motion.div>
							</CardContent>
						</Card>
					)}

					{currentData.humidity !== undefined && (
						<Card className="border-blue-500/20 bg-gradient-to-br from-black via-blue-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-blue-300 flex items-center gap-2">
									<Droplet className="w-4 h-4" />
									Humedad
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.humidity}
									initial={{ scale: 1.1, color: '#4da6ff' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.humidity.toFixed(1)}%
								</motion.div>
							</CardContent>
						</Card>
					)}

					{currentData.cpu !== undefined && (
						<Card className="border-purple-500/20 bg-gradient-to-br from-black via-purple-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2">
									<Cpu className="w-4 h-4" />
									CPU
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.cpu}
									initial={{ scale: 1.1, color: '#b700ff' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.cpu.toFixed(1)}%
								</motion.div>
							</CardContent>
						</Card>
					)}

					{currentData.memory !== undefined && (
						<Card className="border-pink-500/20 bg-gradient-to-br from-black via-pink-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-pink-300 flex items-center gap-2">
									<HardDrive className="w-4 h-4" />
									Memoria
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.memory}
									initial={{ scale: 1.1, color: '#ff006e' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.memory.toFixed(1)}%
								</motion.div>
							</CardContent>
						</Card>
					)}

					{currentData.pressure !== undefined && (
						<Card className="border-green-500/20 bg-gradient-to-br from-black via-green-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-green-300 flex items-center gap-2">
									<Gauge className="w-4 h-4" />
									Presión
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.pressure}
									initial={{ scale: 1.1, color: '#00f081' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.pressure.toFixed(1)} hPa
								</motion.div>
							</CardContent>
						</Card>
					)}

					{currentData.battery !== undefined && (
						<Card className="border-yellow-500/20 bg-gradient-to-br from-black via-yellow-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-yellow-300 flex items-center gap-2">
									<Battery className="w-4 h-4" />
									Batería
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.battery}
									initial={{ scale: 1.1, color: '#ffb703' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.battery.toFixed(1)}%
								</motion.div>
							</CardContent>
						</Card>
					)}

					{currentData.signalStrength !== undefined && (
						<Card className="border-cyan-500/20 bg-gradient-to-br from-black via-cyan-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-cyan-300 flex items-center gap-2">
									<Signal className="w-4 h-4" />
									Señal
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.signalStrength}
									initial={{ scale: 1.1, color: '#00d4ff' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.signalStrength} dBm
								</motion.div>
							</CardContent>
						</Card>
					)}

					{currentData.latency !== undefined && (
						<Card className="border-red-500/20 bg-gradient-to-br from-black via-red-950/10 to-black">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-red-300 flex items-center gap-2">
									<Activity className="w-4 h-4" />
									Latencia
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									className="text-3xl font-bold text-white"
									key={currentData.latency}
									initial={{ scale: 1.1, color: '#ff006e' }}
									animate={{ scale: 1, color: '#ffffff' }}
									transition={{ duration: 0.3 }}
								>
									{currentData.latency.toFixed(2)} ms
								</motion.div>
							</CardContent>
						</Card>
					)}
				</motion.div>
			)}

			{/* Historical Charts */}
			{historyData.length > 0 && (
				<>
					{/* Temperature & Humidity */}
					<motion.div
						className="rounded-2xl border border-cyan-500/20 bg-black/30 p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<h3 className="text-lg font-semibold text-cyan-300 mb-4">
							Temperatura y Humedad
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={historyData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1a472a" />
								<XAxis
									dataKey="time"
									stroke="#00d4ff"
									tick={{ fill: '#00d4ff', fontSize: 10 }}
									interval={Math.floor(historyData.length / 6)}
								/>
								<YAxis
									yAxisId="left"
									stroke="#ff6b35"
									tick={{ fill: '#ff6b35', fontSize: 12 }}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									stroke="#4da6ff"
									tick={{ fill: '#4da6ff', fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#0a0e27',
										border: '1px solid #00d4ff',
										borderRadius: '8px',
									}}
								/>
								<Line
									yAxisId="left"
									type="monotone"
									dataKey="temperature"
									stroke="#ff6b35"
									strokeWidth={2}
									dot={false}
									isAnimationActive={false}
								/>
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="humidity"
									stroke="#4da6ff"
									strokeWidth={2}
									dot={false}
									isAnimationActive={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</motion.div>

					{/* CPU & Memory */}
					<motion.div
						className="rounded-2xl border border-purple-500/20 bg-black/30 p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<h3 className="text-lg font-semibold text-purple-300 mb-4">
							CPU y Memoria
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={historyData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1a472a" />
								<XAxis
									dataKey="time"
									stroke="#b700ff"
									tick={{ fill: '#b700ff', fontSize: 10 }}
									interval={Math.floor(historyData.length / 6)}
								/>
								<YAxis
									stroke="#b700ff"
									tick={{ fill: '#b700ff', fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#0a0e27',
										border: '1px solid #b700ff',
										borderRadius: '8px',
									}}
								/>
								<Area
									type="monotone"
									dataKey="cpu"
									stroke="#b700ff"
									fill="#b700ff"
									fillOpacity={0.2}
									strokeWidth={2}
									isAnimationActive={false}
								/>
								<Area
									type="monotone"
									dataKey="memory"
									stroke="#ff006e"
									fill="#ff006e"
									fillOpacity={0.2}
									strokeWidth={2}
									isAnimationActive={false}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</motion.div>

					{/* Network Metrics */}
					<motion.div
						className="rounded-2xl border border-green-500/20 bg-black/30 p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<h3 className="text-lg font-semibold text-green-300 mb-4">
							Métricas de Red
						</h3>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={historyData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1a472a" />
								<XAxis
									dataKey="time"
									stroke="#00f081"
									tick={{ fill: '#00f081', fontSize: 10 }}
									interval={Math.floor(historyData.length / 6)}
								/>
								<YAxis
									stroke="#00f081"
									tick={{ fill: '#00f081', fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#0a0e27',
										border: '1px solid #00f081',
										borderRadius: '8px',
									}}
								/>
								<Line
									type="monotone"
									dataKey="latency"
									stroke="#00f081"
									strokeWidth={2}
									dot={false}
									isAnimationActive={false}
								/>
								<Line
									type="monotone"
									dataKey="traffic"
									stroke="#ffb703"
									strokeWidth={2}
									dot={false}
									isAnimationActive={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</motion.div>
				</>
			)}
		</div>
	)
}
