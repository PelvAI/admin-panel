# ALMA Platform — Admin Panel

Panel de administración de **ALMA Platform**, la línea SaaS del sistema **ALMA Health Intelligence System**. Permite al equipo clínico gestionar formularios, reglas de scoring, segmentación de usuarias y contenido del sistema.

## 🛠️ Tecnologías
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React

## 🚀 Inicio Rápido

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuración de entorno:**
   Copia `.env.example` a `.env.local` y configura la URL del backend:
   ```bash
   cp .env.example .env.local
   ```
   El valor `NEXT_PUBLIC_API_URL` debe apuntar al backend ALMA (puerto `8001` en local).

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Estructura
- `app/`: Next.js App Router (páginas y layouts).
- `components/`: Componentes reutilizables de UI.
- `lib/`: Cliente de API y utilidades compartidas.
- `public/`: Assets estáticos e íconos.

---

## 📜 Funcionalidades Clave
- **Form Builder**: Creación de cuestionarios clínicos multi-sección.
- **Rule Engine**: Gestión de lógica de scoring y alertas clínicas.
- **Target Manager**: Definición y gestión de segmentos de usuarias.
- **Diseño Responsivo**: Optimizado para gestión en escritorio.
