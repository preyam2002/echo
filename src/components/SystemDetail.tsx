"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SolarSystem } from "@/types";

interface SystemDetailProps {
  system: SolarSystem | null;
  onClose: () => void;
}

const SystemDetail = ({ system, onClose }: SystemDetailProps) => {
  if (!system) return null;

  const securityColor =
    (system.security ?? 0) >= 0.7
      ? "text-green-400"
      : (system.security ?? 0) >= 0.4
      ? "text-yellow-400"
      : "text-red-400";

  const securityLabel =
    (system.security ?? 0) >= 0.7
      ? "High Security"
      : (system.security ?? 0) >= 0.4
      ? "Medium Security"
      : "Low Security";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="absolute top-16 left-4 z-20 w-72 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                (system.security ?? 0) >= 0.7
                  ? "bg-green-400"
                  : (system.security ?? 0) >= 0.4
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            />
            <h3 className="text-sm font-semibold text-zinc-100 truncate">
              {system.name || system.id.slice(0, 12)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Security" value={securityLabel} className={securityColor} />
            <DetailField
              label="Security Level"
              value={`${((system.security ?? 0) * 100).toFixed(0)}%`}
              className={securityColor}
            />
          </div>

          {system.region && (
            <DetailField label="Region" value={system.region} />
          )}

          {system.position && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Coordinates
              </span>
              <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded-lg px-3 py-2">
                X: {system.position[0]?.toFixed(2) ?? "?"} | Y:{" "}
                {system.position[1]?.toFixed(2) ?? "?"} | Z:{" "}
                {system.position[2]?.toFixed(2) ?? "?"}
              </div>
            </div>
          )}

          <DetailField label="System ID" value={system.id} mono />
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-zinc-800/50 bg-zinc-900/50">
          <p className="text-[10px] text-zinc-600 font-mono">
            Ask Echo for more details about this system
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const DetailField = ({
  label,
  value,
  className = "text-zinc-300",
  mono = false,
}: {
  label: string;
  value: string;
  className?: string;
  mono?: boolean;
}) => (
  <div className="space-y-0.5">
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono block">
      {label}
    </span>
    <span
      className={`text-xs ${className} ${mono ? "font-mono" : ""} block truncate`}
    >
      {value}
    </span>
  </div>
);

export default SystemDetail;
