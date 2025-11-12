import { useState, useEffect, useCallback } from 'react'

export interface SimulatedDevice {
	id: number
	mac: string
	ip: string
	type: string
	status: string
	lastActivity: string
	lastActivityRaw: number
	protocol: string
	cpu: number
	memory: number
	uptime: number
	temperature: number
	signalStrength: number
}

export interface SimulatedTelemetry {
	current: any
	history: Array<{
		timestamp: number
		time: string
		[key: string]: any
	}>
}

export interface SimulatedAlert {
	id: number
	type: string
	severity: string
	title: string
	message: string
	timestamp: string
	device: string
	protocol: string
	resolved: boolean
	details: string
}

export interface DashboardStats {
	totalDevices: number
	activeDevices: number
	inactiveDevices: number
	deviceTypes: number
	activeAlerts: number
	criticalAlerts: number
	avgTemperature: number
	avgCpu: number
	avgMemory: number
	totalTraffic: number
	networkLatency: number
	uptime: number
}

export interface SimulationData {
	devices: SimulatedDevice[]
	telemetry: Record<string, SimulatedTelemetry>
	alerts: SimulatedAlert[]
	dashboard: DashboardStats
}

// Hook para obtener todos los datos de simulación
export function useSimulation(refreshInterval: number = 1000) {
	const [data, setData] = useState<SimulationData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchData = useCallback(async () => {
		try {
			const response = await fetch('/api/simulate?module=all')
			if (!response.ok) {
				throw new Error('Failed to fetch simulation data')
			}
			const result = await response.json()
			if (result.success) {
				setData(result.data)
				setError(null)
			}
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchData()

		const interval = setInterval(fetchData, refreshInterval)

		return () => clearInterval(interval)
	}, [fetchData, refreshInterval])

	return { data, loading, error, refetch: fetchData }
}

// Hook para obtener solo dispositivos
export function useSimulatedDevices(refreshInterval: number = 1000) {
	const [devices, setDevices] = useState<SimulatedDevice[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchDevices = useCallback(async () => {
		try {
			const response = await fetch('/api/simulate?module=devices')
			if (!response.ok) {
				throw new Error('Failed to fetch devices')
			}
			const result = await response.json()
			if (result.success) {
				setDevices(result.data)
				setError(null)
			}
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchDevices()

		const interval = setInterval(fetchDevices, refreshInterval)

		return () => clearInterval(interval)
	}, [fetchDevices, refreshInterval])

	return { devices, loading, error, refetch: fetchDevices }
}

// Hook para obtener telemetría
export function useSimulatedTelemetry(
	deviceId?: number,
	refreshInterval: number = 1000
) {
	const [telemetry, setTelemetry] = useState<
		Record<string, SimulatedTelemetry> | SimulatedTelemetry | null
	>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchTelemetry = useCallback(async () => {
		try {
			const url = deviceId
				? `/api/simulate?module=telemetry&deviceId=${deviceId}`
				: '/api/simulate?module=telemetry'
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error('Failed to fetch telemetry')
			}
			const result = await response.json()
			if (result.success) {
				setTelemetry(result.data)
				setError(null)
			}
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceId])

	useEffect(() => {
		fetchTelemetry()

		const interval = setInterval(fetchTelemetry, refreshInterval)

		return () => clearInterval(interval)
	}, [fetchTelemetry, refreshInterval])

	return { telemetry, loading, error, refetch: fetchTelemetry }
}

// Hook para obtener alertas
export function useSimulatedAlerts(refreshInterval: number = 1000) {
	const [alerts, setAlerts] = useState<SimulatedAlert[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchAlerts = useCallback(async () => {
		try {
			const response = await fetch('/api/simulate?module=alerts')
			if (!response.ok) {
				throw new Error('Failed to fetch alerts')
			}
			const result = await response.json()
			if (result.success) {
				setAlerts(result.data)
				setError(null)
			}
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchAlerts()

		const interval = setInterval(fetchAlerts, refreshInterval)

		return () => clearInterval(interval)
	}, [fetchAlerts, refreshInterval])

	return { alerts, loading, error, refetch: fetchAlerts }
}

// Hook para obtener estadísticas del dashboard
export function useSimulatedDashboard(refreshInterval: number = 1000) {
	const [dashboard, setDashboard] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchDashboard = useCallback(async () => {
		try {
			const response = await fetch('/api/simulate?module=dashboard')
			if (!response.ok) {
				throw new Error('Failed to fetch dashboard data')
			}
			const result = await response.json()
			if (result.success) {
				setDashboard(result.data)
				setError(null)
			}
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchDashboard()

		const interval = setInterval(fetchDashboard, refreshInterval)

		return () => clearInterval(interval)
	}, [fetchDashboard, refreshInterval])

	return { dashboard, loading, error, refetch: fetchDashboard }
}

// Funciones de control de simulación
export async function startSimulation() {
	const response = await fetch('/api/simulate', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ action: 'start' }),
	})
	return response.json()
}

export async function stopSimulation() {
	const response = await fetch('/api/simulate', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ action: 'stop' }),
	})
	return response.json()
}

export async function resetSimulation() {
	const response = await fetch('/api/simulate', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ action: 'reset' }),
	})
	return response.json()
}
