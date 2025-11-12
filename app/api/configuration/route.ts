import { NextResponse } from "next/server"

export async function GET() {
  const configuration = {
    networkSettings: {
      networkRange: "192.168.1.0/24",
      gatewayIp: "192.168.1.1",
      dnsServer: "8.8.8.8",
      dhcpEnabled: true,
      maxDevices: 50,
    },
    devices: [
      {
        id: 1,
        name: "Sensor MQTT Principal",
        ip: "192.168.1.45",
        mac: "00:1B:44:11:3A:B7",
        protocol: "MQTT",
        enabled: true,
      },
      {
        id: 2,
        name: "Actuador CoAP Sala 1",
        ip: "192.168.1.46",
        mac: "00:1B:44:11:3A:B8",
        protocol: "CoAP",
        enabled: true,
      },
      {
        id: 3,
        name: "PLC Modbus Industrial",
        ip: "192.168.1.47",
        mac: "00:1B:44:11:3A:B9",
        protocol: "Modbus",
        enabled: false,
      },
      {
        id: 4,
        name: "Gateway HTTP Principal",
        ip: "192.168.1.48",
        mac: "00:1B:44:11:3A:C0",
        protocol: "HTTP",
        enabled: true,
      },
    ],
    thresholds: [
      {
        id: "traffic",
        name: "Tráfico de red elevado",
        metric: "tráfico total",
        threshold: 1000,
        unit: "Mbps",
        enabled: true,
      },
      {
        id: "latency",
        name: "Latencia alta",
        metric: "latencia promedio",
        threshold: 500,
        unit: "ms",
        enabled: true,
      },
      {
        id: "packet_loss",
        name: "Pérdida de paquetes",
        metric: "pérdida de paquetes",
        threshold: 10,
        unit: "%",
        enabled: true,
      },
      {
        id: "failed_auth",
        name: "Intentos de autenticación fallidos",
        metric: "intentos fallidos",
        threshold: 5,
        unit: "intentos/min",
        enabled: true,
      },
      {
        id: "device_offline",
        name: "Dispositivos desconectados",
        metric: "dispositivos offline",
        threshold: 3,
        unit: "dispositivos",
        enabled: false,
      },
    ],
  }

  return NextResponse.json(configuration)
}
