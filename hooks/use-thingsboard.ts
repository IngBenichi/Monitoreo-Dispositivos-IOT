/**
 * 🪝 ThingsBoard React Hooks - ADVANCED EDITION
 * Custom hooks para gestión completa de dispositivos IoT
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
	tbApi,
	Device,
	DeviceInfo,
	DeviceCredentials,
	TelemetryData,
	LatestTelemetry,
	AttributesResponse,
	Alarm,
	PageData,
	RPCRequest,
	RPCResponse,
} from '@/lib/thingsboard-api'

// ==================== BASE HOOK TYPES ====================

interface UseQueryResult<T> {
	data: T | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

interface UseMutationResult<T, V> {
	mutate: (variables: V) => Promise<T>
	data: T | null
	loading: boolean
	error: Error | null
	reset: () => void
}

// ==================== DEVICE HOOKS ====================

/**
 * 📱 Hook para obtener lista de dispositivos
 */
export function useDevices(pageSize: number = 100, page: number = 0) {
	const [data, setData] = useState<PageData<DeviceInfo> | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchDevices = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getDevices(pageSize, page)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [pageSize, page])

	useEffect(() => {
		fetchDevices()
	}, [fetchDevices])

	return { data, loading, error, refetch: fetchDevices }
}

/**
 * 🔍 Hook para obtener un dispositivo específico
 */
export function useDevice(deviceId: string | null): UseQueryResult<Device> {
	const [data, setData] = useState<Device | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchDevice = useCallback(async () => {
		if (!deviceId) {
			setData(null)
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getDevice(deviceId)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceId])

	useEffect(() => {
		fetchDevice()
	}, [fetchDevice])

	return { data, loading, error, refetch: fetchDevice }
}

/**
 * ➕ Hook para crear dispositivos
 */
export function useCreateDevice(): UseMutationResult<
	Device,
	{ name: string; type: string; label?: string; additionalInfo?: any }
> {
	const [data, setData] = useState<Device | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (variables: {
		name: string
		type: string
		label?: string
		additionalInfo?: any
	}) => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.createDevice(
				variables.name,
				variables.type,
				variables.label,
				variables.additionalInfo
			)
			setData(result)
			return result
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

/**
 * ✏️ Hook para actualizar dispositivos
 */
export function useUpdateDevice(): UseMutationResult<Device, Device> {
	const [data, setData] = useState<Device | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (device: Device) => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.updateDevice(device)
			setData(result)
			return result
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

/**
 * 🗑️ Hook para eliminar dispositivos
 */
export function useDeleteDevice(): UseMutationResult<void, string> {
	const [data, setData] = useState<void | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (deviceId: string) => {
		try {
			setLoading(true)
			setError(null)
			await tbApi.deleteDevice(deviceId)
			setData(undefined)
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

// ==================== CREDENTIALS HOOKS ====================

/**
 * 🔑 Hook para obtener credenciales del dispositivo
 */
export function useDeviceCredentials(
	deviceId: string | null
): UseQueryResult<DeviceCredentials> {
	const [data, setData] = useState<DeviceCredentials | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchCredentials = useCallback(async () => {
		if (!deviceId) {
			setData(null)
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getDeviceCredentials(deviceId)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceId])

	useEffect(() => {
		fetchCredentials()
	}, [fetchCredentials])

	return { data, loading, error, refetch: fetchCredentials }
}

/**
 * 🔐 Hook para actualizar credenciales
 */
export function useUpdateCredentials(): UseMutationResult<
	DeviceCredentials,
	DeviceCredentials
> {
	const [data, setData] = useState<DeviceCredentials | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (credentials: DeviceCredentials) => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.updateDeviceCredentials(credentials)
			setData(result)
			return result
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

// ==================== TELEMETRY HOOKS ====================

/**
 * 📊 Hook para obtener claves de telemetría
 */
export function useTelemetryKeys(
	deviceId: string | null
): UseQueryResult<string[]> {
	const [data, setData] = useState<string[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchKeys = useCallback(async () => {
		if (!deviceId) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getTelemetryKeys(deviceId)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceId])

	useEffect(() => {
		fetchKeys()
	}, [fetchKeys])

	return { data, loading, error, refetch: fetchKeys }
}

/**
 * 📈 Hook para obtener telemetría más reciente
 */
export function useLatestTelemetry(
	deviceId: string | null,
	keys?: string[]
): UseQueryResult<LatestTelemetry> {
	const [data, setData] = useState<LatestTelemetry | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchTelemetry = useCallback(async () => {
		if (!deviceId) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getLatestTelemetry(deviceId, keys)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceId, keys?.join(',')])

	useEffect(() => {
		fetchTelemetry()
	}, [fetchTelemetry])

	return { data, loading, error, refetch: fetchTelemetry }
}

/**
 * 📉 Hook para obtener telemetría histórica
 */
export function useHistoricalTelemetry(
	deviceId: string | null,
	keys: string[],
	startTs: number,
	endTs: number,
	options?: {
		interval?: number
		limit?: number
		agg?: 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT' | 'NONE'
	}
): UseQueryResult<TelemetryData> {
	const [data, setData] = useState<TelemetryData | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchTelemetry = useCallback(async () => {
		if (!deviceId || !keys.length) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getHistoricalTelemetry(
				deviceId,
				keys,
				startTs,
				endTs,
				options?.interval,
				options?.limit,
				options?.agg
			)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [
		deviceId,
		keys.join(','),
		startTs,
		endTs,
		options?.interval,
		options?.limit,
		options?.agg,
	])

	useEffect(() => {
		fetchTelemetry()
	}, [fetchTelemetry])

	return { data, loading, error, refetch: fetchTelemetry }
}

/**
 * 📤 Hook para enviar telemetría
 */
export function useSendTelemetry(): UseMutationResult<
	void,
	{
		accessToken: string
		telemetry: Record<string, any>
		timestamp?: number
	}
> {
	const [data, setData] = useState<void | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (variables: {
		accessToken: string
		telemetry: Record<string, any>
		timestamp?: number
	}) => {
		try {
			setLoading(true)
			setError(null)
			await tbApi.sendTelemetry(
				variables.accessToken,
				variables.telemetry,
				variables.timestamp
			)
			setData(undefined)
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

/**
 * 🔄 Hook para telemetría en tiempo real (polling)
 */
export function useRealTimeTelemetry(
	deviceId: string | null,
	keys: string[],
	intervalMs: number = 5000
): UseQueryResult<LatestTelemetry> {
	const [data, setData] = useState<LatestTelemetry | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const fetchTelemetry = useCallback(async () => {
		if (!deviceId || !keys.length) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getLatestTelemetry(deviceId, keys)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceId, keys.join(',')])

	useEffect(() => {
		if (!deviceId || !keys.length) return

		// Fetch inicial
		fetchTelemetry()

		// Setup polling
		intervalRef.current = setInterval(fetchTelemetry, intervalMs)

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [fetchTelemetry, intervalMs])

	return { data, loading, error, refetch: fetchTelemetry }
}

// ==================== ATTRIBUTES HOOKS ====================

/**
 * 📝 Hook para obtener atributos del dispositivo
 */
export function useDeviceAttributes(
	deviceId: string | null,
	clientKeys?: string[],
	sharedKeys?: string[],
	serverKeys?: string[]
): UseQueryResult<AttributesResponse> {
	const [data, setData] = useState<AttributesResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchAttributes = useCallback(async () => {
		if (!deviceId) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getDeviceAttributes(
				deviceId,
				clientKeys,
				sharedKeys,
				serverKeys
			)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [
		deviceId,
		clientKeys?.join(','),
		sharedKeys?.join(','),
		serverKeys?.join(','),
	])

	useEffect(() => {
		fetchAttributes()
	}, [fetchAttributes])

	return { data, loading, error, refetch: fetchAttributes }
}

/**
 * ✏️ Hook para actualizar atributos compartidos
 */
export function useUpdateSharedAttributes(): UseMutationResult<
	void,
	{ deviceId: string; attributes: Record<string, any> }
> {
	const [data, setData] = useState<void | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (variables: {
		deviceId: string
		attributes: Record<string, any>
	}) => {
		try {
			setLoading(true)
			setError(null)
			await tbApi.updateSharedAttributes(
				variables.deviceId,
				variables.attributes
			)
			setData(undefined)
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

/**
 * ✏️ Hook para actualizar atributos del servidor
 */
export function useUpdateServerAttributes(): UseMutationResult<
	void,
	{ deviceId: string; attributes: Record<string, any> }
> {
	const [data, setData] = useState<void | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (variables: {
		deviceId: string
		attributes: Record<string, any>
	}) => {
		try {
			setLoading(true)
			setError(null)
			await tbApi.updateServerAttributes(
				variables.deviceId,
				variables.attributes
			)
			setData(undefined)
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

// ==================== RPC HOOKS ====================

/**
 * 🎮 Hook para enviar comandos RPC one-way
 */
export function useSendOneWayRPC(): UseMutationResult<
	void,
	{ deviceId: string; request: RPCRequest }
> {
	const [data, setData] = useState<void | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (variables: {
		deviceId: string
		request: RPCRequest
	}) => {
		try {
			setLoading(true)
			setError(null)
			await tbApi.sendOneWayRPC(variables.deviceId, variables.request)
			setData(undefined)
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

/**
 * 🎮 Hook para enviar comandos RPC two-way
 */
export function useSendTwoWayRPC(): UseMutationResult<
	RPCResponse,
	{ deviceId: string; request: RPCRequest; timeout?: number }
> {
	const [data, setData] = useState<RPCResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (variables: {
		deviceId: string
		request: RPCRequest
		timeout?: number
	}) => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.sendTwoWayRPC(
				variables.deviceId,
				variables.request,
				variables.timeout
			)
			setData(result)
			return result
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

// ==================== ALARMS HOOKS ====================

/**
 * 🚨 Hook para obtener alarmas
 */
export function useAlarms(
	pageSize: number = 100,
	page: number = 0,
	searchStatus?: string,
	status?: string
): UseQueryResult<PageData<Alarm>> {
	const [data, setData] = useState<PageData<Alarm> | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchAlarms = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getAlarms(pageSize, page, searchStatus, status)
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [pageSize, page, searchStatus, status])

	useEffect(() => {
		fetchAlarms()
	}, [fetchAlarms])

	return { data, loading, error, refetch: fetchAlarms }
}

/**
 * ✅ Hook para reconocer alarmas
 */
export function useAcknowledgeAlarm(): UseMutationResult<void, string> {
	const [data, setData] = useState<void | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (alarmId: string) => {
		try {
			setLoading(true)
			setError(null)
			await tbApi.acknowledgeAlarm(alarmId)
			setData(undefined)
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

/**
 * ➕ Hook para crear alarmas
 */
export function useCreateAlarm(): UseMutationResult<
	Alarm,
	{
		type: string
		originator: {
			entityType: string
			id: string
		}
		severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING' | 'INDETERMINATE'
		status?: 'ACTIVE_UNACK' | 'ACTIVE_ACK' | 'CLEARED_UNACK' | 'CLEARED_ACK'
		propagate?: boolean
		details?: Record<string, any>
	}
> {
	const [data, setData] = useState<Alarm | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (variables: {
		type: string
		originator: {
			entityType: string
			id: string
		}
		severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING' | 'INDETERMINATE'
		status?: 'ACTIVE_UNACK' | 'ACTIVE_ACK' | 'CLEARED_UNACK' | 'CLEARED_ACK'
		propagate?: boolean
		details?: Record<string, any>
	}) => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.createAlarm(variables)
			setData(result)
			return result
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

/**
 * 🧹 Hook para resolver alarmas
 */
export function useClearAlarm(): UseMutationResult<void, string> {
	const [data, setData] = useState<void | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const mutate = async (alarmId: string) => {
		try {
			setLoading(true)
			setError(null)
			await tbApi.clearAlarm(alarmId)
			setData(undefined)
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setData(null)
		setError(null)
	}

	return { mutate, data, loading, error, reset }
}

// ==================== ANALYTICS HOOKS ====================

/**
 * 📊 Hook para obtener estadísticas generales
 */
export function useDeviceStats(): UseQueryResult<{
	total: number
	active: number
	inactive: number
	byType: Record<string, number>
}> {
	const [data, setData] = useState<{
		total: number
		active: number
		inactive: number
		byType: Record<string, number>
	} | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchStats = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const result = await tbApi.getDeviceStats()
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchStats()
	}, [fetchStats])

	return { data, loading, error, refetch: fetchStats }
}

/**
 * 📊 Hook para telemetría multi-dispositivo
 */
export function useMultiDeviceTelemetry(
	deviceIds: string[],
	keys: string[]
): UseQueryResult<Record<string, LatestTelemetry>> {
	const [data, setData] = useState<Record<string, LatestTelemetry> | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchTelemetry = useCallback(async () => {
		if (!deviceIds.length || !keys.length) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)

			const results = await Promise.all(
				deviceIds.map(async (deviceId) => {
					const telemetry = await tbApi.getLatestTelemetry(deviceId, keys)
					return { deviceId, telemetry }
				})
			)

			const telemetryMap = results.reduce((acc, { deviceId, telemetry }) => {
				acc[deviceId] = telemetry
				return acc
			}, {} as Record<string, LatestTelemetry>)

			setData(telemetryMap)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceIds.join(','), keys.join(',')])

	useEffect(() => {
		fetchTelemetry()
	}, [fetchTelemetry])

	return { data, loading, error, refetch: fetchTelemetry }
}

// ==================== ADVANCED TELEMETRY HOOKS ====================

/**
 * 📊 Hook mejorado para obtener telemetría histórica con agregación
 */
export function useAdvancedHistoricalTelemetry(
	deviceId: string | null,
	keys: string[],
	startTs: number,
	endTs: number,
	options?: {
		interval?: number
		limit?: number
		agg?: 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT' | 'NONE'
		orderBy?: 'ASC' | 'DESC'
	}
): UseQueryResult<TelemetryData> {
	const [data, setData] = useState<TelemetryData | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchTelemetry = useCallback(async () => {
		if (!deviceId || !keys.length) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await (
				await import('@/lib/thingsboard-api')
			).getAdvancedHistoricalTelemetry(deviceId, keys, startTs, endTs, {
				interval: options?.interval,
				limit: options?.limit,
				agg: options?.agg,
				orderBy: options?.orderBy,
			})
			setData(result)
		} catch (err) {
			console.error('Error fetching advanced historical telemetry:', err)
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [
		deviceId,
		keys.join(','),
		startTs,
		endTs,
		options?.interval,
		options?.limit,
		options?.agg,
		options?.orderBy,
	])

	useEffect(() => {
		fetchTelemetry()
	}, [fetchTelemetry])

	return { data, loading, error, refetch: fetchTelemetry }
}

/**
 * 📈 Hook para obtener últimos valores con mejor manejo
 */
export function useLatestTelemetryValues(
	deviceId: string | null,
	keys: string[]
): UseQueryResult<LatestTelemetry> {
	const [data, setData] = useState<LatestTelemetry | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchTelemetry = useCallback(async () => {
		if (!deviceId || !keys.length) {
			setData(null)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const result = await (
				await import('@/lib/thingsboard-api')
			).getLatestTelemetryValues(deviceId, keys)
			setData(result)
		} catch (err) {
			console.error('Error fetching latest telemetry values:', err)
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [deviceId, keys.join(',')])

	useEffect(() => {
		fetchTelemetry()
	}, [fetchTelemetry])

	return { data, loading, error, refetch: fetchTelemetry }
}

/**
 * 📊 Hook para calcular estadísticas de telemetría
 */
export function useTelemetryStats(
	telemetryData: TelemetryData | null,
	key: string
) {
	const [stats, setStats] = useState<{
		current: number
		avg: number
		min: number
		max: number
		trend: 'up' | 'down' | 'stable'
		count: number
	}>({
		current: 0,
		avg: 0,
		min: 0,
		max: 0,
		trend: 'stable',
		count: 0,
	})

	useEffect(() => {
		if (!telemetryData || !telemetryData[key]) {
			setStats({
				current: 0,
				avg: 0,
				min: 0,
				max: 0,
				trend: 'stable',
				count: 0,
			})
			return
		}

		const calculateStats = async () => {
			const result = await (
				await import('@/lib/thingsboard-api')
			).calculateTelemetryStats(telemetryData[key])
			setStats(result)
		}

		calculateStats().catch(console.error)
	}, [telemetryData, key])

	return stats
}

/**
 * 🔄 Hook para transformar datos para gráficas
 */
export function useChartData(telemetryData: TelemetryData | null) {
	const [chartData, setChartData] = useState<any[]>([])

	useEffect(() => {
		if (!telemetryData) {
			setChartData([])
			return
		}

		const transformData = async () => {
			const chart = await (
				await import('@/lib/thingsboard-api')
			).transformTelemetryForChart(telemetryData)
			setChartData(chart)
		}

		transformData().catch(console.error)
	}, [telemetryData])

	return chartData
}
