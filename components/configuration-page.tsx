'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	Network,
	Plus,
	Trash2,
	Save,
	RotateCcw,
	Router,
	Activity,
	Bell,
	Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useSimulatedDevices, useSimulatedAlerts } from '@/hooks/use-simulation'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

interface NetworkDevice {
	id: number
	name: string
	ip: string
	mac: string
	protocol: string
	enabled: boolean
}

interface AlertThreshold {
	id: string
	name: string
	metric: string
	threshold: number
	unit: string
	enabled: boolean
}

interface NetworkSettings {
	networkRange: string
	gatewayIp: string
	dnsServer: string
	dhcpEnabled: boolean
	maxDevices: number
}

export function ConfigurationPage() {
	// Usar datos simulados - actualiza cada 1 segundo
	const { devices: simulatedDevices, loading: devicesLoading } = useSimulatedDevices(1000)
	const { alerts: simulatedAlerts, loading: alertsLoading } = useSimulatedAlerts(1000)

	const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([])
	const [alertThresholds, setAlertThresholds] = useState<AlertThreshold[]>([
		{
			id: 'cpu',
			name: 'Uso de CPU',
			metric: 'CPU',
			threshold: 80,
			unit: '%',
			enabled: true,
		},
		{
			id: 'memory',
			name: 'Uso de Memoria',
			metric: 'memoria',
			threshold: 85,
			unit: '%',
			enabled: true,
		},
		{
			id: 'temperature',
			name: 'Temperatura',
			metric: 'temperatura',
			threshold: 70,
			unit: '°C',
			enabled: true,
		},
		{
			id: 'traffic',
			name: 'Tráfico de red',
			metric: 'tráfico',
			threshold: 1000,
			unit: 'Mbps',
			enabled: false,
		},
		{
			id: 'latency',
			name: 'Latencia de red',
			metric: 'latencia',
			threshold: 100,
			unit: 'ms',
			enabled: true,
		},
	])
	const [networkSettings, setNetworkSettings] = useState<NetworkSettings>({
		networkRange: '192.168.1.0/24',
		gatewayIp: '192.168.1.1',
		dnsServer: '8.8.8.8',
		dhcpEnabled: true,
		maxDevices: 50,
	})
	const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
	const [newDevice, setNewDevice] = useState({
		name: '',
		ip: '',
		mac: '',
		protocol: 'MQTT',
	})

	const loading = devicesLoading || alertsLoading

	// Transformar dispositivos simulados al formato de la configuración
	useEffect(() => {
		if (simulatedDevices && simulatedDevices.length > 0) {
			const transformedDevices: NetworkDevice[] = simulatedDevices.map(device => ({
				id: device.id,
				name: device.type,
				ip: device.ip,
				mac: device.mac,
				protocol: device.protocol,
				enabled: device.status === 'active',
			}))
			setNetworkDevices(transformedDevices)
		}
	}, [simulatedDevices])

	const handleAddDevice = () => {
		const device: NetworkDevice = {
			id: Date.now(),
			...newDevice,
			enabled: true,
		}
		setNetworkDevices((prev) => [...prev, device])
		setIsAddDeviceOpen(false)
		setNewDevice({ name: '', ip: '', mac: '', protocol: 'MQTT' })
	}

	const handleRemoveDevice = (deviceId: number) => {
		setNetworkDevices((prev) => prev.filter((device) => device.id !== deviceId))
	}

	const handleToggleDevice = (deviceId: number, enabled: boolean) => {
		setNetworkDevices((prev) =>
			prev.map((device) =>
				device.id === deviceId ? { ...device, enabled } : device
			)
		)
	}

	const handleThresholdChange = (thresholdId: string, value: number) => {
		setAlertThresholds((prev) =>
			prev.map((threshold) =>
				threshold.id === thresholdId
					? { ...threshold, threshold: value }
					: threshold
			)
		)
	}

	const handleToggleThreshold = (thresholdId: string, enabled: boolean) => {
		setAlertThresholds((prev) =>
			prev.map((threshold) =>
				threshold.id === thresholdId ? { ...threshold, enabled } : threshold
			)
		)
	}

	const handleSaveConfiguration = async () => {
		// In a real app, this would save to an API
		console.log('Saving configuration:', {
			networkDevices,
			alertThresholds,
			networkSettings,
		})
	}

	const handleResetConfiguration = () => {
		// Reset to default values
		setNetworkSettings({
			networkRange: '192.168.1.0/24',
			gatewayIp: '192.168.1.1',
			dnsServer: '8.8.8.8',
			dhcpEnabled: true,
			maxDevices: 50,
		})
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">Cargando configuración...</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Page header */}
			<motion.div
				className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-black via-yellow-950/20 to-black p-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(250,204,21,0.1),transparent)]" />
				<div className="relative">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-3">
						Configuración del Sistema
					</h1>
					<p className="text-yellow-100/70 text-lg mb-2">
						Configuración de red y parámetros del sistema (Datos simulados en tiempo real)
					</p>
					<Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/50">
						<Zap className="w-3 h-3 mr-1" />
						Simulación Activa - Actualización cada 1s
					</Badge>
				</div>
			</motion.div>

			<div className="flex items-center justify-between">
				<div className="opacity-0 hidden">
					<h1 className="text-3xl font-bold text-foreground">Configuración</h1>
					<p className="text-muted-foreground">
						Configuración de red simulada y umbrales de alertas
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={handleResetConfiguration}
						className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Restablecer
					</Button>
					<Button
						onClick={handleSaveConfiguration}
						className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30"
					>
						<Save className="w-4 h-4 mr-2" />
						Guardar cambios
					</Button>
				</div>
			</div>

			{/* Network Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				<Card className="bg-card border-yellow-500/20 rounded-2xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-yellow-300">
							<Network className="h-5 w-5 text-yellow-400" />
							Configuración de red
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="networkRange" className="text-foreground">
									Rango de red
								</Label>
								<Input
									id="networkRange"
									value={networkSettings.networkRange}
									onChange={(e) =>
										setNetworkSettings({
											...networkSettings,
											networkRange: e.target.value,
										})
									}
									className="bg-input border-border"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="gatewayIp" className="text-foreground">
									IP del Gateway
								</Label>
								<Input
									id="gatewayIp"
									value={networkSettings.gatewayIp}
									onChange={(e) =>
										setNetworkSettings({
											...networkSettings,
											gatewayIp: e.target.value,
										})
									}
									className="bg-input border-border"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dnsServer" className="text-foreground">
									Servidor DNS
								</Label>
								<Input
									id="dnsServer"
									value={networkSettings.dnsServer}
									onChange={(e) =>
										setNetworkSettings({
											...networkSettings,
											dnsServer: e.target.value,
										})
									}
									className="bg-input border-border"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="maxDevices" className="text-foreground">
									Máximo de dispositivos
								</Label>
								<Input
									id="maxDevices"
									type="number"
									value={networkSettings.maxDevices}
									onChange={(e) =>
										setNetworkSettings({
											...networkSettings,
											maxDevices: Number.parseInt(e.target.value),
										})
									}
									className="bg-input border-border"
								/>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="dhcp"
								checked={networkSettings.dhcpEnabled}
								onCheckedChange={(checked) =>
									setNetworkSettings({
										...networkSettings,
										dhcpEnabled: checked,
									})
								}
							/>
							<Label htmlFor="dhcp" className="text-foreground">
								Habilitar DHCP automático
							</Label>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Simulated Devices */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<Card className="bg-card border-yellow-500/20 rounded-2xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between text-yellow-300">
							<div className="flex items-center gap-2">
								<Router className="h-5 w-5 text-yellow-400" />
								Dispositivos simulados ({networkDevices.length})
							</div>
							<Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
								<DialogTrigger asChild>
									<Button
										size="sm"
										className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
									>
										<Plus className="w-4 h-4 mr-2" />
										Agregar dispositivo
									</Button>
								</DialogTrigger>
								<DialogContent className="bg-card border-border">
									<DialogHeader>
										<DialogTitle className="text-foreground">
											Agregar nuevo dispositivo
										</DialogTitle>
										<DialogDescription className="text-muted-foreground">
											Configure un nuevo dispositivo IoT para la simulación.
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="deviceName" className="text-foreground">
												Nombre del dispositivo
											</Label>
											<Input
												id="deviceName"
												value={newDevice.name}
												onChange={(e) =>
													setNewDevice({ ...newDevice, name: e.target.value })
												}
												placeholder="Ej: Sensor temperatura sala 1"
												className="bg-input border-border"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="deviceIp" className="text-foreground">
												Dirección IP
											</Label>
											<Input
												id="deviceIp"
												value={newDevice.ip}
												onChange={(e) =>
													setNewDevice({ ...newDevice, ip: e.target.value })
												}
												placeholder="192.168.1.50"
												className="bg-input border-border"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="deviceMac" className="text-foreground">
												Dirección MAC
											</Label>
											<Input
												id="deviceMac"
												value={newDevice.mac}
												onChange={(e) =>
													setNewDevice({ ...newDevice, mac: e.target.value })
												}
												placeholder="00:1B:44:11:3A:C6"
												className="bg-input border-border"
											/>
										</div>
										<div className="space-y-2">
											<Label
												htmlFor="deviceProtocol"
												className="text-foreground"
											>
												Protocolo
											</Label>
											<Select
												value={newDevice.protocol}
												onValueChange={(value) =>
													setNewDevice({ ...newDevice, protocol: value })
												}
											>
												<SelectTrigger className="bg-input border-border">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="MQTT">MQTT</SelectItem>
													<SelectItem value="CoAP">CoAP</SelectItem>
													<SelectItem value="Modbus">Modbus</SelectItem>
													<SelectItem value="HTTP">HTTP</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setIsAddDeviceOpen(false)}
										>
											Cancelar
										</Button>
										<Button
											onClick={handleAddDevice}
											disabled={
												!newDevice.name || !newDevice.ip || !newDevice.mac
											}
										>
											Agregar dispositivo
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg border border-border overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="border-border">
										<TableHead className="text-muted-foreground">
											Estado
										</TableHead>
										<TableHead className="text-muted-foreground">
											Nombre
										</TableHead>
										<TableHead className="text-muted-foreground">IP</TableHead>
										<TableHead className="text-muted-foreground">MAC</TableHead>
										<TableHead className="text-muted-foreground">
											Protocolo
										</TableHead>
										<TableHead className="text-muted-foreground">
											Acciones
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{networkDevices.map((device) => (
										<TableRow key={device.id} className="border-border">
											<TableCell>
												<Switch
													checked={device.enabled}
													onCheckedChange={(checked) =>
														handleToggleDevice(device.id, checked)
													}
												/>
											</TableCell>
											<TableCell className="font-medium text-foreground">
												{device.name}
											</TableCell>
											<TableCell className="font-mono text-sm text-foreground">
												{device.ip}
											</TableCell>
											<TableCell className="font-mono text-sm text-foreground">
												{device.mac}
											</TableCell>
											<TableCell>
												<Badge variant="outline" className="text-xs">
													{device.protocol}
												</Badge>
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleRemoveDevice(device.id)}
													className="text-destructive hover:text-destructive"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Alert Thresholds */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<Card className="bg-card border-yellow-500/20 rounded-2xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-yellow-300">
							<Bell className="h-5 w-5 text-yellow-400" />
							Umbrales de alertas
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{alertThresholds.map((threshold) => (
							<div key={threshold.id} className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<Label className="text-foreground font-medium">
											{threshold.name}
										</Label>
										<p className="text-sm text-muted-foreground">
											Alerta cuando {threshold.metric} supere el umbral
										</p>
									</div>
									<Switch
										checked={threshold.enabled}
										onCheckedChange={(checked) =>
											handleToggleThreshold(threshold.id, checked)
										}
									/>
								</div>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Umbral actual
										</span>
										<span className="text-sm font-medium text-foreground">
											{threshold.threshold} {threshold.unit}
										</span>
									</div>
									<Slider
										value={[threshold.threshold]}
										onValueChange={(value) =>
											handleThresholdChange(threshold.id, value[0])
										}
										max={
											threshold.id === 'traffic'
												? 2000
												: threshold.id === 'latency'
												? 1000
												: 100
										}
										min={
											threshold.id === 'traffic'
												? 100
												: threshold.id === 'latency'
												? 10
												: 1
										}
										step={
											threshold.id === 'traffic'
												? 50
												: threshold.id === 'latency'
												? 10
												: 1
										}
										className="w-full"
										disabled={!threshold.enabled}
									/>
								</div>
								<Separator />
							</div>
						))}
					</CardContent>
				</Card>
			</motion.div>

			{/* System Status */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				<Card className="bg-card border-yellow-500/20 rounded-2xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-yellow-300">
							<Activity className="h-5 w-5 text-yellow-400" />
							Estado del sistema
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-green-950/30 to-green-900/20 border border-green-500/30">
								<div>
									<p className="text-sm font-medium text-green-200">
										Simulación
									</p>
									<p className="text-xs text-green-300/60">Estado actual</p>
								</div>
								<Badge className="bg-green-500/20 text-green-300 border border-green-500/50">
									<Activity className="w-3 h-3 mr-1" />
									Activa
								</Badge>
							</div>
							<div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-purple-950/30 to-purple-900/20 border border-purple-500/30">
								<div>
									<p className="text-sm font-medium text-purple-200">
										Dispositivos
									</p>
									<p className="text-xs text-purple-300/60">Conectados en tiempo real</p>
								</div>
								<motion.span 
									className="text-lg font-bold text-purple-300"
									key={networkDevices.filter((d) => d.enabled).length}
									initial={{ scale: 1.3, color: '#a855f7' }}
									animate={{ scale: 1, color: '#d8b4fe' }}
									transition={{ duration: 0.3 }}
								>
									{networkDevices.filter((d) => d.enabled).length}
								</motion.span>
							</div>
							<div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-orange-950/30 to-orange-900/20 border border-orange-500/30">
								<div>
									<p className="text-sm font-medium text-orange-200">Alertas</p>
									<p className="text-xs text-orange-300/60">
										Activas en el sistema
									</p>
								</div>
								<motion.span 
									className="text-lg font-bold text-orange-300"
									key={simulatedAlerts?.filter(a => !a.resolved).length || 0}
									initial={{ scale: 1.3, color: '#fb923c' }}
									animate={{ scale: 1, color: '#fdba74' }}
									transition={{ duration: 0.3 }}
								>
									{simulatedAlerts?.filter(a => !a.resolved).length || 0}
								</motion.span>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}
