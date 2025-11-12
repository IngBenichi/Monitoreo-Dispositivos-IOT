'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Router,
	Search,
	Shield,
	AlertTriangle,
	CheckCircle,
	Trash2,
	RefreshCw,
	Plus,
	Edit,
	Eye,
	X,
	Save,
	Wifi,
	WifiOff,
	Activity,
	Zap,
	Database,
	Server,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useSimulatedDevices, type SimulatedDevice } from '@/hooks/use-simulation'

interface Device {
	id: number
	name: string
	type: string
	label: string
	status: 'active' | 'inactive' | 'suspicious'
	lastActivity: string
	mac: string
	ip: string
	protocol: string
	cpu: number
	memory: number
	temperature: number
}

const statusConfig = {
	active: {
		label: 'Activo',
		variant: 'default' as const,
		icon: CheckCircle,
		color: 'text-green-400',
		bgColor: 'bg-green-500/10',
	},
	inactive: {
		label: 'Inactivo',
		variant: 'destructive' as const,
		icon: Shield,
		color: 'text-red-400',
		bgColor: 'bg-red-500/10',
	},
	suspicious: {
		label: 'Sospechoso',
		variant: 'secondary' as const,
		icon: AlertTriangle,
		color: 'text-yellow-400',
		bgColor: 'bg-yellow-500/10',
	},
}

export function DevicesManagement() {
	// Usar datos simulados - actualiza cada 1 segundo
	const { devices: simulatedDevices, loading, refetch } = useSimulatedDevices(1000)
	const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [typeFilter, setTypeFilter] = useState<string>('all')

	// CRUD States
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [showViewModal, setShowViewModal] = useState(false)
	const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	// Form states
	const [formData, setFormData] = useState({
		name: '',
		type: '',
		label: '',
	})

	// Transformar dispositivos simulados al formato local
	const devices: Device[] = (simulatedDevices || []).map((device: SimulatedDevice) => {
		// Mapear el status a los valores válidos
		let status: 'active' | 'inactive' | 'suspicious' = 'active'
		if (device.status === 'inactive') {
			status = 'inactive'
		} else if (device.status === 'suspicious' || device.status === 'warning') {
			status = 'suspicious'
		} else {
			status = 'active'
		}

		return {
			id: device.id,
			name: device.type,
			type: device.type,
			label: device.protocol,
			status: status,
			lastActivity: device.lastActivity,
			mac: device.mac,
			ip: device.ip,
			protocol: device.protocol,
			cpu: device.cpu,
			memory: device.memory,
			temperature: device.temperature,
		}
	})

	// Filtrar dispositivos
	useEffect(() => {
		let filtered = devices

		if (searchTerm) {
			filtered = filtered.filter(
				(d) =>
					d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
					d.label?.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		if (statusFilter !== 'all') {
			filtered = filtered.filter((d) => d.status === statusFilter)
		}

		if (typeFilter !== 'all') {
			filtered = filtered.filter((d) => d.type === typeFilter)
		}

		setFilteredDevices(filtered)
	}, [devices, searchTerm, statusFilter, typeFilter])

	const getStatusStats = () => {
		const stats = {
			total: devices.length,
			active: devices.filter((d) => d.status === 'active').length,
			inactive: devices.filter((d) => d.status === 'inactive').length,
			suspicious: devices.filter((d) => d.status === 'suspicious').length,
		}
		return stats
	}

	const uniqueTypes = Array.from(new Set(devices.map((d) => d.type)))
	const stats = getStatusStats()

	// CRUD Operations (simuladas)
	const handleCreateDevice = async () => {
		if (!formData.name || !formData.type) {
			alert('Por favor completa nombre y tipo')
			return
		}

		setIsSaving(true)
		try {
			// En modo simulación, solo mostramos un mensaje
			alert('Dispositivo creado exitosamente (simulación)')
			setShowCreateModal(false)
			setFormData({ name: '', type: '', label: '' })
			refetch()
		} catch (error) {
			console.error('Error creating device:', error)
			alert('Error al crear dispositivo')
		} finally {
			setIsSaving(false)
		}
	}

	const handleEditDevice = (device: Device) => {
		setSelectedDevice(device)
		setFormData({
			name: device.name,
			type: device.type,
			label: device.label || '',
		})
		setShowEditModal(true)
	}

	const handleUpdateDevice = async () => {
		if (!selectedDevice || !formData.name || !formData.type) {
			alert('Por favor completa nombre y tipo')
			return
		}

		setIsSaving(true)
		try {
			// En modo simulación, solo mostramos un mensaje
			alert('Dispositivo actualizado exitosamente (simulación)')
			setShowEditModal(false)
			setSelectedDevice(null)
			setFormData({ name: '', type: '', label: '' })
			refetch()
		} catch (error) {
			console.error('Error updating device:', error)
			alert('Error al actualizar dispositivo')
		} finally {
			setIsSaving(false)
		}
	}

	const handleDeleteDevice = async (deviceId: number) => {
		if (!confirm('¿Estás seguro de eliminar este dispositivo?')) return

		setIsDeleting(true)
		try {
			// En modo simulación, solo mostramos un mensaje
			alert('Dispositivo eliminado exitosamente (simulación)')
			refetch()
		} catch (error) {
			console.error('Error deleting device:', error)
			alert('Error al eliminar dispositivo')
		} finally {
			setIsDeleting(false)
		}
	}

	const handleViewDevice = (device: Device) => {
		setSelectedDevice(device)
		setShowViewModal(true)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex flex-col items-center gap-4">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
					<p className="text-muted-foreground">Cargando dispositivos...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Page header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-transparent">
						Dispositivos IoT
					</h1>
					<p className="text-green-200/70 mt-2 flex items-center gap-2">
						Gestión completa de dispositivos conectados (Simulación en tiempo real)
						<Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/50">
							<Zap className="w-3 h-3 mr-1" />
							Actualización cada 1s
						</Badge>
					</p>
				</div>
				<Button
					onClick={() => setShowCreateModal(true)}
					className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/50"
				>
					<Plus className="h-4 w-4 mr-2" />
					Nuevo Dispositivo
				</Button>
			</div>

			{/* Stats cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatsCard
					title="Total"
					value={stats.total}
					icon={Router}
					color="purple"
					delay={0.1}
				/>
				<StatsCard
					title="Activos"
					value={stats.active}
					icon={CheckCircle}
					color="green"
					delay={0.2}
				/>
				<StatsCard
					title="Inactivos"
					value={stats.inactive}
					icon={Shield}
					color="red"
					delay={0.3}
				/>
				<StatsCard
					title="Sospechosos"
					value={stats.suspicious}
					icon={AlertTriangle}
					color="yellow"
					delay={0.4}
				/>
			</div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				<Card className="bg-card border-border rounded-2xl">
					<CardHeader>
						<CardTitle className="text-foreground flex items-center gap-2">
							<Search className="h-5 w-5 text-purple-400" />
							Filtros y Búsqueda
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-center">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400/50" />
								<Input
									placeholder="Buscar por nombre, tipo o etiqueta..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 bg-slate-800/50 border border-purple-500/30 text-purple-100 placeholder:text-purple-400/40 focus:border-purple-400/60"
								/>
							</div>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="w-full md:w-48 h-9 px-3 rounded-md bg-slate-800/50 border border-purple-500/30 text-purple-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
							>
								<option value="all">Todos los estados</option>
								<option value="active">Activo</option>
								<option value="inactive">Inactivo</option>
								<option value="suspicious">Sospechoso</option>
							</select>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className="w-full md:w-48 h-9 px-3 rounded-md bg-slate-800/50 border border-purple-500/30 text-purple-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
							>
								<option value="all">Todos los tipos</option>
								{uniqueTypes.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							<Button
								onClick={() => refetch()}
								variant="outline"
								size="icon"
								className="bg-slate-800/50 border border-purple-500/30 text-purple-100 hover:bg-purple-500/20"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Devices table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
			>
				<Card className="bg-card border-border rounded-2xl">
					<CardHeader>
						<CardTitle className="text-foreground">
							Dispositivos ({filteredDevices.length} de {devices.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg border border-border overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="border-border">
										<TableHead className="text-muted-foreground">
											Nombre
										</TableHead>
										<TableHead className="text-muted-foreground">
											Tipo
										</TableHead>
										<TableHead className="text-muted-foreground">
											Etiqueta
										</TableHead>
										<TableHead className="text-muted-foreground">
											Estado
										</TableHead>
										<TableHead className="text-muted-foreground">
											Última actividad
										</TableHead>
										<TableHead className="text-muted-foreground">
											Acciones
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredDevices.map((device) => {
										const statusInfo = statusConfig[device.status]
										const StatusIcon = statusInfo.icon

										return (
											<TableRow key={device.id} className="border-border">
												<TableCell className="font-medium text-foreground">
													{device.name}
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className="bg-purple-500/10 text-purple-300 border-purple-500/30"
													>
														{device.type}
													</Badge>
												</TableCell>
												<TableCell className="text-muted-foreground">
													{device.label || '-'}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<StatusIcon
															className={`h-4 w-4 ${statusInfo.color}`}
														/>
														<Badge
															variant={statusInfo.variant}
															className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}
														>
															{statusInfo.label}
														</Badge>
													</div>
												</TableCell>
												<TableCell className="text-muted-foreground">
													{device.lastActivity}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleViewDevice(device)}
															className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
															title="Ver detalles"
														>
															<Eye className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleEditDevice(device)}
															className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
															title="Editar dispositivo"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleDeleteDevice(device.id)}
															disabled={isDeleting}
															className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
															title="Eliminar dispositivo"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Create Device Modal */}
			<AnimatePresence>
				{showCreateModal && (
					<Modal
						title="Crear Nuevo Dispositivo"
						onClose={() => setShowCreateModal(false)}
					>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-purple-200 mb-2 block">
									Nombre del dispositivo *
								</label>
								<Input
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="Ej: Sensor-Temperatura-01"
									className="bg-slate-800/50 border-purple-500/30 text-purple-100"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-purple-200 mb-2 block">
									Tipo de dispositivo *
								</label>
								<Input
									value={formData.type}
									onChange={(e) =>
										setFormData({ ...formData, type: e.target.value })
									}
									placeholder="Ej: sensor, actuador, gateway"
									className="bg-slate-800/50 border-purple-500/30 text-purple-100"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-purple-200 mb-2 block">
									Etiqueta (opcional)
								</label>
								<Input
									value={formData.label}
									onChange={(e) =>
										setFormData({ ...formData, label: e.target.value })
									}
									placeholder="Ej: Oficina Principal"
									className="bg-slate-800/50 border-purple-500/30 text-purple-100"
								/>
							</div>
							<div className="flex gap-3 pt-4">
								<Button
									onClick={handleCreateDevice}
									disabled={isSaving}
									className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
								>
									{isSaving ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Creando...
										</>
									) : (
										<>
											<Save className="h-4 w-4 mr-2" />
											Crear Dispositivo
										</>
									)}
								</Button>
								<Button
									onClick={() => setShowCreateModal(false)}
									variant="outline"
									className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
								>
									Cancelar
								</Button>
							</div>
						</div>
					</Modal>
				)}
			</AnimatePresence>

			{/* Edit Device Modal */}
			<AnimatePresence>
				{showEditModal && selectedDevice && (
					<Modal
						title="Editar Dispositivo"
						onClose={() => {
							setShowEditModal(false)
							setSelectedDevice(null)
							setFormData({ name: '', type: '', label: '' })
						}}
					>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-green-200 mb-2 block">
									Nombre del dispositivo *
								</label>
								<Input
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="Ej: Sensor-Temperatura-01"
									className="bg-slate-800/50 border-green-500/30 text-green-100"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-green-200 mb-2 block">
									Tipo de dispositivo *
								</label>
								<Input
									value={formData.type}
									onChange={(e) =>
										setFormData({ ...formData, type: e.target.value })
									}
									placeholder="Ej: sensor, actuador, gateway"
									className="bg-slate-800/50 border-green-500/30 text-green-100"
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-green-200 mb-2 block">
									Etiqueta (opcional)
								</label>
								<Input
									value={formData.label}
									onChange={(e) =>
										setFormData({ ...formData, label: e.target.value })
									}
									placeholder="Ej: Oficina Principal"
									className="bg-slate-800/50 border-green-500/30 text-green-100"
								/>
							</div>
							<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
								<p className="text-xs text-blue-300">
									💡 <strong>ID:</strong> {selectedDevice.id}
								</p>
								<p className="text-xs text-blue-300 mt-1">
									📅 <strong>Creado:</strong> {selectedDevice.lastActivity}
								</p>
							</div>
							<div className="flex gap-3 pt-4">
								<Button
									onClick={handleUpdateDevice}
									disabled={isSaving}
									className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
								>
									{isSaving ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Guardando...
										</>
									) : (
										<>
											<Save className="h-4 w-4 mr-2" />
											Guardar Cambios
										</>
									)}
								</Button>
								<Button
									onClick={() => {
										setShowEditModal(false)
										setSelectedDevice(null)
										setFormData({ name: '', type: '', label: '' })
									}}
									variant="outline"
									className="flex-1 border-green-500/30 text-green-300 hover:bg-green-500/10"
								>
									Cancelar
								</Button>
							</div>
						</div>
					</Modal>
				)}
			</AnimatePresence>

			{/* View Device Modal */}
			<AnimatePresence>
				{showViewModal && selectedDevice && (
					<Modal
						title="Detalles del Dispositivo"
						onClose={() => {
							setShowViewModal(false)
							setSelectedDevice(null)
						}}
					>
						<div className="space-y-4">
							<DetailRow icon={Database} label="ID" value={selectedDevice.id} />
							<DetailRow
								icon={Server}
								label="Nombre"
								value={selectedDevice.name}
							/>
							<DetailRow icon={Zap} label="Tipo" value={selectedDevice.type} />
							<DetailRow
								icon={Activity}
								label="Etiqueta"
								value={selectedDevice.label || 'Sin etiqueta'}
							/>
							<DetailRow
								icon={statusConfig[selectedDevice.status].icon}
								label="Estado"
								value={statusConfig[selectedDevice.status].label}
								valueColor={statusConfig[selectedDevice.status].color}
							/>
							<DetailRow
								icon={Activity}
								label="Última actividad"
								value={selectedDevice.lastActivity}
							/>
						</div>
						<div className="flex gap-3 pt-6">
							<Button
								onClick={() => {
									setShowViewModal(false)
									setSelectedDevice(null)
								}}
								className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
							>
								Cerrar
							</Button>
						</div>
					</Modal>
				)}
			</AnimatePresence>
		</div>
	)
}

// Stats Card Component
function StatsCard({
	title,
	value,
	icon: Icon,
	color,
	delay,
}: {
	title: string
	value: number
	icon: any
	color: 'purple' | 'green' | 'red' | 'yellow'
	delay: number
}) {
	const colorClasses: Record<string, string> = {
		purple:
			'from-purple-600 to-purple-500 text-purple-300 border-purple-500/30 shadow-purple-500/20',
		green:
			'from-green-600 to-green-500 text-green-300 border-green-500/30 shadow-green-500/20',
		red: 'from-red-600 to-red-500 text-red-300 border-red-500/30 shadow-red-500/20',
		yellow:
			'from-yellow-600 to-yellow-500 text-yellow-300 border-yellow-500/30 shadow-yellow-500/20',
	}

	const classes = colorClasses[color] || colorClasses.purple

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/30 to-slate-900/80 border border-purple-500/30 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-blue-200">{title}</p>
							<p className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
								{value}
							</p>
						</div>
						<Icon className="h-8 w-8 text-purple-400" />
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

// Modal Component
function Modal({ title, onClose, children }: any) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				onClick={(e) => e.stopPropagation()}
				className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-purple-500/20"
			>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
						{title}
					</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="text-purple-300 hover:bg-purple-500/20"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>
				{children}
			</motion.div>
		</motion.div>
	)
}

// Detail Row Component
function DetailRow({
	icon: Icon,
	label,
	value,
	valueColor = 'text-purple-100',
}: any) {
	return (
		<div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
			<Icon className="h-5 w-5 text-purple-400 mt-0.5" />
			<div className="flex-1">
				<p className="text-sm text-purple-300/70">{label}</p>
				<p className={`text-base font-medium ${valueColor} break-all`}>
					{value}
				</p>
			</div>
		</div>
	)
}
