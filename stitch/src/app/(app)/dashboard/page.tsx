"use client";

import { trpc } from "@/lib/trpc";
import { Package, AlertTriangle, AlertCircle, Clock, Truck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function KpiCard({
  icon: Icon,
  color,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  color: "indigo" | "amber" | "red" | "blue" | "purple";
  label: string;
  value?: number;
  href?: string;
}) {
  const theme = {
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-100/50 hover:shadow-glow-indigo",
    amber: "bg-amber-500/10 text-amber-600 border-amber-100/50 hover:shadow-glow-amber",
    red: "bg-red-500/10 text-red-600 border-red-100/50 hover:shadow-glow-red",
    blue: "bg-blue-500/10 text-blue-600 border-blue-100/50 hover:shadow-glow-indigo",
    purple: "bg-purple-500/10 text-purple-600 border-purple-100/50 hover:shadow-glow-indigo",
  }[color];

  const content = (
    <div className={cn(
      "group relative bg-white/80 backdrop-blur-xl rounded-2xl border p-5 flex items-start gap-4 transition-all duration-500 ease-spring hover:-translate-y-1 hover:shadow-xl",
      theme
    )}>
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 ease-spring group-hover:scale-110 group-hover:rotate-3",
        color === "indigo" ? "bg-indigo-600 text-white" : "",
        color === "amber" ? "bg-amber-500 text-white" : "",
        color === "red" ? "bg-red-500 text-white" : "",
        color === "blue" ? "bg-blue-500 text-white" : "",
        color === "purple" ? "bg-purple-500 text-white" : "",
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-500 transition-colors">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-gray-900 tracking-tight">
            {value === undefined ? (
              <span className="inline-block w-12 h-8 bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              value.toLocaleString()
            )}
          </p>
          {value !== undefined && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Units</span>}
        </div>
      </div>
      
      {/* Decorative Spatial Element */}
      <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
        <Icon className="w-12 h-12 rotate-[-15deg]" />
      </div>
    </div>
  );
  return href ? <Link href={href} className="no-underline">{content}</Link> : content;
}

export default function DashboardPage() {
  const { data: kpis } = trpc.dashboard.kpis.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const { data: alerts } = trpc.dashboard.alerts.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Pages / Dashboard</p>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Overview of your warehouse operations and inventory status.
        </p>
      </div>

      {/* KPI Cards — links navigate to filtered list views */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <KpiCard
          icon={Package}
          color="indigo"
          label="Total Products"
          value={kpis?.totalProducts}
          href="/products"
        />
        <KpiCard
          icon={AlertTriangle}
          color="amber"
          label="Low Stock"
          value={kpis?.lowStock}
          href="/products?filter=low_stock"
        />
        <KpiCard
          icon={AlertCircle}
          color="red"
          label="Out of Stock"
          value={kpis?.outOfStock}
          href="/products?filter=out_of_stock"
        />
        <KpiCard
          icon={Clock}
          color="blue"
          label="Pending Receipts"
          value={kpis?.pendingReceipts}
          href="/operations/receipts?status=waiting"
        />
        <KpiCard
          icon={Truck}
          color="purple"
          label="Pending Deliveries"
          value={kpis?.pendingDeliveries}
          href="/operations/delivery?status=waiting"
        />
      </div>

      {/* Alerts Center */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-gray-900 text-sm">Low Stock Alerts</h2>
          </div>
          <Link href="/products?filter=low_stock" className="text-xs text-indigo-600 hover:underline">
            View All Critical Stock
          </Link>
        </div>
        {!alerts?.length ? (
          <p className="text-xs text-gray-500 py-4 text-center">No critical stock levels detected. Warehouse is healthy.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tight">{alert.sku} • {alert.location.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-700">{alert.quantity} Left</p>
                  <p className="text-[10px] text-amber-600 italic leading-none">Min: {alert.minQty}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Operations */}
      <div className="grid grid-cols-2 gap-4">
        {/* Receipts */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-gray-900 text-sm">Receipt Operations</h2>
            </div>
            <Link href="/operations/receipts" className="text-xs text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {kpis?.receiptOps.toReceive ?? "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">TO RECEIVE</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {kpis?.receiptOps.inInspection ?? "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">IN INSPECTION</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {kpis?.receiptOps.completed ?? "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">COMPLETED</p>
            </div>
          </div>
          {kpis && kpis.receiptOps.toReceive > 0 && (
            <div className="flex gap-2 mt-4">
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                +{kpis.receiptOps.toReceive} Pending Shipment{kpis.receiptOps.toReceive !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Deliveries */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-gray-900 text-sm">Delivery Operations</h2>
            </div>
            <Link href="/operations/delivery" className="text-xs text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {kpis?.deliveryOps.picking ?? "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">PICKING</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {kpis?.deliveryOps.packing ?? "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">PACKING</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {kpis?.deliveryOps.dispatched ?? "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">DISPATCHED</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
              Live data · refreshes every 30s
            </span>
          </div>
        </div>
      </div>

      {/* Performance Banner */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-indigo-600 text-sm">Warehouse performance is tracking live</p>
            <p className="text-xs text-gray-500">Dashboard KPIs auto-refresh every 30 seconds.</p>
          </div>
        </div>
        <Link
          href="/move-history"
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          View Ledger
        </Link>
      </div>
    </div>
  );
}
