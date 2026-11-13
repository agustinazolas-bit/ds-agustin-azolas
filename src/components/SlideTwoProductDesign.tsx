import React, { useState } from 'react';
import { PRODUCT_ANNOTATIONS } from '../data/annotations';
import type { IneApiResponse, ProductZoneId } from '../types/ine';
import { IneProductShowcase } from './IneProductShowcase';

interface SlideTwoProductDesignProps {
  data: IneApiResponse | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedRegionCode: string;
  onSelectRegion: (codigo: string) => void;
}

export const SlideTwoProductDesign: React.FC<SlideTwoProductDesignProps> = ({
  data,
  loading,
  error,
  onRetry,
  selectedRegionCode,
  onSelectRegion,
}) => {
  const [activeZone, setActiveZone] = useState<ProductZoneId>(null);

  return (
    <section
      aria-labelledby="slide-2-title"
      className="mx-auto w-full max-w-[1360px] min-h-[680px] rounded-2xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] shadow-[0_10px_35px_-15px_rgba(11,37,69,0.12)] dark:shadow-none flex flex-col justify-between px-5 py-5 lg:px-8 lg:py-6 transition-colors"
    >
      {/* Slide Header */}
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 pb-3 border-b border-[#E6EFF8] dark:border-[#1E334D]">
        <div>
          <p className="text-xs font-medium text-[#0284C7] dark:text-[#38BDF8] tracking-wide">
            Diapositiva 02 · Presentación del Diseño del Producto · Para periodistas y recolectores de información
          </p>
          <h1
            id="slide-2-title"
            className="mt-0.5 font-display text-2xl lg:text-[28px] font-bold tracking-tight text-[#0B2545] dark:text-[#F0F6FC] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Aplicación del sistema de diseño: plataforma de estadísticas INE
          </h1>
          <p className="mt-1 text-sm text-[#475E7B] dark:text-[#94B0CF]">
            Una interfaz que traduce indicadores estadísticos en información accesible para periodistas, recolectores y ciudadanía.
          </p>
        </div>

        <div className="text-xs text-[#5B7493] dark:text-[#8BA6C6] shrink-0">
          <span>Fuente en vivo: </span>
          <span className="font-mono-num font-medium text-[#0B2545] dark:text-[#E6F0FA]">
            INE Boletín ENE n.º {data?.boletin ?? 335}
          </span>
        </div>
      </header>

      {/* Main Composition: ~75% Interactive Product Showcase + ~25% 4 Structured Annotations */}
      <div className="my-auto py-3.5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1">
        {/* Dominant Central Product Canvas (~75% width = 9 of 12 columns) */}
        <div className="lg:col-span-9 flex flex-col">
          <IneProductShowcase
            data={data}
            loading={loading}
            error={error}
            onRetry={onRetry}
            selectedRegionCode={selectedRegionCode}
            onSelectRegion={onSelectRegion}
            highlightedZone={activeZone}
          />
        </div>

        {/* Side Column: 4 Design Decision Annotations with discreet connector indicators */}
        <aside
          aria-label="Anotaciones de diseño del producto"
          className="lg:col-span-3 flex flex-col justify-between gap-2.5"
        >
          {PRODUCT_ANNOTATIONS.map((note) => {
            const isActive = activeZone === note.id;
            return (
              <div
                key={note.id}
                onMouseEnter={() => setActiveZone(note.id)}
                onMouseLeave={() => setActiveZone(null)}
                onFocus={() => setActiveZone(note.id)}
                onBlur={() => setActiveZone(null)}
                onClick={() => setActiveZone(isActive ? null : note.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveZone(isActive ? null : note.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                className={`relative flex-1 flex flex-col justify-center rounded-xl border px-3.5 py-2.5 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                  isActive
                    ? 'border-[#0284C7] dark:border-[#38BDF8] bg-[#F0F7FF] dark:bg-[#132945] shadow-xs'
                    : 'border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] hover:border-[#93C5FD] dark:hover:border-[#38BDF8]/60 hover:bg-white dark:hover:bg-[#132742]'
                }`}
              >
                {/* Discreet horizontal connector line pointing toward the 75% product frame */}
                <div
                  aria-hidden="true"
                  className="hidden lg:flex items-center absolute -left-4 top-1/2 -translate-y-1/2 w-4"
                >
                  <span
                    className={`h-2 w-2 rounded-full border transition-colors ${
                      isActive
                        ? 'bg-[#0284C7] dark:bg-[#38BDF8] border-[#0284C7] dark:border-[#38BDF8]'
                        : 'bg-white dark:bg-[#0C192C] border-[#60A5FA] dark:border-[#38BDF8]/70'
                    }`}
                  />
                  <span
                    className={`h-px flex-1 transition-colors ${
                      isActive
                        ? 'bg-[#0284C7] dark:bg-[#38BDF8]'
                        : 'bg-[#93C5FD] dark:bg-[#2B4B75]'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono-num flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#1D4ED8] text-white'
                        : 'bg-[#DBEAFE] dark:bg-[#183354] text-[#1D4ED8] dark:text-[#7DD3FC]'
                    }`}
                  >
                    {note.number}
                  </span>
                  <h2 className="font-display text-[12px] font-bold tracking-tight text-[#0B2545] dark:text-[#F0F6FC] leading-tight">
                    {note.title}
                  </h2>
                </div>

                <p className="mt-1.5 text-[11px] leading-[1.45] text-[#3B526E] dark:text-[#B5CBE2]">
                  {note.description}
                </p>

                <span className="mt-1.5 text-[10px] font-medium text-[#0284C7] dark:text-[#38BDF8]">
                  {note.targetLabel}
                </span>
              </div>
            );
          })}
        </aside>
      </div>

      {/* Closing Statement */}
      <footer className="pt-3 border-t border-[#E6EFF8] dark:border-[#1E334D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <blockquote className="font-display text-[13.5px] lg:text-[14.5px] font-semibold text-[#0B2545] dark:text-[#E6F0FA] leading-snug">
          «El diseño busca que las estadísticas no solamente puedan consultarse, sino también comprenderse e interpretarse».
        </blockquote>
        <span className="text-[11px] text-[#5B7493] dark:text-[#8BA6C6] whitespace-nowrap shrink-0">
          Aplicación en interfaz real · Datos oficiales INE
        </span>
      </footer>
    </section>
  );
};
