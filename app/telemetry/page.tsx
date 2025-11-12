import { DashboardLayout } from '@/components/dashboard-layout'
import { TelemetryMonitoring } from '@/components/telemetry-monitoring'

export default function TelemetryPage() {
	return (
		<DashboardLayout>
			<TelemetryMonitoring />
		</DashboardLayout>
	)
}
