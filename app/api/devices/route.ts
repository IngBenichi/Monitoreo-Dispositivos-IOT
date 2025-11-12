import { NextResponse } from "next/server"

export async function GET() {
  const devices = [
    {
      id: 1,
      mac: "00:1B:44:11:3A:B7",
      ip: "192.168.1.45",
      type: "Sensor MQTT",
      status: "active",
      lastActivity: "2 min ago",
      protocol: "MQTT",
    },
    {
      id: 2,
      mac: "00:1B:44:11:3A:B8",
      ip: "192.168.1.46",
      type: "Actuador CoAP",
      status: "active",
      lastActivity: "5 min ago",
      protocol: "CoAP",
    },
    {
      id: 3,
      mac: "00:1B:44:11:3A:B9",
      ip: "192.168.1.47",
      type: "PLC Modbus",
      status: "blocked",
      lastActivity: "1 hour ago",
      protocol: "Modbus",
    },
    {
      id: 4,
      mac: "00:1B:44:11:3A:C0",
      ip: "192.168.1.48",
      type: "Gateway HTTP",
      status: "suspicious",
      lastActivity: "30 min ago",
      protocol: "HTTP",
    },
    {
      id: 5,
      mac: "00:1B:44:11:3A:C1",
      ip: "192.168.1.49",
      type: "Sensor temperatura",
      status: "active",
      lastActivity: "1 min ago",
      protocol: "MQTT",
    },
    {
      id: 6,
      mac: "00:1B:44:11:3A:C2",
      ip: "192.168.1.50",
      type: "Controlador LED",
      status: "active",
      lastActivity: "3 min ago",
      protocol: "CoAP",
    },
    {
      id: 7,
      mac: "00:1B:44:11:3A:C3",
      ip: "192.168.1.51",
      type: "Monitor energía",
      status: "suspicious",
      lastActivity: "45 min ago",
      protocol: "Modbus",
    },
    {
      id: 8,
      mac: "00:1B:44:11:3A:C4",
      ip: "192.168.1.52",
      type: "Cámara IP",
      status: "blocked",
      lastActivity: "2 hours ago",
      protocol: "HTTP",
    },
  ]

  return NextResponse.json(devices)
}
