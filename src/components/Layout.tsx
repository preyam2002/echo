"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ChatPanel from "./ChatPanel";
import type { SolarSystem } from "@/types";

const StarMap = dynamic(() => import("./StarMap"), { ssr: false });

const Layout = () => {
  const [systems, setSystems] = useState<SolarSystem[] | undefined>();
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      <div className="flex-1 relative">
        <StarMap
          systems={systems}
          selectedSystemId={selectedSystemId}
          onSystemSelect={setSelectedSystemId}
        />
      </div>
      <div className="w-[420px] border-l border-zinc-800/50 flex-shrink-0">
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
