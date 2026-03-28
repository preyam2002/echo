"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import ChatPanel from "./ChatPanel";
import SystemDetail from "./SystemDetail";
import type { SolarSystem } from "@/types";

const StarMap = dynamic(() => import("./StarMap"), { ssr: false });

const Layout = () => {
  const [systems, setSystems] = useState<SolarSystem[] | undefined>();
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(true);

  const selectedSystem = useMemo(() => {
    if (!selectedSystemId || !systems) return null;
    return systems.find((s) => s.id === selectedSystemId) || null;
  }, [selectedSystemId, systems]);

  // ESC to deselect
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSystemId(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-black">
      {/* Star Map */}
      <div className="flex-1 relative min-h-[40vh] md:min-h-0">
        <StarMap
          systems={systems}
          selectedSystemId={selectedSystemId}
          onSystemSelect={setSelectedSystemId}
        />

        {/* System detail overlay */}
        <SystemDetail
          system={selectedSystem}
          onClose={() => setSelectedSystemId(null)}
        />

        {/* Mobile toggle */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="md:hidden absolute bottom-4 right-4 z-10 px-4 py-2 bg-cyan-600/90 backdrop-blur rounded-full text-xs font-medium text-white shadow-lg shadow-cyan-600/20"
        >
          {showChat ? "Full Map" : "Open Chat"}
        </button>
      </div>

      {/* Chat Panel */}
      <div
        className={`${
          showChat ? "flex" : "hidden md:flex"
        } w-full md:w-[420px] border-t md:border-t-0 md:border-l border-zinc-800/50 flex-shrink-0 h-[60vh] md:h-full`}
      >
        <ChatPanel
          onWorldData={(data) => {
            if (data.systems) setSystems(data.systems);
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
