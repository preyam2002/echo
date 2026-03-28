"use client";

import dynamic from "next/dynamic";
import ChatPanel from "./ChatPanel";

const StarMap = dynamic(() => import("./StarMap"), { ssr: false });

const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex-1 relative">
        <StarMap />
      </div>
      <div className="w-[400px] border-l border-zinc-800 flex-shrink-0">
        <ChatPanel />
      </div>
    </div>
  );
};

export default Layout;
