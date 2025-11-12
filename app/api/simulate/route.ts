import { NextResponse } from "next/server"

// Generador de datos aleatorios para IoT Dashboard
// Se actualiza cada 1 segundo con datos nuevos

// Estado global del simulador
let simulationRunning = false
let simulationData = {
  devices: [] as any[],
  telemetry: {} as any,
  alerts: [] as any[],
  dashboardStats: {} as any,
  lastUpdate: Date.now(),
}

// Tipos de dispositivos IoT
const DEVICE_TYPES = [
  "Sensor de Temperatura",
  "Sensor de Humedad",
  "Sensor de Presión",
  "Actuador LED",
  "Controlador HVAC",
  "Gateway IoT",
  "Sensor de Movimiento",
  "Sensor de Luz",
  "Monitor de Energía",
  "Cámara IP",
  "Sensor de Gas",
  "Controlador de Acceso",
]

const PROTOCOLS = ["MQTT", "CoAP", "HTTP", "Modbus", "LoRaWAN", "Zigbee"]
const DEVICE_STATUS = ["active", "inactive", "suspicious", "blocked", "maintenance"]

const ALERT_TYPES = ["security", "device", "network", "system", "performance"]
const ALERT_SEVERITIES = ["Crítico", "Alto", "Medio", "Bajo"]

// Utilidades
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomFloat = (min: number, max: number, decimals: number = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))

const randomChoice = <T,>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]

const randomMAC = () => {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase()
  ).join(":")
}

const randomIP = () => {
  return `192.168.${randomInt(1, 10)}.${randomInt(1, 254)}`
}

const getRelativeTime = (minutes: number) => {
  if (minutes < 1) return "ahora"
  if (minutes < 60) return `${Math.floor(minutes)} min`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hora${Math.floor(minutes / 60) > 1 ? "s" : ""}`
  return `${Math.floor(minutes / 1440)} día${Math.floor(minutes / 1440) > 1 ? "s" : ""}`
}

// Generar dispositivos
function generateDevices(count: number = 15) {
  const devices = []
  for (let i = 1; i <= count; i++) {
    const lastActivityMinutes = randomFloat(0, 240)
    devices.push({
      id: i,
      mac: randomMAC(),
      ip: randomIP(),
      type: randomChoice(DEVICE_TYPES),
      status: randomChoice(DEVICE_STATUS),
      lastActivity: getRelativeTime(lastActivityMinutes),
      lastActivityRaw: Date.now() - lastActivityMinutes * 60 * 1000,
      protocol: randomChoice(PROTOCOLS),
      cpu: randomFloat(10, 95, 1),
      memory: randomFloat(20, 90, 1),
      uptime: randomInt(1, 720), // horas
      temperature: randomFloat(20, 75, 1),
      signalStrength: randomInt(-90, -30),
    })
  }
  return devices
}

// Generar telemetría para un dispositivo
function generateTelemetryForDevice(deviceId: number, deviceType: string) {
  const baseData: any = {
    timestamp: Date.now(),
    deviceId,
  }

  // Datos comunes
  baseData.cpu = randomFloat(10, 95, 1)
  baseData.memory = randomFloat(20, 90, 1)
  baseData.uptime = randomInt(1, 720)
  baseData.signalStrength = randomInt(-90, -30)

  // Datos específicos por tipo
  if (deviceType.includes("Temperatura") || deviceType.includes("Sensor")) {
    baseData.temperature = randomFloat(18, 32, 2)
    baseData.humidity = randomFloat(30, 80, 1)
  }

  if (deviceType.includes("Humedad")) {
    baseData.humidity = randomFloat(30, 90, 1)
    baseData.dewPoint = randomFloat(10, 25, 2)
  }

  if (deviceType.includes("Presión")) {
    baseData.pressure = randomFloat(980, 1030, 2)
    baseData.altitude = randomFloat(0, 500, 1)
  }

  if (deviceType.includes("Luz")) {
    baseData.luminosity = randomFloat(0, 2000, 1)
    baseData.lightLevel = randomInt(0, 100)
  }

  if (deviceType.includes("Energía")) {
    baseData.voltage = randomFloat(110, 240, 1)
    baseData.current = randomFloat(0.5, 15, 2)
    baseData.power = randomFloat(50, 3000, 1)
    baseData.energy = randomFloat(0, 100, 2)
    baseData.powerFactor = randomFloat(0.85, 0.99, 3)
  }

  if (deviceType.includes("Gas")) {
    baseData.co2 = randomFloat(400, 1500, 0)
    baseData.co = randomFloat(0, 50, 1)
    baseData.gasLevel = randomInt(0, 100)
  }

  if (deviceType.includes("Movimiento")) {
    baseData.motion = Math.random() > 0.7
    baseData.motionCount = randomInt(0, 50)
  }

  // Métricas de red
  baseData.bytesReceived = randomInt(1000, 100000)
  baseData.bytesSent = randomInt(1000, 100000)
  baseData.packetsReceived = randomInt(100, 10000)
  baseData.packetsSent = randomInt(100, 10000)
  baseData.latency = randomFloat(1, 150, 2)

  // Estado de batería (para dispositivos portátiles)
  if (Math.random() > 0.5) {
    baseData.battery = randomFloat(10, 100, 1)
    baseData.batteryVoltage = randomFloat(3.0, 4.2, 2)
  }

  return baseData
}

// Generar alertas
function generateAlerts(devices: any[], count: number = 8) {
  const alerts = []
  const alertMessages = [
    {
      type: "security",
      severity: "Crítico",
      title: "Ataque DDoS detectado",
      getMessage: (device: any) =>
        `Flood detectado en dispositivo ${device.ip} - Tráfico anómalo de ${randomInt(500, 1000)}+ paquetes/seg`,
    },
    {
      type: "security",
      severity: "Crítico",
      title: "Man-in-the-Middle detectado",
      getMessage: (device: any) =>
        `Posible ataque MITM en comunicación ${device.protocol} entre ${device.ip} y gateway`,
    },
    {
      type: "security",
      severity: "Alto",
      title: "Acceso no autorizado",
      getMessage: (device: any) =>
        `Intento de acceso no autorizado desde ${randomIP()} al dispositivo ${device.type}`,
    },
    {
      type: "device",
      severity: "Bajo",
      title: "Nuevo dispositivo conectado",
      getMessage: (device: any) =>
        `Dispositivo IoT desconocido conectado a la red - MAC: ${device.mac}`,
    },
    {
      type: "network",
      severity: "Medio",
      title: "Latencia elevada detectada",
      getMessage: (device: any) =>
        `Latencia anormalmente alta en comunicaciones ${device.protocol} (>${randomInt(500, 1000)}ms)`,
    },
    {
      type: "system",
      severity: "Bajo",
      title: "Actualización de firmware disponible",
      getMessage: (device: any) =>
        `Nueva versión de firmware disponible para dispositivos ${device.protocol}`,
    },
    {
      type: "security",
      severity: "Crítico",
      title: "Vulnerabilidad crítica detectada",
      getMessage: (device: any) =>
        `CVE-2024-${randomInt(1000, 9999)} detectada en dispositivo ${device.type} - Requiere acción inmediata`,
    },
    {
      type: "network",
      severity: "Medio",
      title: "Pérdida de paquetes detectada",
      getMessage: (device: any) =>
        `Pérdida de paquetes del ${randomInt(10, 30)}% en comunicaciones ${device.protocol}`,
    },
    {
      type: "performance",
      severity: "Alto",
      title: "Uso elevado de CPU",
      getMessage: (device: any) =>
        `CPU al ${randomInt(85, 99)}% en dispositivo ${device.ip}`,
    },
    {
      type: "performance",
      severity: "Medio",
      title: "Memoria crítica",
      getMessage: (device: any) =>
        `Uso de memoria al ${randomInt(85, 99)}% en ${device.type}`,
    },
    {
      type: "device",
      severity: "Alto",
      title: "Dispositivo sin respuesta",
      getMessage: (device: any) =>
        `Dispositivo ${device.ip} no responde desde hace ${randomInt(10, 60)} minutos`,
    },
    {
      type: "network",
      severity: "Bajo",
      title: "Reconexión exitosa",
      getMessage: (device: any) =>
        `Dispositivo ${device.ip} reconectado después de ${randomInt(5, 30)} minutos offline`,
    },
  ]

  for (let i = 1; i <= count; i++) {
    const device = randomChoice(devices)
    const alertTemplate = randomChoice(alertMessages)
    const minutesAgo = randomFloat(1, 360)

    alerts.push({
      id: i,
      type: alertTemplate.type,
      severity: alertTemplate.severity,
      title: alertTemplate.title,
      message: alertTemplate.getMessage(device),
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
      device: device.ip,
      protocol: device.protocol,
      resolved: Math.random() > 0.6,
      details: `Detectado en dispositivo ${device.type} (${device.mac}). ${Math.random() > 0.5 ? "Acción automática tomada." : "Requiere intervención manual."}`,
    })
  }

  return alerts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

// Generar estadísticas del dashboard
function generateDashboardStats(devices: any[], telemetry: any, alerts: any[]) {
  const activeDevices = devices.filter((d) => d.status === "active").length
  const totalDevices = devices.length

  // Calcular estadísticas de telemetría
  const avgTemperature =
    devices
      .filter((d) => d.temperature)
      .reduce((sum, d) => sum + d.temperature, 0) / devices.length || 0

  const avgCpu =
    devices.reduce((sum, d) => sum + d.cpu, 0) / devices.length || 0

  const avgMemory =
    devices.reduce((sum, d) => sum + d.memory, 0) / devices.length || 0

  // Tráfico de red (simulado)
  const totalTraffic = devices.reduce(
    (sum, d) => sum + d.bytesReceived + d.bytesSent,
    0
  )

  // Alertas activas
  const activeAlerts = alerts.filter((a) => !a.resolved).length
  const criticalAlerts = alerts.filter(
    (a) => !a.resolved && a.severity === "Crítico"
  ).length

  return {
    totalDevices,
    activeDevices,
    inactiveDevices: totalDevices - activeDevices,
    deviceTypes: [...new Set(devices.map((d) => d.type))].length,
    activeAlerts,
    criticalAlerts,
    avgTemperature: randomFloat(20, 28, 1),
    avgCpu: randomFloat(30, 70, 1),
    avgMemory: randomFloat(40, 75, 1),
    totalTraffic: randomInt(50000, 500000),
    networkLatency: randomFloat(5, 50, 2),
    uptime: randomFloat(95, 99.9, 2),
  }
}

// Generar datos históricos de telemetría (para gráficas)
function generateHistoricalTelemetry(hours: number = 24, points: number = 50) {
  const data = []
  const now = Date.now()
  const interval = (hours * 60 * 60 * 1000) / points

  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * interval
    data.push({
      timestamp,
      time: new Date(timestamp).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: randomFloat(18, 32, 2),
      humidity: randomFloat(30, 80, 1),
      pressure: randomFloat(980, 1030, 2),
      cpu: randomFloat(10, 95, 1),
      memory: randomFloat(20, 90, 1),
      traffic: randomFloat(100, 1000, 1),
      latency: randomFloat(5, 150, 2),
      power: randomFloat(50, 3000, 1),
      co2: randomFloat(400, 1500, 0),
    })
  }

  return data
}

// Inicializar datos
function initializeSimulation() {
  const devices = generateDevices(15)

  const telemetry: any = {}
  devices.forEach((device) => {
    telemetry[device.id] = {
      current: generateTelemetryForDevice(device.id, device.type),
      history: generateHistoricalTelemetry(24, 50),
    }
  })

  const alerts = generateAlerts(devices, 12)
  const dashboardStats = generateDashboardStats(devices, telemetry, alerts)

  simulationData = {
    devices,
    telemetry,
    alerts,
    dashboardStats,
    lastUpdate: Date.now(),
  }

  return simulationData
}

// Actualizar datos (simular cambios en tiempo real)
function updateSimulation() {
  // Actualizar algunos dispositivos
  simulationData.devices.forEach((device) => {
    // Actualizar estado aleatoriamente (10% de probabilidad)
    if (Math.random() < 0.1) {
      device.status = randomChoice(DEVICE_STATUS)
    }

    // Actualizar métricas
    device.cpu = Math.max(
      10,
      Math.min(95, device.cpu + randomFloat(-5, 5, 1))
    )
    device.memory = Math.max(
      20,
      Math.min(90, device.memory + randomFloat(-5, 5, 1))
    )
    device.temperature = Math.max(
      20,
      Math.min(75, device.temperature + randomFloat(-2, 2, 1))
    )
    device.signalStrength = Math.max(
      -90,
      Math.min(-30, device.signalStrength + randomInt(-5, 5))
    )

    // Actualizar última actividad
    const lastActivityMinutes = randomFloat(0, 120)
    device.lastActivity = getRelativeTime(lastActivityMinutes)
    device.lastActivityRaw = Date.now() - lastActivityMinutes * 60 * 1000
  })

  // Actualizar telemetría
  Object.keys(simulationData.telemetry).forEach((deviceId) => {
    const device = simulationData.devices.find((d) => d.id === parseInt(deviceId))
    if (device) {
      const newData = generateTelemetryForDevice(device.id, device.type)
      simulationData.telemetry[deviceId].current = newData

      // Agregar a historial
      const history = simulationData.telemetry[deviceId].history
      history.push({
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...newData,
      })

      // Mantener solo los últimos 100 puntos
      if (history.length > 100) {
        history.shift()
      }
    }
  })

  // Generar nuevas alertas ocasionalmente (5% de probabilidad)
  if (Math.random() < 0.05) {
    const newAlerts = generateAlerts(simulationData.devices, 1)
    simulationData.alerts = [...newAlerts, ...simulationData.alerts].slice(0, 20)
  }

  // Resolver algunas alertas aleatoriamente
  simulationData.alerts.forEach((alert) => {
    if (!alert.resolved && Math.random() < 0.02) {
      alert.resolved = true
    }
  })

  // Actualizar estadísticas del dashboard
  simulationData.dashboardStats = generateDashboardStats(
    simulationData.devices,
    simulationData.telemetry,
    simulationData.alerts
  )

  simulationData.lastUpdate = Date.now()
}

// Endpoint principal
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const module = searchParams.get("module")
  const deviceId = searchParams.get("deviceId")

  // Inicializar si es necesario
  if (!simulationRunning || simulationData.devices.length === 0) {
    initializeSimulation()
    simulationRunning = true
  }

  // Actualizar datos
  updateSimulation()

  // Responder según el parámetro
  switch (module) {
    case "devices":
      return NextResponse.json({
        success: true,
        data: simulationData.devices,
        lastUpdate: simulationData.lastUpdate,
      })

    case "telemetry":
      if (deviceId) {
        const telemetry = simulationData.telemetry[deviceId]
        if (!telemetry) {
          return NextResponse.json(
            { success: false, error: "Device not found" },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          data: telemetry,
          lastUpdate: simulationData.lastUpdate,
        })
      }
      return NextResponse.json({
        success: true,
        data: simulationData.telemetry,
        lastUpdate: simulationData.lastUpdate,
      })

    case "alerts":
      return NextResponse.json({
        success: true,
        data: simulationData.alerts,
        lastUpdate: simulationData.lastUpdate,
      })

    case "dashboard":
      return NextResponse.json({
        success: true,
        data: simulationData.dashboardStats,
        devices: simulationData.devices,
        recentAlerts: simulationData.alerts.slice(0, 5),
        lastUpdate: simulationData.lastUpdate,
      })

    case "all":
    default:
      return NextResponse.json({
        success: true,
        data: {
          devices: simulationData.devices,
          telemetry: simulationData.telemetry,
          alerts: simulationData.alerts,
          dashboard: simulationData.dashboardStats,
        },
        lastUpdate: simulationData.lastUpdate,
      })
  }
}

// Endpoint para controlar la simulación
export async function POST(request: Request) {
  const body = await request.json()
  const { action } = body

  switch (action) {
    case "start":
      if (!simulationRunning) {
        initializeSimulation()
        simulationRunning = true
      }
      return NextResponse.json({
        success: true,
        message: "Simulation started",
      })

    case "stop":
      simulationRunning = false
      return NextResponse.json({
        success: true,
        message: "Simulation stopped",
      })

    case "reset":
      initializeSimulation()
      simulationRunning = true
      return NextResponse.json({
        success: true,
        message: "Simulation reset",
      })

    default:
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      )
  }
}
