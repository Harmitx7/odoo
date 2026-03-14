"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Warehouse, Plus, MapPin, X, Check } from "lucide-react";

function InlineForm({
  placeholder,
  label,
  onSave,
  onCancel,
  isPending,
  secondaryField,
}: {
  placeholder: string;
  label: string;
  onSave: (primary: string, secondary: string) => void;
  onCancel: () => void;
  isPending: boolean;
  secondaryField?: { placeholder: string; label: string };
}) {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            autoFocus
            type="text"
            className="w-full h-9 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            placeholder={placeholder}
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
          />
        </div>
        {secondaryField && (
          <div>
            <input
              type="text"
              className="w-full h-9 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              placeholder={secondaryField.placeholder}
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 gap-1.5 h-8 text-xs"
          disabled={!primary.trim() || isPending}
          onClick={() => onSave(primary.trim(), secondary.trim())}
        >
          <Check className="w-3.5 h-3.5" />
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={onCancel}>
          <X className="w-3.5 h-3.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function WarehouseSettingsPage() {
  const utils = trpc.useUtils();
  const { data: warehouses, isLoading } = trpc.warehouses.list.useQuery();

  const [showNewWh, setShowNewWh] = useState(false);
  const [addingLocationFor, setAddingLocationFor] = useState<string | null>(null);

  const createWh = trpc.warehouses.create.useMutation({
    onSuccess: () => {
      utils.warehouses.list.invalidate();
      setShowNewWh(false);
    },
  });

  const addLocation = trpc.warehouses.addLocation.useMutation({
    onSuccess: () => {
      utils.warehouses.list.invalidate();
      setAddingLocationFor(null);
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Settings / Warehouses</p>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Settings</h1>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          onClick={() => setShowNewWh(true)}
          disabled={showNewWh}
        >
          <Plus className="w-4 h-4" />
          New Warehouse
        </Button>
      </div>

      {/* New Warehouse form */}
      {showNewWh && (
        <InlineForm
          label="New Warehouse"
          placeholder="Warehouse name"
          secondaryField={{ placeholder: "Short code (e.g. WH-NY)", label: "Code" }}
          isPending={createWh.isPending}
          onCancel={() => setShowNewWh(false)}
          onSave={(name, shortCode) => {
            if (!shortCode) return;
            createWh.mutate({ name, shortCode });
          }}
        />
      )}
      {createWh.isError && (
        <p className="text-sm text-red-500">{createWh.error.message}</p>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
        </div>
      ) : !warehouses?.length ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Warehouse className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">No warehouses yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Create your first warehouse to start assigning stock locations.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Warehouse className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{wh.name}</h2>
                    <p className="text-xs text-gray-500 font-mono">{wh.shortCode}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                    wh.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {wh.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              {wh.address && (
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  {wh.address}
                </p>
              )}

              {/* Locations */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Storage Locations
                </p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {wh.locations.map((loc) => (
                    <div key={loc.id} className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-sm font-medium text-gray-900">{loc.name}</p>
                      {loc.code && (
                        <p className="text-xs text-gray-400 font-mono">{loc.code}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add location form */}
                {addingLocationFor === wh.id ? (
                  <InlineForm
                    label={`Add location to ${wh.name}`}
                    placeholder="Location name (e.g. Rack A)"
                    secondaryField={{ placeholder: "Code (optional)", label: "Code" }}
                    isPending={addLocation.isPending}
                    onCancel={() => setAddingLocationFor(null)}
                    onSave={(name, code) =>
                      addLocation.mutate({
                        warehouseId: wh.id,
                        name,
                        code: code || undefined,
                      })
                    }
                  />
                ) : (
                  <button
                    className="mt-1 bg-gray-50 rounded-lg px-3 py-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors text-sm flex items-center gap-1.5 w-full justify-center"
                    onClick={() => setAddingLocationFor(wh.id)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Location
                  </button>
                )}
                {addLocation.isError && addingLocationFor === wh.id && (
                  <p className="text-sm text-red-500 mt-2">{addLocation.error.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
