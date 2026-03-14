"use client";

import { trpc } from "@/lib/trpc";
import { BarChart2, Download, Package, Clock, AlertTriangle, Truck } from "lucide-react";
import Link from "next/link";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-indigo-500",
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {value === undefined ? (
          <span className="inline-block w-20 h-8 bg-gray-100 animate-pulse rounded" />
        ) : (
          value
        )}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function ReportsPage() {
  const { data: kpis } = trpc.dashboard.kpis.useQuery();
  const { data: ledger } = trpc.ledger.list.useQuery({ pageSize: 5 });

  const totalMovements = ledger?.items.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Insights / Reports</p>
          <h1 className="text-2xl font-bold text-gray-900">Analytics &amp; Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Live summary of your inventory movement and operational status.
          </p>
        </div>
        <Link
          href="/move-history"
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          View Full Ledger
        </Link>
      </div>

      {/* Live KPI Stats (from dashboard router — single source of truth) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Total Active Products"
          value={kpis?.totalProducts}
          sub="Products in catalog with isActive = true"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={kpis?.lowStock}
          sub="Products below minimum reorder quantity"
          color="text-amber-500"
        />
        <StatCard
          icon={Truck}
          label="Pending Deliveries"
          value={kpis?.pendingDeliveries}
          sub="Deliveries not yet dispatched"
          color="text-purple-500"
        />
        <StatCard
          icon={Clock}
          label="Pending Receipts"
          value={kpis?.pendingReceipts}
          sub="Inbound shipments awaiting validation"
          color="text-blue-500"
        />
        <StatCard
          icon={Package}
          label="Out of Stock"
          value={kpis?.outOfStock}
          sub="Locations with on-hand quantity = 0"
          color="text-red-500"
        />
        <StatCard
          icon={BarChart2}
          label="Recent Ledger Entries"
          value={totalMovements !== undefined ? `${totalMovements} this page` : undefined}
          sub="Latest stock movements across all ops"
        />
      </div>

      {/* Recent Movements Table (dynamic from ledger) */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Recent Movement Summary</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest 5 stock ledger entries — immutable audit trail.
            </p>
          </div>
          <Link href="/move-history" className="text-xs text-indigo-600 hover:underline">
            View All →
          </Link>
        </div>

        {!ledger?.items.length ? (
          <div className="p-8 flex items-center justify-center bg-gray-50/50">
            <div className="text-center space-y-3">
              <BarChart2 className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-500 font-medium">No movements recorded yet</p>
              <p className="text-xs text-gray-400 max-w-sm">
                Create and validate a Receipt or Delivery to start tracking inventory movements.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Date", "Operation", "Product", "Location", "Delta"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ledger.items.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">{e.operationType}</td>
                  <td className="px-4 py-3 text-gray-900">{e.product?.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {e.location?.warehouse?.name} / {e.location?.name}
                  </td>
                  <td className={`px-4 py-3 font-bold ${e.quantityDelta > 0 ? "text-green-600" : "text-red-500"}`}>
                    {e.quantityDelta > 0 ? "+" : ""}{e.quantityDelta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
