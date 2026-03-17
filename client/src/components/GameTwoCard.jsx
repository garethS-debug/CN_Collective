import React, { useRef, useEffect, useCallback } from "react";

const GAME_WIDTH = 480;
const GAME_HEIGHT = 320;

export default function Game02Frame() {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const resize = useCallback(() => {
    const container = containerRef.current;
    const iframe = iframeRef.current;
    if (!container || !iframe) return;
    const containerWidth = container.clientWidth;
    const scale = containerWidth / GAME_WIDTH;
    iframe.style.width = `${GAME_WIDTH}px`;
    iframe.style.height = `${GAME_HEIGHT}px`;
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = "0 0";
    container.style.height = `${GAME_HEIGHT * scale}px`;
    container.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <iframe
        ref={iframeRef}
        src="/Game_02/index.html"
        title="Game 02"
        style={{ border: "none", display: "block" }}
        onLoad={resize}
      />
    </div>
  );
}