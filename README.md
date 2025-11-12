# 🌐 IoT Dashboard - Sistema de Monitoreo en Tiempo Real

<div align="center">

![Dashboard Preview](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Sistema completo de monitoreo y gestión de dispositivos IoT con actualización en tiempo real**

[📖 Documentación](#documentación) • [🚀 Inicio Rápido](#inicio-rápido) • [✨ Características](#características) • [📊 API](#api-de-simulación)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Inicio Rápido](#inicio-rápido)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos Principales](#módulos-principales)
- [API de Simulación](#api-de-simulación)
- [Personalización](#personalización)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## 🎯 Descripción

**IoT Dashboard** es una plataforma web moderna y completa para el monitoreo en tiempo real de dispositivos IoT en redes SDN (Software-Defined Networking). El sistema ofrece visualización de telemetría, gestión de dispositivos, sistema de alertas y configuración avanzada, todo con actualización automática cada segundo.

### 🎨 Características Principales

- ⚡ **Actualización en Tiempo Real**: Datos actualizados cada 1 segundo
- 📊 **Visualización Avanzada**: Gráficos interactivos con Recharts
- 🎭 **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- 🔔 **Sistema de Alertas**: Notificaciones con 4 niveles de severidad
- 🌡️ **Monitoreo de Telemetría**: CPU, memoria, temperatura, humedad y más
- 🔧 **Gestión de Dispositivos**: CRUD completo de dispositivos IoT
- 🌓 **Tema Oscuro**: Interfaz moderna con modo oscuro
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- 🔐 **TypeScript**: Código tipado para mayor seguridad

---

## ✨ Características

### 🏠 Dashboard Principal
- Estadísticas en tiempo real de dispositivos conectados
- Gráficos de tráfico de red en vivo
- Distribución de tipos de dispositivos (Pie Chart)
- Últimas alertas del sistema
- Tarjetas interactivas con información detallada

### 📡 Monitoreo de Telemetría
- Visualización de métricas en tiempo real
- Gráficos históricos (Line & Area Charts)
- Selección dinámica de métricas a monitorear
- Estadísticas: actual, promedio, mínimo, máximo
- Tendencias automáticas (subida/bajada/estable)
- Soporte para múltiples dispositivos

### 🚨 Sistema de Alertas
- 5 tipos de alertas: Seguridad, Red, Dispositivo, Sistema, Rendimiento
- 4 niveles de severidad: Crítico, Alto, Medio, Bajo
- Filtrado por tipo y severidad
- Resolución de alertas
- Búsqueda en tiempo real
- Contador de alertas activas

### 🔌 Gestión de Dispositivos
- Listado completo de dispositivos IoT
- Estados: Activo, Inactivo, Sospechoso
- Información detallada: IP, MAC, Protocolo, CPU, Memoria
- Filtrado por estado y tipo
- Búsqueda en tiempo real
- Estadísticas por categorías

### ⚙️ Configuración
- Configuración de red (Gateway, DNS, DHCP)
- Gestión de dispositivos en la red
- Umbrales de alertas configurables
- Sliders interactivos para ajustes
- Panel de control centralizado

---

## 🛠️ Tecnologías

### Frontend
- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 3.4** - Estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **Recharts** - Gráficos interactivos
- **Lucide React** - Iconos modernos
- **Radix UI** - Componentes accesibles

### Backend/API
- **Next.js API Routes** - API interna
- **Simulación en Tiempo Real** - Generación de datos IoT

### Herramientas de Desarrollo
- **pnpm** - Gestor de paquetes rápido
- **ESLint** - Linter de código
- **PostCSS** - Procesador CSS
- **TypeScript Compiler** - Compilador TS

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.17.0 (Recomendado: 20.x LTS)
- **pnpm** >= 8.0.0 (o npm/yarn)
- **Git** (opcional, para clonar el repositorio)

### Verificar Versiones

```bash
node --version  # v20.x.x
pnpm --version  # 8.x.x
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/IngBenichi/Monitoreo-Dispositivos-IOT.git
cd Monitoreo-Dispositivos-IOT
```

### 2. Instalar Dependencias

```bash
# Usando pnpm (recomendado)
pnpm install

# O usando npm
npm install

# O usando yarn
yarn install
```

### 3. Configurar Variables de Entorno (Opcional)

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Puerto del servidor (opcional)
PORT=3000

# Otras configuraciones según necesidad
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🎯 Inicio Rápido

### Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# La aplicación estará disponible en:
# http://localhost:3000
```

### Modo Producción

```bash
# Compilar para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Scripts Disponibles

```bash
pnpm dev          # Inicia el servidor de desarrollo
pnpm build        # Compila para producción
pnpm start        # Inicia el servidor de producción
pnpm lint         # Ejecuta el linter
```

---

## 📁 Estructura del Proyecto

```
IOT-Dashboard-main/
├── app/                          # App Router de Next.js
│   ├── page.tsx                  # Página principal (Dashboard)
│   ├── layout.tsx                # Layout raíz
│   ├── globals.css               # Estilos globales
│   ├── alerts/                   # Módulo de Alertas
│   │   └── page.tsx
│   ├── config/                   # Módulo de Configuración
│   │   └── page.tsx
│   ├── devices/                  # Módulo de Dispositivos
│   │   └── page.tsx
│   ├── telemetry/                # Módulo de Telemetría
│   │   └── page.tsx
│   └── api/                      # API Routes
│       └── simulate/             # API de Simulación
│           └── route.ts
│
├── components/                   # Componentes React
│   ├── alerts-system.tsx         # Sistema de alertas
│   ├── configuration-page.tsx    # Página de configuración
│   ├── dashboard-home.tsx        # Dashboard principal
│   ├── dashboard-layout.tsx      # Layout del dashboard
│   ├── devices-management.tsx    # Gestión de dispositivos
│   ├── stat-card.tsx            # Tarjeta de estadísticas
│   ├── telemetry-monitoring.tsx  # Monitoreo de telemetría
│   ├── theme-provider.tsx        # Proveedor de tema
│   └── ui/                       # Componentes UI reutilizables
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── table.tsx
│       └── ... (más componentes)
│
├── hooks/                        # Custom Hooks
│   ├── use-simulation.ts         # Hook de simulación
│   ├── use-mobile.ts            # Hook para detección móvil
│   └── use-toast.ts             # Hook para notificaciones
│
├── lib/                          # Utilidades y configuración
│   ├── utils.ts                 # Funciones auxiliares
│   └── thingsboard-api.ts       # API de ThingsBoard (legacy)
│
├── public/                       # Archivos estáticos
│
├── styles/                       # Estilos adicionales
│   └── globals.css
│
├── components.json               # Configuración de componentes UI
├── next.config.mjs              # Configuración de Next.js
├── tailwind.config.ts           # Configuración de Tailwind
├── tsconfig.json                # Configuración de TypeScript
├── postcss.config.mjs           # Configuración de PostCSS
├── package.json                 # Dependencias del proyecto
└── README.md                    # Este archivo
```

---

## 🧩 Módulos Principales

### 1. Dashboard (`/`)
Panel principal con resumen del sistema:
- 4 tarjetas de estadísticas principales
- Gráfico de tráfico en tiempo real
- Distribución de dispositivos (Pie Chart)
- Últimas 3 alertas del sistema

### 2. Dispositivos IoT (`/devices`)
Gestión completa de dispositivos:
- Tabla con todos los dispositivos
- Filtros por estado y tipo
- Búsqueda en tiempo real
- Estadísticas por categoría
- Información detallada (IP, MAC, CPU, Memoria)

### 3. Telemetría (`/telemetry`)
Monitoreo de métricas en tiempo real:
- Selección de dispositivo
- Selección de métricas a visualizar
- Gráficos Line Chart y Area Chart
- Estadísticas: actual, promedio, min, max
- Control de actualización en tiempo real

### 4. Alertas (`/alerts`)
Sistema de notificaciones y alertas:
- Listado completo de alertas
- Filtros por tipo y severidad
- Búsqueda en tiempo real
- Resolución de alertas
- Contador de alertas activas

### 5. Configuración (`/config`)
Panel de configuración del sistema:
- Configuración de red
- Tabla de dispositivos en la red
- Umbrales de alertas con sliders
- Estadísticas en tiempo real

---

## 📊 API de Simulación

El sistema incluye una API de simulación completa que genera datos IoT en tiempo real.

### Endpoint Principal

```
GET /api/simulate?module={module}
```

### Módulos Disponibles

#### 1. Todos los Datos
```bash
GET /api/simulate?module=all
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "devices": [...],
    "telemetry": {...},
    "alerts": [...],
    "dashboard": {...}
  }
}
```

#### 2. Dispositivos
```bash
GET /api/simulate?module=devices
```

Genera 15 dispositivos IoT con:
- 12 tipos diferentes (Sensor de Temperatura, Router, Gateway, etc.)
- Estados: active, inactive, suspicious
- Información: IP, MAC, Protocolo, CPU, Memoria, Temperatura
- Última actividad

#### 3. Telemetría
```bash
GET /api/simulate?module=telemetry
GET /api/simulate?module=telemetry&deviceId=1
```

Genera métricas:
- CPU, Memoria, Temperatura, Humedad
- Presión, Velocidad, Voltaje, Corriente
- Luminosidad, Ruido, CO2, Partículas
- Datos históricos (últimos 20 puntos)

#### 4. Alertas
```bash
GET /api/simulate?module=alerts
```

Genera alertas con:
- 5 tipos: Seguridad, Red, Dispositivo, Sistema, Rendimiento
- 4 severidades: Crítico, Alto, Medio, Bajo
- Estado: resueltas/no resueltas
- Timestamp y detalles

#### 5. Dashboard
```bash
GET /api/simulate?module=dashboard
```

Estadísticas generales:
- Total de dispositivos
- Dispositivos activos/inactivos
- Tipos de dispositivos
- Alertas activas/críticas
- Promedios de temperatura, CPU, memoria
- Latencia de red y uptime

### Control de Simulación

```bash
# Iniciar simulación
POST /api/simulate
{
  "action": "start"
}

# Pausar simulación
POST /api/simulate
{
  "action": "stop"
}

# Resetear simulación
POST /api/simulate
{
  "action": "reset"
}
```

---

## 🎨 Personalización

### Colores y Tema

Edita `tailwind.config.ts` para personalizar colores:

```typescript
theme: {
  extend: {
    colors: {
      // Personaliza tus colores aquí
      primary: {...},
      secondary: {...},
    }
  }
}
```

### Intervalos de Actualización

Modifica los intervalos en cada componente:

```typescript
// Cambiar de 1000ms (1s) a 5000ms (5s)
const { devices } = useSimulatedDevices(5000)
```

### Datos de Simulación

Edita `app/api/simulate/route.ts` para personalizar:
- Número de dispositivos
- Tipos de dispositivos
- Rangos de valores de telemetría
- Tipos y severidad de alertas

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno (si las tienes)
3. Despliega automáticamente

```bash
# O usando Vercel CLI
vercel
```

### Netlify

```bash
# Build command
pnpm build

# Publish directory
.next
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t iot-dashboard .
docker run -p 3000:3000 iot-dashboard
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa TypeScript para todo el código
- Sigue las convenciones de React Hooks
- Documenta funciones complejas
- Mantén componentes pequeños y reutilizables
- Usa Tailwind CSS para estilos

---

## 📝 Documentación Adicional

### Hooks Personalizados

#### `useSimulatedDevices(refreshInterval)`
Obtiene la lista de dispositivos IoT simulados.

```typescript
const { devices, loading, error, refetch } = useSimulatedDevices(1000)
```

#### `useSimulatedTelemetry(deviceId?, refreshInterval)`
Obtiene telemetría de un dispositivo específico o de todos.

```typescript
const { telemetry, loading, error, refetch } = useSimulatedTelemetry(1, 1000)
```

#### `useSimulatedAlerts(refreshInterval)`
Obtiene las alertas del sistema.

```typescript
const { alerts, loading, error, refetch } = useSimulatedAlerts(1000)
```

#### `useSimulatedDashboard(refreshInterval)`
Obtiene estadísticas generales del dashboard.

```typescript
const { dashboard, loading, error, refetch } = useSimulatedDashboard(1000)
```

---

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Limpiar caché y reinstalar
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Errores de TypeScript

```bash
# Verificar configuración
pnpm tsc --noEmit
```

### Problemas con pnpm

```bash
# Usar npm como alternativa
npm install
npm run dev
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**IngBenichi**

- GitHub: [@IngBenichi](https://github.com/IngBenichi)
- Repositorio: [Monitoreo-Dispositivos-IOT](https://github.com/IngBenichi/Monitoreo-Dispositivos-IOT)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Recharts](https://recharts.org/) - Gráficos
- [Radix UI](https://www.radix-ui.com/) - Componentes UI
- [Lucide](https://lucide.dev/) - Iconos

---

## 📊 Características Futuras

- [ ] Integración con ThingsBoard real
- [ ] Autenticación y autorización
- [ ] Exportación de datos (CSV, JSON)
- [ ] Notificaciones push
- [ ] Modo claro/oscuro toggle
- [ ] Soporte multi-idioma
- [ ] Panel de administración
- [ ] Reportes programados
- [ ] API REST completa
- [ ] WebSocket para datos en vivo

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

Desarrollado con ❤️ por [IngBenichi](https://github.com/IngBenichi)

</div>
