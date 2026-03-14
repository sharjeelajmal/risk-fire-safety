'use client';

import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useControls } from 'react-zoom-pan-pinch';

export default function MapTools() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  const tools = [
    { icon: ZoomIn, label: 'Zoom In', onClick: () => zoomIn() },
    { icon: ZoomOut, label: 'Zoom Out', onClick: () => zoomOut() },
    { icon: Maximize2, label: 'Fit to Screen', onClick: () => resetTransform() },
  ];

  return (
    <div className="fixed right-3 lg:right-8 top-[45%] -translate-y-1/2 flex flex-col gap-3 lg:gap-4 z-[60]">
      {tools.map((tool, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            tool.onClick();
          }}
          className="w-12 h-12 lg:w-16 lg:h-16 bg-zinc-900/90 backdrop-blur-3xl rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-red-600/20 transition-all cursor-pointer shadow-xl group active:bg-red-600/40"
          title={tool.label}
        >
          <tool.icon size={20} className="group-hover:scale-110 transition-transform" />
        </motion.button>
      ))}
    </div>
  );
}
