'use client';

import React, { useRef, useEffect } from 'react';
import anime from '@/lib/animeHelper';

interface Props {
  coverUrl?: string;
  title?: string;
}

export default function CoverCard3D({ coverUrl = '/cover.jpg', title = "A Regressor's Tale of Cultivation" }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [-15, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        easing: 'easeOutElastic(1, 0.8)',
        duration: 1400
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cardRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    if (reflectionRef.current) {
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      reflectionRef.current.style.background = `linear-gradient(${angle + 90}deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`;
      reflectionRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    anime({
      targets: cardRef.current,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      easing: 'easeOutQuad',
      duration: 500
    });
    if (reflectionRef.current) {
      reflectionRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 relative flex items-center justify-center p-2 cursor-pointer group select-none"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-2 rounded-3xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500 -z-10" />

      {/* 3D Card Container */}
      <div
        ref={cardRef}
        className="transform-style-3d relative w-72 md:w-84 rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-border)] transition-transform duration-100 ease-out bg-theme-card"
        style={{ willChange: 'transform' }}
      >
        {/* Reflection Highlight Overlay */}
        <div
          ref={reflectionRef}
          className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300"
        />

        {/* Crisp Uncompressed 4K Cover Image */}
        <div className="relative aspect-[3/4.4] w-full overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/80 via-transparent to-transparent" />
        </div>

        {/* Novel Badge Banner */}
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold font-cinzel tracking-wider bg-black/75 text-[var(--color-primary)] border border-white/10 backdrop-blur-md">
          869+ Chapters • Complete
        </div>

        {/* 3D Floating Title Tag */}
        <div 
          className="absolute bottom-3 left-3 right-3 z-20 p-3 rounded-xl bg-black/70 backdrop-blur-md text-center border border-white/10 shadow-lg"
          style={{ transform: 'translateZ(20px)' }}
        >
          <h3 className="font-cinzel font-bold text-sm md:text-base text-white drop-shadow-md truncate">
            {title}
          </h3>
          <p className="text-xs text-[var(--color-secondary)] font-medium mt-0.5">
            By Pluto (해날)
          </p>
        </div>
      </div>
    </div>
  );
}
