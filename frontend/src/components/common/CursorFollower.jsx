import React, { useEffect, useState, useRef } from 'react';

export function CursorFollower({ enableSpotlight = true, enableCursorDot = true }) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const spotlightRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    // Detect touch device to avoid interfering with mobile gestures
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible) setIsVisible(true);

      // Move inner dot immediately with mouse
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Update ambient spotlight position
      if (spotlightRef.current && enableSpotlight) {
        spotlightRef.current.style.background = `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(59, 130, 246, 0.16), rgba(99, 102, 241, 0.08) 35%, transparent 70%)`;
      }

      // Detect hover over interactive elements
      const target = e.target;
      const isInteractive = target && (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        target.closest('label')
      );

      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth loop with lerp (linear interpolation) for trailing ring
    const renderLoop = () => {
      // Lerp formula: current + (target - current) * factor
      const factor = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * factor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * factor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    animationFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enableSpotlight, isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. Ambient Background Spotlight moving with cursor */}
      {enableSpotlight && (
        <div
          ref={spotlightRef}
          className="fixed inset-0 pointer-events-none z-1 transition-opacity duration-300"
          style={{ opacity: isVisible ? 1 : 0 }}
        />
      )}

      {/* 2. Interactive High-Tech Cursor Elements */}
      {enableCursorDot && (
        <div className="pointer-events-none fixed inset-0 z-9999 overflow-hidden">
          {/* Outer Fluid Trailing Ring */}
          <div
            ref={ringRef}
            className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-all duration-150 ease-out will-change-transform ${
              isClicking
                ? 'w-7 h-7 border-blue-400 bg-blue-500/30 scale-90'
                : isHovered
                ? 'w-12 h-12 border-blue-400/80 bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                : 'w-8 h-8 border-blue-400/40 bg-blue-500/5 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
            }`}
            style={{
              opacity: isVisible ? 1 : 0,
            }}
          />

          {/* Precision Center Dot */}
          <div
            ref={dotRef}
            className={`fixed top-0 left-0 rounded-full pointer-events-none transition-all duration-75 ease-out will-change-transform ${
              isClicking
                ? 'w-3 h-3 bg-white shadow-[0_0_14px_#60a5fa]'
                : isHovered
                ? 'w-2 h-2 bg-blue-300 shadow-[0_0_10px_#3b82f6]'
                : 'w-2 h-2 bg-blue-400 shadow-[0_0_8px_#3b82f6]'
            }`}
            style={{
              opacity: isVisible ? 1 : 0,
            }}
          />
        </div>
      )}
    </>
  );
}

export default CursorFollower;
