/**
 * 🚀 ThingsBoard REST API Client - COMPLETE EDITION
 * Documentación: https://thingsboard.io/docs/reference/rest-api/
 *
 * Features:
 * - ✅ Device Management (CRUD)
 * - ✅ Telemetry (Upload & Query)
 * - ✅ Attributes (Client & Shared)
 * - ✅ RPC (Remote Commands)
 * - ✅ Alarms Management
 * - ✅ Device Credentials
 * - ✅ Analytics & Metrics
 */

const API_URL = 'https://thingsboard.cloud/api'
const JWT_TOKEN =
	'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjYW1pbG9hbmRyZXNiZW5pdGV6dmFsZGVzQGdtYWlsLmNvbSIsInVzZXJJZCI6IjdiY2IxZTQwLWFmN2MtMTFmMC1iMTUwLTI3MTBhODkxNWUxZCIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwic2Vzc2lvbklkIjoiMmFmY2RkYTItMTI0Zi00ZTc0LWE0YTktODlhNWMyY2YxNTJjIiwiZXhwIjoxNzYxMTg5ODQzLCJpc3MiOiJ0aGluZ3Nib2FyZC5jbG91ZCIsImlhdCI6MTc2MTE2MTA0MywiZmlyc3ROYW1lIjoiQ2FtaWxvIiwibGFzdE5hbWUiOiJCZW7DrXRleiIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwiaXNCaWxsaW5nU2VydmljZSI6ZmFsc2UsInByaXZhY3lQb2xpY3lBY2NlcHRlZCI6dHJ1ZSwidGVybXNPZlVzZUFjY2VwdGVkIjp0cnVlLCJ0ZW5hbnRJZCI6IjdiOWQwOTYwLWFmN2MtMTFmMC1iMTUwLTI3MTBhODkxNWUxZCIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAifQ.P1vO7vOi1R5V1iad2YsWzniuCAgZaPwuTJ0TXTxiqEgTwRzdNw6lO_nfFOC0C_nIm7ZEzClnknG2n_1cVIwA8A'

// ==================== INTERFACES ====================

export interface Device {
	id: {
		id: string
		entityType: string
	}
	createdTime: number
	tenantId: {
		id: string
		entityType: string
	}
	customerId?: {
		id: string
		entityType: string
	}
	name: string
	type: string
	label?: string
	additionalInfo?: any
}

export interface DeviceInfo extends Device {
	customerTitle?: string
	customerIsPublic?: boolean
	deviceProfileName?: string
}

export interface DeviceCredentials {
	id: {
		id: string
	}
	createdTime: number
	deviceId: {
		entityType: string
		id: string
	}
	credentialsType:
		| 'ACCESS_TOKEN'
		| 'X509_CERTIFICATE'
		| 'MQTT_BASIC'
		| 'LWM2M_CREDENTIALS'
	credentialsId: string
	credentialsValue?: string
}

export interface TelemetryData {
	[key: string]: Array<{
		ts: number
		value: any
	}>
}

export interface LatestTelemetry {
	[key: string]: {
		ts: number
		value: any
	}
}

export interface Attribute {
	key: string
	value: any
	lastUpdateTs?: number
}

export interface AttributesResponse {
	client?: Record<string, any>
	shared?: Record<string, any>
	server?: Record<string, any>
}

export interface Alarm {
	id: {
		id: string
		entityType: string
	}
	createdTime: number
	tenantId: {
		id: string
		entityType: string
	}
	customerId?: {
		id: string
		entityType: string
	}
	type: string
	originator: {
		id: string
		entityType: string
	}
	severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING' | 'INDETERMINATE'
	status: string
	acknowledged: boolean
	cleared: boolean
	startTs: number
	endTs?: number
	ackTs?: number
	clearTs?: number
	details?: any
	propagate: boolean
}

export interface PageData<T> {
	data: T[]
	totalPages: number
	totalElements: number
	hasNext: boolean
}

export interface RPCRequest {
	method: string
	params?: any
}

export interface RPCResponse {
	[key: string]: any
}

export interface TelemetrySubscription {
	cmdId: number
	keys: string
	timeWindow?: number
	startTs?: number
	endTs?: number
}

// ==================== API CLIENT ====================

class ThingsBoardAPI {
	private baseUrl: string
	private token: string

	constructor(baseUrl: string = API_URL, token: string = JWT_TOKEN) {
		this.baseUrl = baseUrl
		this.token = token
	}

	private getHeaders(): HeadersInit {
		return {
			'Content-Type': 'application/json',
			'X-Authorization': `Bearer ${this.token}`,
		}
	}

	// ==================== DEVICE MANAGEMENT ====================

	/**
	 * 📱 Obtener lista de dispositivos del tenant
	 */
	async getDevices(
		pageSize: number = 100,
		page: number = 0
	): Promise<PageData<DeviceInfo>> {
		const response = await fetch(
			`${this.baseUrl}/tenant/devices?pageSize=${pageSize}&page=${page}`,
			{
				method: 'GET',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error fetching devices: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * 🔍 Obtener detalles de un dispositivo específico
	 */
	async getDevice(deviceId: string): Promise<Device> {
		const response = await fetch(`${this.baseUrl}/device/${deviceId}`, {
			method: 'GET',
			headers: this.getHeaders(),
		})

		if (!response.ok) {
			throw new Error(`Error fetching device: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * ➕ Crear un nuevo dispositivo
	 */
	async createDevice(
		name: string,
		type: string,
		label?: string,
		additionalInfo?: any
	): Promise<Device> {
		const response = await fetch(`${this.baseUrl}/device`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify({
				name,
				type,
				label,
				additionalInfo,
			}),
		})

		if (!response.ok) {
			throw new Error(`Error creating device: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * ✏️ Actualizar un dispositivo existente
	 */
	async updateDevice(device: Device): Promise<Device> {
		const response = await fetch(`${this.baseUrl}/device`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify(device),
		})

		if (!response.ok) {
			throw new Error(`Error updating device: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * 🗑️ Eliminar un dispositivo
	 */
	async deleteDevice(deviceId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/device/${deviceId}`, {
			method: 'DELETE',
			headers: this.getHeaders(),
		})

		if (!response.ok) {
			throw new Error(`Error deleting device: ${response.statusText}`)
		}
	}

	/**
	 * 🔑 Obtener credenciales del dispositivo
	 */
	async getDeviceCredentials(deviceId: string): Promise<DeviceCredentials> {
		const response = await fetch(
			`${this.baseUrl}/device/${deviceId}/credentials`,
			{
				method: 'GET',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error fetching credentials: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * 🔐 Actualizar credenciales del dispositivo
	 */
	async updateDeviceCredentials(
		credentials: DeviceCredentials
	): Promise<DeviceCredentials> {
		const response = await fetch(`${this.baseUrl}/device/credentials`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify(credentials),
		})

		if (!response.ok) {
			throw new Error(`Error updating credentials: ${response.statusText}`)
		}

		return await response.json()
	}

	// ==================== TELEMETRY ====================

	/**
	 * 📊 Obtener claves de telemetría disponibles
	 */
	async getTelemetryKeys(deviceId: string): Promise<string[]> {
		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/keys/timeseries`,
			{
				method: 'GET',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error fetching telemetry keys: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * 📈 Obtener valores más recientes de telemetría
	 */
	async getLatestTelemetry(
		deviceId: string,
		keys?: string[]
	): Promise<LatestTelemetry> {
		const keysParam = keys ? `?keys=${keys.join(',')}` : ''
		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries${keysParam}`,
			{
				method: 'GET',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error fetching latest telemetry: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * 📉 Obtener telemetría histórica
	 */
	async getHistoricalTelemetry(
		deviceId: string,
		keys: string[],
		startTs: number,
		endTs: number,
		interval?: number,
		limit: number = 100,
		agg: 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT' | 'NONE' = 'NONE'
	): Promise<TelemetryData> {
		const params = new URLSearchParams({
			keys: keys.join(','),
			startTs: startTs.toString(),
			endTs: endTs.toString(),
			limit: limit.toString(),
			agg,
		})

		if (interval) {
			params.append('interval', interval.toString())
		}

		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?${params}`,
			{
				method: 'GET',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(
				`Error fetching historical telemetry: ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * 📤 Enviar telemetría al dispositivo (HTTP API)
	 */
	async sendTelemetry(
		accessToken: string,
		telemetry: Record<string, any>,
		timestamp?: number
	): Promise<void> {
		const body = timestamp ? { ts: timestamp, values: telemetry } : telemetry

		const response = await fetch(
			`${this.baseUrl}/v1/${accessToken}/telemetry`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			}
		)

		if (!response.ok) {
			throw new Error(`Error sending telemetry: ${response.statusText}`)
		}
	}

	/**
	 * 🗑️ Eliminar telemetría
	 */
	async deleteTelemetry(
		deviceId: string,
		keys: string[],
		startTs: number,
		endTs: number
	): Promise<void> {
		const params = new URLSearchParams({
			keys: keys.join(','),
			startTs: startTs.toString(),
			endTs: endTs.toString(),
		})

		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/timeseries/delete?${params}`,
			{
				method: 'DELETE',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error deleting telemetry: ${response.statusText}`)
		}
	}

	// ==================== ATTRIBUTES ====================

	/**
	 * 📝 Obtener atributos del dispositivo
	 */
	async getDeviceAttributes(
		deviceId: string,
		clientKeys?: string[],
		sharedKeys?: string[],
		serverKeys?: string[]
	): Promise<AttributesResponse> {
		const params = new URLSearchParams()
		if (clientKeys?.length) params.append('clientKeys', clientKeys.join(','))
		if (sharedKeys?.length) params.append('sharedKeys', sharedKeys.join(','))
		if (serverKeys?.length) params.append('serverKeys', serverKeys.join(','))

		const queryString = params.toString() ? `?${params.toString()}` : ''
		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/values/attributes${queryString}`,
			{
				method: 'GET',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error fetching attributes: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * ✏️ Actualizar atributos del servidor (shared)
	 */
	async updateSharedAttributes(
		deviceId: string,
		attributes: Record<string, any>
	): Promise<void> {
		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/SHARED_SCOPE`,
			{
				method: 'POST',
				headers: this.getHeaders(),
				body: JSON.stringify(attributes),
			}
		)

		if (!response.ok) {
			throw new Error(
				`Error updating shared attributes: ${response.statusText}`
			)
		}
	}

	/**
	 * ✏️ Actualizar atributos del servidor
	 */
	async updateServerAttributes(
		deviceId: string,
		attributes: Record<string, any>
	): Promise<void> {
		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/SERVER_SCOPE`,
			{
				method: 'POST',
				headers: this.getHeaders(),
				body: JSON.stringify(attributes),
			}
		)

		if (!response.ok) {
			throw new Error(
				`Error updating server attributes: ${response.statusText}`
			)
		}
	}

	/**
	 * 🗑️ Eliminar atributos
	 */
	async deleteDeviceAttributes(
		deviceId: string,
		scope: 'SERVER_SCOPE' | 'SHARED_SCOPE' | 'CLIENT_SCOPE',
		keys: string[]
	): Promise<void> {
		const params = new URLSearchParams({
			keys: keys.join(','),
		})

		const response = await fetch(
			`${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/${scope}?${params}`,
			{
				method: 'DELETE',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error deleting attributes: ${response.statusText}`)
		}
	}

	// ==================== RPC (Remote Procedure Call) ====================

	/**
	 * 🎮 Enviar comando RPC one-way al dispositivo
	 */
	async sendOneWayRPC(deviceId: string, request: RPCRequest): Promise<void> {
		const response = await fetch(
			`${this.baseUrl}/plugins/rpc/oneway/${deviceId}`,
			{
				method: 'POST',
				headers: this.getHeaders(),
				body: JSON.stringify(request),
			}
		)

		if (!response.ok) {
			throw new Error(`Error sending one-way RPC: ${response.statusText}`)
		}
	}

	/**
	 * 🎮 Enviar comando RPC two-way al dispositivo (espera respuesta)
	 */
	async sendTwoWayRPC(
		deviceId: string,
		request: RPCRequest,
		timeout: number = 5000
	): Promise<RPCResponse> {
		const response = await fetch(
			`${this.baseUrl}/plugins/rpc/twoway/${deviceId}?timeout=${timeout}`,
			{
				method: 'POST',
				headers: this.getHeaders(),
				body: JSON.stringify(request),
			}
		)

		if (!response.ok) {
			throw new Error(`Error sending two-way RPC: ${response.statusText}`)
		}

		return await response.json()
	}

	// ==================== ALARMS ====================

	/**
	 * 🚨 Obtener alarmas
	 */
	async getAlarms(
		pageSize: number = 100,
		page: number = 0,
		searchStatus?: string,
		status?: string
	): Promise<PageData<Alarm>> {
		const params = new URLSearchParams({
			pageSize: pageSize.toString(),
			page: page.toString(),
		})

		if (searchStatus) params.append('searchStatus', searchStatus)
		if (status) params.append('status', status)

		const response = await fetch(
			`${this.baseUrl}/alarm/ALARM/query/alarms?${params}`,
			{
				method: 'GET',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Error fetching alarms: ${response.statusText}`)
		}

		return await response.json()
	}

	/**
	 * ➕ Crear una alarma
	 */
	async createAlarm(alarm: {
		type: string
		originator: {
			entityType: string
			id: string
		}
		severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING' | 'INDETERMINATE'
		status?: 'ACTIVE_UNACK' | 'ACTIVE_ACK' | 'CLEARED_UNACK' | 'CLEARED_ACK'
		propagate?: boolean
		details?: Record<string, any>
	}): Promise<Alarm> {
		const response = await fetch(`${this.baseUrl}/alarm`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify({
				...alarm,
				status: alarm.status || 'ACTIVE_UNACK',
				propagate: alarm.propagate !== undefined ? alarm.propagate : true,
			}),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(
				`Error creating alarm: ${response.statusText} - ${errorText}`
			)
		}

		return await response.json()
	}

	/**
	 * ✅ Reconocer una alarma
	 */
	async acknowledgeAlarm(alarmId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/alarm/${alarmId}/ack`, {
			method: 'POST',
			headers: this.getHeaders(),
		})

		if (!response.ok) {
			throw new Error(`Error acknowledging alarm: ${response.statusText}`)
		}
	}

	/**
	 * 🧹 Resolver una alarma
	 */
	async clearAlarm(alarmId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/alarm/${alarmId}/clear`, {
			method: 'POST',
			headers: this.getHeaders(),
		})

		if (!response.ok) {
			throw new Error(`Error clearing alarm: ${response.statusText}`)
		}
	}

	/**
	 * 🗑️ Eliminar una alarma
	 */
	async deleteAlarm(alarmId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/alarm/${alarmId}`, {
			method: 'DELETE',
			headers: this.getHeaders(),
		})

		if (!response.ok) {
			throw new Error(`Error deleting alarm: ${response.statusText}`)
		}
	}

	// ==================== ANALYTICS & STATS ====================

	/**
	 * 📊 Obtener estadísticas de dispositivos
	 */
	async getDeviceStats(): Promise<{
		total: number
		active: number
		inactive: number
		byType: Record<string, number>
	}> {
		const devices = await this.getDevices(1000, 0)
		const now = Date.now()

		const stats = {
			total: devices.data.length,
			active: 0,
			inactive: 0,
			byType: {} as Record<string, number>,
		}

		devices.data.forEach((device) => {
			// Calcular activos/inactivos basado en última actividad
			const hoursSinceCreated = (now - device.createdTime) / (1000 * 60 * 60)
			if (hoursSinceCreated < 24) {
				stats.active++
			} else {
				stats.inactive++
			}

			// Contar por tipo
			stats.byType[device.type] = (stats.byType[device.type] || 0) + 1
		})

		return stats
	}
}

// ==================== HELPERS ====================

/**
 * 🕐 Convertir timestamp a string relativo
 */
// ==================== ADVANCED TELEMETRY METHODS ====================

/**
 * 📊 Obtener telemetría histórica con agregación avanzada
 */
export async function getAdvancedHistoricalTelemetry(
	deviceId: string,
	keys: string[],
	startTs: number,
	endTs: number,
	options: {
		interval?: number
		limit?: number
		agg?: 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT' | 'NONE'
		orderBy?: 'ASC' | 'DESC'
		useStrictDataTypes?: boolean
	} = {}
): Promise<TelemetryData> {
	const {
		interval = Math.ceil((endTs - startTs) / 100), // Auto-calculate interval for 100 points
		limit = 1000,
		agg = 'NONE',
		orderBy = 'ASC',
		useStrictDataTypes = true,
	} = options

	const params = new URLSearchParams({
		keys: keys.join(','),
		startTs: startTs.toString(),
		endTs: endTs.toString(),
		limit: limit.toString(),
		interval: interval.toString(),
		agg,
		orderBy,
		useStrictDataTypes: useStrictDataTypes.toString(),
	})

	const response = await fetch(
		`${API_URL}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?${params}`,
		{
			method: 'GET',
			headers: {
				'X-Authorization': `Bearer ${JWT_TOKEN}`,
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) {
		const errorText = await response.text()
		console.error('Error response:', errorText)
		throw new Error(
			`Error fetching advanced historical telemetry: ${response.status} ${response.statusText}`
		)
	}

	return await response.json()
}

/**
 * 📈 Obtener últimos valores con soporte a múltiples claves
 */
export async function getLatestTelemetryValues(
	deviceId: string,
	keys: string[]
): Promise<LatestTelemetry> {
	const keysParam = keys.length > 0 ? `?keys=${keys.join(',')}` : ''

	const response = await fetch(
		`${API_URL}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries${keysParam}`,
		{
			method: 'GET',
			headers: {
				'X-Authorization': `Bearer ${JWT_TOKEN}`,
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) {
		const errorText = await response.text()
		console.error('Error response:', errorText)
		throw new Error(
			`Error fetching latest telemetry values: ${response.status} ${response.statusText}`
		)
	}

	const data = await response.json()

	// Transformar a LatestTelemetry format (ts y value por clave)
	const result: LatestTelemetry = {}

	for (const key in data) {
		if (Array.isArray(data[key]) && data[key].length > 0) {
			result[key] = data[key][0] // Tomar el primero (más reciente)
		}
	}

	return result
}

/**
 * 🎯 Calcular estadísticas avanzadas de telemetría
 */
export function calculateTelemetryStats(
	data: Array<{ ts: number; value: any }>
): {
	current: number
	avg: number
	min: number
	max: number
	trend: 'up' | 'down' | 'stable'
	count: number
} {
	if (!data.length) {
		return { current: 0, avg: 0, min: 0, max: 0, trend: 'stable', count: 0 }
	}

	const values = data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v))
	if (!values.length) {
		return { current: 0, avg: 0, min: 0, max: 0, trend: 'stable', count: 0 }
	}

	const current = values[values.length - 1]
	const avg = values.reduce((a, b) => a + b, 0) / values.length
	const min = Math.min(...values)
	const max = Math.max(...values)

	// Calcular tendencia comparando últimos 25% con primeros 25%
	const quarter = Math.max(1, Math.floor(values.length / 4))
	const firstQuarter = values.slice(0, quarter)
	const lastQuarter = values.slice(-quarter)
	const firstAvg = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length
	const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length

	let trend: 'up' | 'down' | 'stable' = 'stable'
	if (lastAvg > firstAvg * 1.05) trend = 'up'
	else if (lastAvg < firstAvg * 0.95) trend = 'down'

	return {
		current: parseFloat(current.toFixed(2)),
		avg: parseFloat(avg.toFixed(2)),
		min: parseFloat(min.toFixed(2)),
		max: parseFloat(max.toFixed(2)),
		trend,
		count: values.length,
	}
}

/**
 * 🔄 Transformar datos de telemetría para gráficas
 */
export function transformTelemetryForChart(
	telemetryData: TelemetryData
): Array<{
	ts: number
	timestamp: string
	[key: string]: any
}> {
	if (!telemetryData || Object.keys(telemetryData).length === 0) {
		return []
	}

	// Obtener todos los timestamps únicos
	const timestamps = new Set<number>()
	const keys = Object.keys(telemetryData)

	for (const key of keys) {
		if (Array.isArray(telemetryData[key])) {
			telemetryData[key].forEach((item) => {
				timestamps.add(item.ts)
			})
		}
	}

	// Crear array de objetos con todos los datos alineados por timestamp
	const result = Array.from(timestamps)
		.sort((a, b) => a - b)
		.map((ts) => {
			const point: any = {
				ts,
				timestamp: formatTimestamp(ts),
			}

			// Llenar cada clave con el valor en este timestamp
			for (const key of keys) {
				const entry = telemetryData[key]?.find((item) => item.ts === ts)
				if (entry) {
					const value = parseFloat(entry.value)
					point[key] = isNaN(value) ? entry.value : value
				}
			}

			return point
		})

	return result
}

export function getRelativeTime(timestamp: number): string {
	const now = Date.now()
	const diff = now - timestamp
	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
	if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
	if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
	return `hace ${seconds} segundo${seconds > 1 ? 's' : ''}`
}

/**
 * 📅 Formatear timestamp a fecha legible
 */
export function formatTimestamp(timestamp: number): string {
	return new Date(timestamp).toLocaleString('es-ES', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

/**
 * 🎨 Obtener color por tipo de dispositivo
 */
export function getDeviceTypeColor(type: string): string {
	const colors: Record<string, string> = {
		sensor: '#00f7ff',
		actuator: '#ff006e',
		gateway: '#ffb703',
		controller: '#00d084',
		default: '#b700ff',
	}
	return colors[type.toLowerCase()] || colors.default
}

/**
 * 📊 Calcular agregado de telemetría
 */
export function aggregateTelemetry(
	data: Array<{ ts: number; value: any }>,
	type: 'avg' | 'min' | 'max' | 'sum'
): number {
	if (!data.length) return 0

	const values = data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v))

	switch (type) {
		case 'avg':
			return values.reduce((a, b) => a + b, 0) / values.length
		case 'min':
			return Math.min(...values)
		case 'max':
			return Math.max(...values)
		case 'sum':
			return values.reduce((a, b) => a + b, 0)
		default:
			return 0
	}
}

// Singleton instance
export const tbApi = new ThingsBoardAPI()
export default tbApi
