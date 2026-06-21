import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    const xDotSet = gsap.quickSetter(dot, "x", "px");
    const yDotSet = gsap.quickSetter(dot, "y", "px");
    const xRingSet = gsap.quickSetter(ring, "x", "px");
    const yRingSet = gsap.quickSetter(ring, "y", "px");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
      xDotSet(mouseX);
      yDotSet(mouseY);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const ticker = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio());
      ringX += (mouseX - ringX) * dt;
      ringY += (mouseY - ringY) * dt;
      xRingSet(ringX);
      yRingSet(ringY);
    };
    gsap.ticker.add(ticker);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName?.toLowerCase() === 'a' ||
        target.tagName?.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      gsap.ticker.remove(ticker);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 rounded-full border-2 border-[#C64A19] pointer-events-none z-[9999] transition-all duration-300 ease-out flex items-center justify-center shadow-sm"
        style={{
          width: isHovering ? '48px' : isClicking ? '24px' : '32px',
          height: isHovering ? '48px' : isClicking ? '24px' : '32px',
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? 'rgba(198, 74, 25, 0.1)' : 'transparent',
          backdropFilter: isHovering ? 'blur(2px)' : 'none',
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#8E1F0D] pointer-events-none z-[10000] transition-transform duration-300 ease-out shadow-sm"
        style={{
          transform: `translate(-50%, -50%) scale(${isHovering ? 0 : isClicking ? 0.5 : 1})`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};
