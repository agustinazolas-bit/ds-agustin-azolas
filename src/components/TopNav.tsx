import React from 'react';
import { ChevronLeft, ChevronRight, Moon, ShieldCheck, Sun } from 'lucide-react';

interface TopNavProps {
  activeSlide: 1 | 2 | 3;
  onSelectSlide: (slide: 1 | 2 | 3) => void;
  onOpenTransparency: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSlide,
  onSelectSlide,
  onOpenTransparency,
  isDark,
  onToggleTheme,
}) => {
  const prevSlide = activeSlide === 1 ? 3 : ((activeSlide - 1) as 1 | 2 | 3);
  const nextSlide = activeSlide === 3 ? 1 : ((activeSlide + 1) as 1 | 2 | 3);

  return (
    <header className="w-full border-b border-[#DCE7F3] dark:border-[#1E334D] bg-white/95 dark:bg-[#0C192C]/95 backdrop-blur-sm transition-colors">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectSlide(1);
          }}
          className="font-display text-base font-bold tracking-tight text-[#0B2545] dark:text-[#E6F0FA] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
        >
          Sistema de Diseño INE Chile
        </a>

        {/* Zone 2: 3-Slide Switcher (Single-line controls) */}
        <nav
          aria-label="Navegación de diapositivas"
          className="flex flex-wrap items-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => onSelectSlide(1)}
            aria-label="Ir a Diapositiva 1: Fundamentación Atomic Design"
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
              activeSlide === 1
                ? 'bg-[#EFF6FF] dark:bg-[#162C49] text-[#1D4ED8] dark:text-[#7DD3FC] border border-[#BFDBFE] dark:border-[#2B4B75]'
                : 'text-[#475E7B] dark:text-[#94B0CF] hover:text-[#0B2545] dark:hover:text-white hover:bg-[#F4F8FC] dark:hover:bg-[#13253E]'
            }`}
          >
            01. Atomic Design
          </button>

          <button
            type="button"
            onClick={() => onSelectSlide(2)}
            aria-label="Ir a Diapositiva 2: Producto INE"
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
              activeSlide === 2
                ? 'bg-[#EFF6FF] dark:bg-[#162C49] text-[#1D4ED8] dark:text-[#7DD3FC] border border-[#BFDBFE] dark:border-[#2B4B75]'
                : 'text-[#475E7B] dark:text-[#94B0CF] hover:text-[#0B2545] dark:hover:text-white hover:bg-[#F4F8FC] dark:hover:bg-[#13253E]'
            }`}
          >
            02. Producto INE
          </button>

          <button
            type="button"
            onClick={() => onSelectSlide(3)}
            aria-label="Ir a Diapositiva 3: Sistema de Diseño Vivo"
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
              activeSlide === 3
                ? 'bg-[#EFF6FF] dark:bg-[#162C49] text-[#1D4ED8] dark:text-[#7DD3FC] border border-[#BFDBFE] dark:border-[#2B4B75]'
                : 'text-[#475E7B] dark:text-[#94B0CF] hover:text-[#0B2545] dark:hover:text-white hover:bg-[#F4F8FC] dark:hover:bg-[#13253E]'
            }`}
          >
            03. Sistema Vivo
          </button>

          <div className="hidden sm:flex items-center gap-0.5 pl-1 text-[#8BA3C0] dark:text-[#6884A6]">
            <button
              type="button"
              onClick={() => onSelectSlide(prevSlide)}
              title="Diapositiva anterior"
              aria-label="Diapositiva anterior"
              className="p-1 rounded hover:bg-[#EFF6FF] dark:hover:bg-[#162C49] hover:text-[#1D4ED8] dark:hover:text-[#7DD3FC] transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-num text-xs text-[#475E7B] dark:text-[#94B0CF] px-1">
              {activeSlide} / 3
            </span>
            <button
              type="button"
              onClick={() => onSelectSlide(nextSlide)}
              title="Siguiente diapositiva"
              aria-label="Siguiente diapositiva"
              className="p-1 rounded hover:bg-[#EFF6FF] dark:hover:bg-[#162C49] hover:text-[#1D4ED8] dark:hover:text-[#7DD3FC] transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* Zone 3: Theme Toggle + Primary Transparency Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE7F3] dark:border-[#243B58] bg-[#F8FBFF] dark:bg-[#13253E] px-3 py-2 text-xs font-medium text-[#0B2545] dark:text-[#E6F0FA] transition-colors hover:bg-[#EFF6FF] dark:hover:bg-[#1B3354] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-[#7DD3FC]" aria-hidden="true" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
            )}
            <span>{isDark ? 'Claro' : 'Oscuro'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenTransparency}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B2545] dark:bg-[#1D4ED8] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#163B6B] dark:hover:bg-[#2563EB] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <ShieldCheck className="w-4 h-4 text-[#7DD3FC]" aria-hidden="true" />
            Transparencia IA
          </button>
        </div>
      </div>
    </header>
  );
};
