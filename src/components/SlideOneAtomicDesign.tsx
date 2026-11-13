import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CircleDot,
  Compass,
  Eye,
  Layers,
  LayoutGrid,
  MessageSquare,
  Palette,
  Shield,
  Smartphone,
} from 'lucide-react';
import { ATOMIC_DIMENSIONS, type AtomicDimension } from '../data/atomicDimensions';

interface SlideOneAtomicDesignProps {
  onOpenTransparency: () => void;
}

const IconMap: Record<AtomicDimension['iconName'], React.FC<{ className?: string }>> = {
  compass: Compass,
  shield: Shield,
  palette: Palette,
  circleDot: CircleDot,
  layers: Layers,
  layoutGrid: LayoutGrid,
  smartphone: Smartphone,
  activity: Activity,
  messageSquare: MessageSquare,
  eye: Eye,
};

export const SlideOneAtomicDesign: React.FC<SlideOneAtomicDesignProps> = ({
  onOpenTransparency,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<string | null>(null);

  const rowOne = ATOMIC_DIMENSIONS.slice(0, 5);
  const rowTwo = ATOMIC_DIMENSIONS.slice(5, 10);

  const renderCard = (dim: AtomicDimension, isLastInRow: boolean) => {
    const Icon = IconMap[dim.iconName];
    const isSelected = selectedIdx === dim.index;
    const isLastOverall = dim.index === '10';

    return (
      <article
        key={dim.index}
        onClick={() => setSelectedIdx(isSelected ? null : dim.index)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedIdx(isSelected ? null : dim.index);
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        className={`group relative flex h-full flex-col justify-between rounded-xl border p-3.5 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
          isSelected
            ? 'border-[#1D4ED8] dark:border-[#38BDF8] bg-[#F0F7FF] dark:bg-[#132945] shadow-sm'
            : 'border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0F1F35] hover:border-[#93C5FD] dark:hover:border-[#38BDF8]/60 hover:bg-[#F8FBFF] dark:hover:bg-[#132742]'
        }`}
      >
        {/* Top editorial progression line + Icon */}
        <div>
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#EDF3FA] dark:border-[#1E334D]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF] dark:bg-[#183354] text-[#1D4ED8] dark:text-[#7DD3FC] transition-colors group-hover:bg-[#DBEAFE] dark:group-hover:bg-[#1E3E66] shrink-0">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="font-mono-num text-xs font-semibold text-[#1D4ED8] dark:text-[#7DD3FC]">
                {dim.index}
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#5B7493] dark:text-[#8BA6C6]">
              {dim.stage}
            </span>
          </div>

          <h2 className="mt-2.5 font-display text-[12.5px] font-bold tracking-tight text-[#0B2545] dark:text-[#F0F6FC] leading-snug">
            {dim.title}
          </h2>

          <p className="mt-1.5 text-[11px] leading-[1.48] text-[#3B526E] dark:text-[#B5CBE2]">
            {dim.description}
          </p>
        </div>

        {/* Bottom keyword synthesis (unboxed clean typography) */}
        <div className="mt-3 pt-2 border-t border-[#EDF3FA] dark:border-[#1E334D] flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <div className="flex items-baseline gap-1 text-[10.5px]">
            <span className="text-[#647E9C] dark:text-[#8BA6C6] font-medium">
              Palabra clave:
            </span>
            <span className="font-display font-bold tracking-wide text-[#0369A1] dark:text-[#38BDF8]">
              {dim.keyword}
            </span>
          </div>
          {isLastOverall && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTransparency();
              }}
              className="text-[10.5px] font-semibold text-[#1D4ED8] dark:text-[#7DD3FC] underline underline-offset-2 hover:text-[#0B2545] dark:hover:text-white whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
            >
              Ver detalle IA
            </button>
          )}
        </div>

        {/* Subtle progression connector to next card on desktop */}
        {!isLastInRow && (
          <span
            aria-hidden="true"
            className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-[#0C192C] border border-[#DCE7F3] dark:border-[#243B58] text-[#60A5FA] dark:text-[#38BDF8]"
          >
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        )}
      </article>
    );
  };

  return (
    <section
      aria-labelledby="slide-1-title"
      className="mx-auto w-full max-w-[1360px] min-h-[680px] rounded-2xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] shadow-[0_10px_35px_-15px_rgba(11,37,69,0.12)] dark:shadow-none flex flex-col justify-between px-5 py-5 lg:px-8 lg:py-6 transition-colors"
    >
      {/* Slide Header */}
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 pb-3 border-b border-[#E6EFF8] dark:border-[#1E334D]">
        <div>
          <p className="text-xs font-medium text-[#0284C7] dark:text-[#38BDF8] tracking-wide">
            Diapositiva 01 · Fundamentación Metodológica · Uso principal: Periodistas y recolectores de información
          </p>
          <h1
            id="slide-1-title"
            className="mt-0.5 font-display text-2xl lg:text-[28px] font-bold tracking-tight text-[#0B2545] dark:text-[#F0F6FC] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Construcción del sistema de diseño: Atomic Design
          </h1>
          <p className="mt-1 text-sm text-[#475E7B] dark:text-[#94B0CF]">
            Diez dimensiones para construir una experiencia digital coherente, accesible y escalable.
          </p>
        </div>

        {/* Progressive Axis Indicator */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#475E7B] dark:text-[#94B0CF] shrink-0">
          <span className="font-medium text-[#0B2545] dark:text-[#E6F0FA]">Progresión:</span>
          <span>Definición</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" aria-hidden="true" />
          <span>Sistema base</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" aria-hidden="true" />
          <span>Ensamblaje</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" aria-hidden="true" />
          <span className="font-semibold text-[#1D4ED8] dark:text-[#7DD3FC]">Resiliencia y ética</span>
        </div>
      </header>

      {/* 10 Dimensions Progressive 2x5 Grid */}
      <div className="my-auto py-4 flex flex-col gap-3.5">
        {/* Row 1: 01 -> 05 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
          {rowOne.map((dim, i) => renderCard(dim, i === rowOne.length - 1))}
        </div>

        {/* Subtle Row Transition Indicator */}
        <div className="hidden lg:flex items-center justify-between px-2 text-[11px] text-[#5B7493] dark:text-[#8BA6C6]">
          <span>Fundamentos conceptuales y atómicos (01–05)</span>
          <div className="flex-1 mx-4 h-px bg-gradient-to-r from-[#DBEAFE] via-[#93C5FD] to-[#0284C7] dark:from-[#1E3A5F] dark:via-[#2563EB] dark:to-[#38BDF8]" />
          <span>Composición de interfaz, estados y responsabilidad ciudadana (06–10)</span>
        </div>

        {/* Row 2: 06 -> 10 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
          {rowTwo.map((dim, i) => renderCard(dim, i === rowTwo.length - 1))}
        </div>
      </div>

      {/* Closing Statement */}
      <footer className="pt-3 border-t border-[#E6EFF8] dark:border-[#1E334D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <blockquote className="font-display text-[13.5px] lg:text-[14.5px] font-semibold text-[#0B2545] dark:text-[#E6F0FA] leading-snug">
          «El sistema de diseño no solo organiza elementos visuales: establece las condiciones para transformar datos públicos en información comprensible para la ciudadanía».
        </blockquote>
        <span className="text-[11px] text-[#5B7493] dark:text-[#8BA6C6] whitespace-nowrap shrink-0">
          Metodología Atomic Design · INE Chile
        </span>
      </footer>
    </section>
  );
};
