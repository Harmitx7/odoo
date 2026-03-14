<div align="center">
  <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/cubes-stacked.svg" width="80" alt="CoreInventory Logo" />
  <h1>CoreInventory: Ultra-Performance Architecture</h1>
  <p><strong>The Next-Generation Warehouse & Inventory Ecosystem, Engineered for Zero-Latency Operations.</strong></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Next.js_16-000000?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Engine-React_19-087EA4?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/CSS-Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Data-Neon_Serverless-00E599?style=for-the-badge&logo=postgresql" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/Safety-tRPC-2596be?style=for-the-badge&logo=typescript" alt="tRPC" />
</p>

---

## 🌌 Spatial Architecture & Pro-Max UI Design

CoreInventory isn't just a dashboard—it's a living interface built upon **cutting-edge Web standards (2026+)** utilizing the `/ui-ux-pro-max` methodology.

- 🎨 **Generative Color & Contrast**: Engineered with **OKLCH/LCH** color spaces for perceptual uniformity. Deep OLED-optimized true black backgrounds (`#000000`) paired with APCA-compliant foregrounds eliminate eye strain.
- 📐 **Fluid & Variable Typography**: System font stacks utilizing `clamp()` mathematics for fluid typography that scales instantly to any viewport device.
- 🧊 **Z-Axis Depth Mapping**: Multi-layer glassmorphism (`backdrop-filter`) and calculated, organic drop-shadows create true spatial depth, focusing cognitive load strictly on actionable data points.
- ⚡ **Zero-Wait Physics**: Linear CSS transitions are eliminated in favor of natural **spring-physics modeling (`cubic-bezier(0.34, 1.56, 0.64, 1)`)**. The UI reacts organically to touch and scroll context.
- 🧠 **Neuro-Inclusive & Adaptive**: Full automated respect for `prefers-reduced-motion`. High data-density views intelligently strip away noise to strictly adhere to maximum cognitive load thresholds.

---

## 📸 State-of-the-Art Operations

### 📊 Tactical Command Dashboard
Real-time KPI ingestion presented through high-fidelity, interactive visualizations. Anticipate low stock before it happens with zero-latency updates.
> ![Dashboard View](./public/screenshots/dashboard.png)
### 📦 Fluid Product Matrix
Advanced product catalog with dynamic filtering, real-time cross-location tracking, and smart algorithmic reorder insights.
> ![Products Catalog](./public/screenshots/products.png)
### 🚚 Seamless Workflow Pipeline
Frictionless operational status tracking for receipts, put-away queues, and outbound fulfillment, powered by optimistic UI patterns.
> ![Receipts View](./public/screenshots/receipts.png)
---

## 🛠️ The Tech Engine

- **Full-Stack Framework**: **[Next.js 16](https://nextjs.org/) (App Router)** leveraging edge-deployed Server Actions and React Server Components for highly optimized payload hydration.
- **Rendering**: **[React 19](https://react.dev/)** compiler-optimized for unmatched reconciliation speeds and concurrency.
- **Styling Architecture**: **[Tailwind CSS v4](https://tailwindcss.com/)** + **[shadcn/ui](https://ui.shadcn.com/)** integrated with container queries (`@container`) and logical properties for universal layout support.
- **Serverless Edge Data**: **[Neon Postgres](https://neon.tech/)** instantly branching via **[Drizzle ORM](https://orm.drizzle.team/)** for sub-millisecond distributed query execution.
- **End-to-End Type Safety**: **[tRPC](https://trpc.io/)** boundaries mapped dynamically with **[React Query v5](https://tanstack.com/query)**, completely eliminating runtime type errors.
- **Security**: Zero-Trust access secured via **[Auth.js (NextAuth v5)](https://authjs.dev/)**.

---

## 🚀 Ignition Sequence

### Prerequisites
- Node.js `v20+`
- A Neon Serverless PostgreSQL instance (or any compatible standard Postgres)

### Installation

1. **Setup the Core**
   ```bash
   git clone <repo-url>
   cd stitch
   npm install
   ```

2. **Environment Configuration**
   Provision a `.env.local` containing your secure connections:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
   AUTH_SECRET="your-generated-auth-secret"
   ```

3. **Database Spin-Up**
   Push the Drizzle schema to your cluster and aggressively seed it with matrix data:
   ```bash
   # Generates compiled schema
   npm run db:generate

   # Applies schema delta directly to the database
   npm run db:migrate

   # Injects initial master-data and neural demo accounts
   npm run db:seed
   ```

4. **Start the Engine**
   ```bash
   npm run dev
   ```
   *The command center is now active at [http://localhost:3000](http://localhost:3000)*

---

## 👥 Demo Access

The seeder automatically generates role-based identities for complete access demonstration.

- **Director Level (Manager)**: `manager@coreinventory.com` / `password123`
- **Operative Level (Staff)**: `staff@coreinventory.com` / `password123`
