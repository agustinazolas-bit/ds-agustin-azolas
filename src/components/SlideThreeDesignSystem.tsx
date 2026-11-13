import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Database,
  ExternalLink,
  HelpCircle,
  Info,
  Loader2,
  MapPin,
  Monitor,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import type { IneApiResponse } from '../types/ine';
import { formatNumberEs } from './ChileChoroplethMap';

interface SlideThreeDesignSystemProps {
  data: IneApiResponse | null;
  selectedRegionCode: string;
  onSelectRegion: (codigo: string) => void;
  onOpenTransparency: () => void;
  isDark: boolean;
}

const COLOR_TOKENS_LIGHT = [
  {
    token: '--azul-tinta',
    name: 'Tinta principal',
    hex: '#0B2545',
    contrast: '15,1:1 AAA (sobre #FFF)',
  },
  {
    token: '--azul-ine',
    name: 'Azul institucional',
    hex: '#1D4ED8',
    contrast: '6,7:1 AA+ (sobre #FFF)',
  },
  {
    token: '--celeste-acento',
    name: 'Celeste interacción',
    hex: '#0284C7',
    contrast: '4,6:1 AA (sobre #FFF)',
  },
  {
    token: '--superficie',
    name: 'Superficie clara',
    hex: '#F8FBFF',
    contrast: '14,3:1 AAA (con tinta)',
  },
  {
    token: '--borde',
    name: 'Trazo estructural',
    hex: '#DCE7F3',
    contrast: 'Separador 1px',
  },
  {
    token: '--fondo-lienzo',
    name: 'Lienzo general',
    hex: '#F4F8FC',
    contrast: '14,0:1 AAA (con tinta)',
  },
];

const COLOR_TOKENS_DARK = [
  {
    token: '--azul-tinta',
    name: 'Tinta principal',
    hex: '#F0F6FC',
    contrast: '15,4:1 AAA (sobre #0C192C)',
  },
  {
    token: '--azul-ine',
    name: 'Azul interactivo',
    hex: '#7DD3FC',
    contrast: '10,6:1 AAA (sobre #0C192C)',
  },
  {
    token: '--celeste-acento',
    name: 'Celeste acento',
    hex: '#38BDF8',
    contrast: '8,4:1 AAA (sobre #0C192C)',
  },
  {
    token: '--superficie',
    name: 'Superficie tarjeta',
    hex: '#0F1F35',
    contrast: '13,2:1 AAA (con #F0F6FC)',
  },
  {
    token: '--borde',
    name: 'Trazo estructural',
    hex: '#1E334D',
    contrast: 'Separador 1px',
  },
  {
    token: '--fondo-lienzo',
    name: 'Lienzo oscuro',
    hex: '#07111F',
    contrast: '16,5:1 AAA (con #E6F0FA)',
  },
];

const CANVAS_BOXES = [
  { n: '1', label: 'Usuarios esenciales', text: 'Periodistas y recolectores de información.' },
  { n: '2', label: 'Problema', text: 'Boletines PDF extensos frenan la verificación rápida.' },
  { n: '3', label: 'Propuesta de valor', text: 'Mapa + ficha regional con cita exacta al boletín.' },
  { n: '4', label: 'Fuente de datos', text: 'API /regiones (Boletín ENE 335) + ZIP territorial.' },
  { n: '5', label: 'Flujo principal', text: 'Elegir región, contrastar con Chile y copiar fuente.' },
  { n: '6', label: 'Regla de rigor', text: 'Cero cifras estimadas; unidades normalizadas (% y pp).' },
  { n: '7', label: 'Dispositivos', text: 'Escritorio en redacción y móvil en reporteo.' },
  { n: '8', label: 'Resultado medible', text: 'Consulta verificable en menos de 10 segundos.' },
];

const PRINCIPLES = [
  {
    n: '01',
    title: 'Toda cifra con su fuente',
    text: 'Ningún número aparece sin boletín, edición, fecha de publicación y enlace al PDF oficial.',
  },
  {
    n: '02',
    title: 'Cero datos inventados',
    text: 'Si un registro falta en el boletín, se muestra «No consta» en lugar de interpolar o estimar.',
  },
  {
    n: '03',
    title: 'Unidades sin ambigüedad',
    text: 'Se distingue siempre porcentaje (%) de variación en puntos porcentuales (pp) con coma decimal.',
  },
  {
    n: '04',
    title: 'Velocidad para prensa',
    text: 'Periodistas y recolectores acceden a la cifra regional y su respaldo en máximo dos interacciones.',
  },
];

export const SlideThreeDesignSystem: React.FC<SlideThreeDesignSystemProps> = ({
  data,
  selectedRegionCode,
  onSelectRegion,
  onOpenTransparency,
  isDark,
}) => {
  const activeColorTokens = isDark ? COLOR_TOKENS_DARK : COLOR_TOKENS_LIGHT;
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [templateMode, setTemplateMode] = useState<'template' | 'page'>('page');
  const [activeAtomState, setActiveAtomState] = useState<
    'normal' | 'hover' | 'active' | 'focus' | 'disabled'
  >('normal');

  const sortedRegions = useMemo(() => {
    if (!data?.regiones) return [];
    return [...data.regiones].sort((a, b) => a.region.localeCompare(b.region, 'es'));
  }, [data]);

  const activeRegion = useMemo(() => {
    if (!data?.regiones?.length) return null;
    return (
      data.regiones.find((r) => r.codigo === selectedRegionCode) ??
      data.regiones.find((r) => r.codigo === 'RM') ??
      data.regiones[0]
    );
  }, [data, selectedRegionCode]);

  const tableRegions = useMemo(() => {
    if (!data?.regiones?.length) return [];
    return [...data.regiones].sort((a, b) => b.tasa - a.tasa).slice(0, 6);
  }, [data]);

  const handleCopyHex = (token: string, hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken((prev) => (prev === token ? null : prev)), 1500);
  };

  return (
    <section
      aria-labelledby="slide-3-title"
      className="mx-auto w-full max-w-[1360px] rounded-2xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] shadow-[0_10px_35px_-15px_rgba(11,37,69,0.12)] dark:shadow-none flex flex-col gap-5 px-5 py-5 lg:px-8 lg:py-6 transition-colors"
    >
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 pb-3.5 border-b border-[#E6EFF8] dark:border-[#1E334D]">
        <div>
          <p className="text-xs font-medium text-[#0284C7] dark:text-[#38BDF8] tracking-wide">
            Diapositiva 03 · Sistema de Diseño Vivo (Referencia: ds-ejemplo) · Para periodistas y recolectores de información
          </p>
          <h1
            id="slide-3-title"
            className="mt-0.5 font-display text-2xl lg:text-[28px] font-bold tracking-tight text-[#0B2545] dark:text-[#F0F6FC] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Especificación completa del sistema de diseño INE Chile
          </h1>
          <p className="mt-1 text-sm text-[#475E7B] dark:text-[#94B0CF]">
            Documentación viva de las nueve capas operativas, tokens medidos, componentes interactivos y reglas editoriales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#475E7B] dark:text-[#94B0CF] shrink-0">
          <span>Datos en vivo:</span>
          <span className="font-mono-num font-semibold text-[#0B2545] dark:text-[#E6F0FA]">
            /regiones · Boletín ENE {data?.boletin ?? 335}
          </span>
        </div>
      </header>

      {/* 1 · El producto + 2 · Principios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 1 · El producto */}
        <article className="lg:col-span-8 rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
            <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
              1 · El producto: lienzo de 8 casillas y boceto inicial
            </h2>
            <span className="text-[11px] font-medium text-[#0284C7] dark:text-[#38BDF8]">
              Propósito editorial y captura de datos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            {/* 8 casillas del lienzo */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CANVAS_BOXES.map((box) => (
                <div
                  key={box.n}
                  className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#1D4ED8] dark:text-[#7DD3FC]">
                    <span className="font-mono-num">{box.n}.</span>
                    <span className="text-[#0B2545] dark:text-[#F0F6FC] leading-tight">
                      {box.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[10.5px] leading-snug text-[#3B526E] dark:text-[#B5CBE2]">
                    {box.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Boceto de primera pantalla */}
            <div className="md:col-span-4 rounded-lg border border-[#BFDBFE] dark:border-[#244670] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between">
              <div className="text-[10.5px] font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-1.5">
                Boceto de primera pantalla
              </div>
              <svg
                viewBox="0 0 220 142"
                className="w-full h-auto rounded border border-[#E6EFF8] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#091526]"
                role="img"
                aria-label="Boceto estructural de la primera pantalla: cabecera, selector, mapa y ficha regional"
              >
                <rect x="6" y="6" width="208" height="18" rx="3" fill="#0B2545" />
                <rect x="12" y="11" width="64" height="8" rx="2" fill="#38BDF8" />
                <rect x="148" y="10" width="58" height="10" rx="2" fill="#1D4ED8" />

                <rect x="6" y="30" width="62" height="106" rx="4" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1" />
                <path d="M36 42 L43 56 L40 78 L34 98 L28 122" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round" fill="none" />
                <circle cx="38" cy="74" r="4" fill="#0B2545" />

                <rect x="74" y="30" width="140" height="48" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1" />
                <rect x="82" y="38" width="66" height="8" rx="2" fill="#0B2545" />
                <rect x="82" y="52" width="38" height="18" rx="2" fill="#1D4ED8" />
                <rect x="126" y="52" width="38" height="18" rx="2" fill="#DBEAFE" />
                <rect x="170" y="52" width="38" height="18" rx="2" fill="#DBEAFE" />

                <rect x="74" y="84" width="140" height="28" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1" />
                <rect x="82" y="92" width="100" height="5" rx="2" fill="#60A5FA" />
                <rect x="82" y="101" width="120" height="4" rx="2" fill="#CBD5E1" />

                <rect x="74" y="118" width="140" height="18" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
                <rect x="82" y="125" width="90" height="4" rx="2" fill="#0284C7" />
              </svg>
              <span className="mt-1 text-[10px] text-[#5B7493] dark:text-[#8BA6C6]">
                Mapa territorial (izq.) + Ficha y fuente (der.)
              </span>
            </div>
          </div>
        </article>

        {/* 2 · Principios */}
        <article className="lg:col-span-4 rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col justify-between gap-2.5">
          <div className="pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
            <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
              2 · Principios (lo que no se negocia)
            </h2>
          </div>

          <div className="flex flex-col gap-2 flex-1 justify-between">
            {PRINCIPLES.map((p) => (
              <div
                key={p.n}
                className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[11px] font-bold text-[#1D4ED8] dark:text-[#7DD3FC]">
                    {p.n}
                  </span>
                  <h3 className="font-display text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-[#3B526E] dark:text-[#B5CBE2]">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* 3 · Tokens */}
      <article className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
          <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
            3 · Tokens ({isDark ? 'Modo oscuro activo' : 'Modo luminoso activo'}): color con contraste medido, tipografía, espaciado, grilla y bordes
          </h2>
          <span className="text-[11px] text-[#475E7B] dark:text-[#94B0CF]">
            Haz clic en una muestra para copiar su valor hexadecimal ({isDark ? 'oscuro' : 'claro'})
          </span>
        </div>

        {/* Swatches (ds-ejemplo pattern) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {activeColorTokens.map((item) => {
            const isCopied = copiedToken === item.token;
            return (
              <button
                key={item.token}
                type="button"
                onClick={() => handleCopyHex(item.token, item.hex)}
                className="text-left rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 transition-colors hover:border-[#1D4ED8] dark:hover:border-[#38BDF8] focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
              >
                <div
                  className="h-10 w-full rounded-md border border-[#DCE7F3] dark:border-[#243B58] mb-2"
                  style={{ backgroundColor: item.hex }}
                />
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono-num text-[10.5px] font-bold text-[#0B2545] dark:text-[#F0F6FC] truncate">
                    {item.token}
                  </span>
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] shrink-0" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3 h-3 text-[#647E9C] shrink-0" aria-hidden="true" />
                  )}
                </div>
                <div className="font-mono-num text-[10px] text-[#1D4ED8] dark:text-[#7DD3FC]">
                  {isCopied ? 'Copiado' : item.hex}
                </div>
                <div className="mt-0.5 text-[10px] text-[#475E7B] dark:text-[#94B0CF] leading-tight">
                  {item.contrast}
                </div>
              </button>
            );
          })}
        </div>

        {/* Typography, Spacing, Grid, Borders/Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
            <div className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-1.5">
              Tipografía y escala
            </div>
            <div className="space-y-1 text-[11px] text-[#3B526E] dark:text-[#B5CBE2]">
              <div className="flex justify-between">
                <span>Display (Plus Jakarta Sans)</span>
                <span className="font-mono-num font-semibold">28px / 700</span>
              </div>
              <div className="flex justify-between">
                <span>Subtítulo / Sección</span>
                <span className="font-mono-num font-semibold">16–18px / 700</span>
              </div>
              <div className="flex justify-between">
                <span>Lectura (Public Sans)</span>
                <span className="font-mono-num font-semibold">14px / 1.5</span>
              </div>
              <div className="flex justify-between">
                <span>Cifra (JetBrains Mono)</span>
                <span className="font-mono-num font-semibold">32px tabular</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
            <div className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-1.5">
              Espaciado y grilla
            </div>
            <div className="space-y-1 text-[11px] text-[#3B526E] dark:text-[#B5CBE2]">
              <div className="flex justify-between">
                <span>Escala base (4 pt)</span>
                <span className="font-mono-num font-semibold">4 · 8 · 16 · 24 · 32 px</span>
              </div>
              <div className="flex justify-between">
                <span>Ancho máximo escritorio</span>
                <span className="font-mono-num font-semibold">1360 px · 12 cols</span>
              </div>
              <div className="flex justify-between">
                <span>Tablet / Móvil</span>
                <span className="font-mono-num font-semibold">768 px (8) · 375 px (4)</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
            <div className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-1.5">
              Bordes y sombras ({isDark ? 'oscuro' : 'claro'})
            </div>
            <div className="space-y-1 text-[11px] text-[#3B526E] dark:text-[#B5CBE2]">
              <div className="flex justify-between">
                <span>Bordes estructurales</span>
                <span className="font-mono-num font-semibold">
                  {isDark ? '1px sólido #1E334D' : '1px sólido #DCE7F3'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Radios (control / tarjeta)</span>
                <span className="font-mono-num font-semibold">8 px / 12 px / 16 px</span>
              </div>
              <div className="flex justify-between">
                <span>Elevación activa</span>
                <span className="font-mono-num font-semibold">
                  {isDark ? 'Plano · contraste por borde' : '1 nivel · y:10 blur:35'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 4 · Átomos + 5 · Moléculas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 4 · Átomos */}
        <article className="lg:col-span-6 rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col justify-between gap-3">
          <div className="pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
            <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
              4 · Átomos: elementos mínimos de interacción
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-[#5B7493] dark:text-[#8BA6C6]">
                Botón
              </span>
              <button
                type="button"
                onClick={() =>
                  onSelectRegion(activeRegion?.codigo === 'RM' ? 'BI' : 'RM')
                }
                className="rounded-lg bg-[#1D4ED8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2545]"
              >
                Cambiar región
              </button>
            </div>

            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-[#5B7493] dark:text-[#8BA6C6]">
                Enlace verificable
              </span>
              <a
                href={activeRegion?.url ?? 'https://www.ine.gob.cl'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] dark:text-[#7DD3FC] underline underline-offset-2 hover:text-[#0B2545] dark:hover:text-white"
              >
                Boletín INE PDF
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>

            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-[#5B7493] dark:text-[#8BA6C6]">
                Etiqueta
              </span>
              <span className="text-xs font-semibold text-[#0369A1] dark:text-[#38BDF8]">
                Junio–agosto 2026
              </span>
            </div>

            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-[#5B7493] dark:text-[#8BA6C6]">
                Campo / Selector
              </span>
              <input
                type="text"
                readOnly
                value={activeRegion?.region ?? 'Metropolitana'}
                aria-label="Campo de ejemplo región activa"
                className="w-full rounded-md border border-[#BFDBFE] dark:border-[#244670] bg-[#F8FBFF] dark:bg-[#13253E] px-2 py-1 text-xs text-[#0B2545] dark:text-[#E6F0FA]"
              />
            </div>

            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-[#5B7493] dark:text-[#8BA6C6]">
                Ícono funcional
              </span>
              <div className="flex items-center gap-2 text-[#1D4ED8] dark:text-[#7DD3FC]">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <Database className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>

            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2.5 flex flex-col justify-between gap-1">
              <span className="text-[10.5px] font-semibold text-[#5B7493] dark:text-[#8BA6C6]">
                La cifra
              </span>
              <span className="font-mono-num text-2xl font-bold text-[#0B2545] dark:text-[#F0F6FC] leading-none">
                {activeRegion ? `${formatNumberEs(activeRegion.tasa)}%` : '9,8%'}
              </span>
            </div>
          </div>
        </article>

        {/* 5 · Moléculas (ds-ejemplo interactive region card + legend + source/IA line) */}
        <article className="lg:col-span-6 rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col justify-between gap-3">
          <div className="pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
            <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
              5 · Moléculas: tarjeta con fuente, selector, leyenda y uso de IA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
            {/* Selector + Tarjeta de cifra con fuente (inspirada directamente en ds-ejemplo con datos reales) */}
            <div className="sm:col-span-7 rounded-xl border border-[#BFDBFE] dark:border-[#244670] bg-white dark:bg-[#0C192C] p-3 flex flex-col justify-between gap-2" aria-live="polite">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="ds-region-select" className="text-[11px] font-semibold text-[#475E7B] dark:text-[#94B0CF]">
                  Selector de región
                </label>
                <select
                  id="ds-region-select"
                  value={activeRegion?.codigo ?? 'RM'}
                  onChange={(e) => onSelectRegion(e.target.value)}
                  className="rounded-md border border-[#1D4ED8]/40 bg-[#F8FBFF] dark:bg-[#13253E] px-2 py-1 text-xs font-semibold text-[#0B2545] dark:text-[#F0F6FC]"
                >
                  {sortedRegions.map((r) => (
                    <option key={r.codigo} value={r.codigo}>
                      {r.region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="font-display text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                  {activeRegion ? `Región de ${activeRegion.region}` : 'Cargando región...'}
                </div>
                <div className="font-mono-num text-3xl font-bold text-[#1D4ED8] dark:text-[#7DD3FC] leading-tight mt-0.5">
                  {activeRegion ? `${formatNumberEs(activeRegion.tasa)}%` : '—'}
                </div>
                <div className="text-xs font-semibold text-[#0369A1] dark:text-[#38BDF8]">
                  {activeRegion
                    ? `${activeRegion.variacion_pp > 0 ? '+' : ''}${formatNumberEs(
                        activeRegion.variacion_pp
                      )} pp en 12 meses · Informalidad ${formatNumberEs(activeRegion.informalidad)}%`
                    : 'Sin datos cargados'}
                </div>
              </div>

              <div className="pt-1.5 border-t border-[#E6EFF8] dark:border-[#1E334D] text-[10px] text-[#5B7493] dark:text-[#8BA6C6] leading-snug">
                {activeRegion?.fuente ?? 'INE, Boletín ENE n.º 335, 30-09-2026'}
              </div>
            </div>

            {/* Leyenda del mapa + Línea de fuente y uso de IA */}
            <div className="sm:col-span-5 flex flex-col justify-between gap-2.5">
              <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
                <div className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-1.5">
                  Leyenda del mapa
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono-num text-[#475E7B] dark:text-[#94B0CF] mb-1">
                  <span>4,0%</span>
                  <span>Desocupación</span>
                  <span>11,2%</span>
                </div>
                <div className="grid grid-cols-5 h-2 rounded-full overflow-hidden">
                  <span className="bg-[#DBEAFE]" />
                  <span className="bg-[#93C5FD]" />
                  <span className="bg-[#60A5FA]" />
                  <span className="bg-[#2563EB]" />
                  <span className="bg-[#1E3A8A]" />
                </div>
              </div>

              <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3 flex flex-col gap-1.5">
                <div className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                  Línea de fuente y uso de IA
                </div>
                <p className="text-[10.5px] leading-snug text-[#3B526E] dark:text-[#B5CBE2]">
                  Fuente: INE ENE n.º {data?.boletin ?? 335}. Cifras directas sin estimación por IA.
                </p>
                <button
                  type="button"
                  onClick={onOpenTransparency}
                  className="text-left text-[10.5px] font-semibold text-[#1D4ED8] dark:text-[#7DD3FC] underline underline-offset-2"
                >
                  Consultar declaración de IA
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* 6 · Organismos */}
      <article className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
          <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
            6 · Organismos: composición funcional con datos reales del INE
          </h2>
          <span className="text-[11px] text-[#475E7B] dark:text-[#94B0CF]">
            Cabecera · Ficha regional · Mapa · Tabla de regiones · Bloque de nota · Pie con IA
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Tabla real de regiones */}
          <div className="lg:col-span-7 rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3 overflow-x-auto">
            <div className="text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
              Organismo · Tabla comparativa de regiones (top tasa de desocupación)
            </div>
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[#E6EFF8] dark:border-[#1E334D] text-[#5B7493] dark:text-[#8BA6C6]">
                  <th className="py-1.5 pr-2 font-semibold">Región</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Tasa</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Var. pp</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Informalidad</th>
                  <th className="py-1.5 pl-2 text-right font-semibold">Boletín</th>
                </tr>
              </thead>
              <tbody>
                {tableRegions.map((row) => {
                  const isCurrent = row.codigo === activeRegion?.codigo;
                  return (
                    <tr
                      key={row.codigo}
                      onClick={() => onSelectRegion(row.codigo)}
                      className={`border-b border-[#F1F5F9] dark:border-[#162740] cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-[#EFF6FF] dark:bg-[#142946] font-semibold'
                          : 'hover:bg-[#F8FBFF] dark:hover:bg-[#10223A]'
                      }`}
                    >
                      <td className="py-1.5 pr-2 text-[#0B2545] dark:text-[#F0F6FC]">
                        {row.region}
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono-num text-[#1D4ED8] dark:text-[#7DD3FC]">
                        {formatNumberEs(row.tasa)}%
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono-num text-[#0B2545] dark:text-[#E6F0FA]">
                        {row.variacion_pp > 0 ? '+' : ''}
                        {formatNumberEs(row.variacion_pp)} pp
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono-num text-[#3B526E] dark:text-[#B5CBE2]">
                        {formatNumberEs(row.informalidad)}%
                      </td>
                      <td className="py-1.5 pl-2 text-right">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#1D4ED8] dark:text-[#7DD3FC] hover:underline"
                        >
                          PDF
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Inventario de los 6 organismos + Bloque de nota + Pie IA */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
            <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
              <div className="text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-1.5">
                Bloque de nota para periodistas
              </div>
              <p className="text-[11px] leading-relaxed text-[#3B526E] dark:text-[#B5CBE2]">
                {activeRegion
                  ? `Cobertura territorial: ${activeRegion.region} registra ${formatNumberEs(
                      activeRegion.tasa
                    )}% de desocupación (${formatNumberEs(
                      activeRegion.tasa_hombres
                    )}% hombres, ${formatNumberEs(
                      activeRegion.tasa_mujeres
                    )}% mujeres).`
                  : 'Seleccione una región para generar la nota base.'}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
              <div className="text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-1">
                Arquitectura de organismos
              </div>
              <p className="text-[11px] leading-snug text-[#3B526E] dark:text-[#B5CBE2]">
                1. Cabecera y navegación · 2. Ficha de región · 3. Mapa SVG oficial · 4. Tabla regional · 5. Bloque de nota · 6. Pie con declaración de IA.
              </p>
            </div>

            <div className="rounded-xl border border-[#BFDBFE] dark:border-[#244670] bg-[#EFF6FF]/70 dark:bg-[#132945] px-3 py-2 flex items-center justify-between gap-2 text-[10.5px] text-[#0B2545] dark:text-[#E6F0FA]">
              <span>Pie institucional: código asistido por IA · cifras 100 % INE.</span>
              <button
                type="button"
                onClick={onOpenTransparency}
                className="font-semibold text-[#1D4ED8] dark:text-[#7DD3FC] underline whitespace-nowrap"
              >
                Transparencia
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* 7 · Plantillas y páginas + 8 · Estados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 7 · Plantillas y páginas */}
        <article className="lg:col-span-6 rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
            <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
              7 · Plantillas y páginas
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-lg bg-[#E6EFF8] dark:bg-[#13253E] p-0.5">
                <button
                  type="button"
                  onClick={() => setTemplateMode('template')}
                  className={`px-2 py-1 text-[10.5px] font-semibold rounded-md transition-colors ${
                    templateMode === 'template'
                      ? 'bg-white dark:bg-[#1D4ED8] text-[#1D4ED8] dark:text-white'
                      : 'text-[#475E7B] dark:text-[#94B0CF]'
                  }`}
                >
                  Plantilla vacía
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateMode('page')}
                  className={`px-2 py-1 text-[10.5px] font-semibold rounded-md transition-colors ${
                    templateMode === 'page'
                      ? 'bg-white dark:bg-[#1D4ED8] text-[#1D4ED8] dark:text-white'
                      : 'text-[#475E7B] dark:text-[#94B0CF]'
                  }`}
                >
                  Página real
                </button>
              </div>

              <div className="flex rounded-lg bg-[#E6EFF8] dark:bg-[#13253E] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  aria-label="Vista en teléfono"
                  className={`p-1 rounded-md transition-colors ${
                    viewportMode === 'mobile'
                      ? 'bg-white dark:bg-[#0284C7] text-[#1D4ED8] dark:text-white'
                      : 'text-[#475E7B] dark:text-[#94B0CF]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  aria-label="Vista en escritorio"
                  className={`p-1 rounded-md transition-colors ${
                    viewportMode === 'desktop'
                      ? 'bg-white dark:bg-[#0284C7] text-[#1D4ED8] dark:text-white'
                      : 'text-[#475E7B] dark:text-[#94B0CF]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className={`rounded-xl border border-[#BFDBFE] dark:border-[#244670] bg-white dark:bg-[#0C192C] p-3 transition-all ${
                viewportMode === 'mobile' ? 'w-[240px]' : 'w-full'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-[#5B7493] dark:text-[#8BA6C6] pb-1.5 border-b border-[#E6EFF8] dark:border-[#1E334D] mb-2">
                <span>
                  {viewportMode === 'mobile' ? 'Teléfono (375 px)' : 'Escritorio (1280 px)'}
                </span>
                <span className="font-semibold text-[#1D4ED8] dark:text-[#7DD3FC]">
                  {templateMode === 'template' ? 'Estructura sin datos' : 'Datos en vivo INE'}
                </span>
              </div>

              <div
                className={`grid gap-2 ${
                  viewportMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-12'
                }`}
              >
                <div
                  className={`${
                    viewportMode === 'mobile' ? '' : 'col-span-4'
                  } rounded-lg border border-dashed border-[#93C5FD] dark:border-[#2B4B75] bg-[#F8FBFF] dark:bg-[#10223A] p-2 text-center`}
                >
                  <div className="text-[10px] font-semibold text-[#0B2545] dark:text-[#E6F0FA]">
                    {templateMode === 'template' ? '[ Slot: Mapa territorial ]' : 'Mapa SVG · 16 regiones'}
                  </div>
                </div>

                <div
                  className={`${
                    viewportMode === 'mobile' ? '' : 'col-span-8'
                  } rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#10223A] p-2`}
                >
                  {templateMode === 'template' ? (
                    <div className="space-y-1.5">
                      <div className="h-3 w-2/3 rounded bg-[#DBEAFE] dark:bg-[#1E3E66]" />
                      <div className="h-6 w-1/3 rounded bg-[#BFDBFE] dark:bg-[#244670]" />
                      <div className="h-2.5 w-full rounded bg-[#E6EFF8] dark:bg-[#183354]" />
                    </div>
                  ) : (
                    <div>
                      <div className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                        {activeRegion?.region ?? 'Metropolitana'}
                      </div>
                      <div className="font-mono-num text-lg font-bold text-[#1D4ED8] dark:text-[#7DD3FC]">
                        {activeRegion ? `${formatNumberEs(activeRegion.tasa)}%` : '9,8%'}
                      </div>
                      <div className="text-[10px] text-[#475E7B] dark:text-[#94B0CF] truncate">
                        {activeRegion?.fuente ?? 'INE, Boletín ENE n.º 335'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 8 · Estados */}
        <article className="lg:col-span-6 rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col justify-between gap-3">
          <div className="pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
            <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
              8 · Estados: sistema e interacción de componentes
            </h2>
          </div>

          {/* 4 System states */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#1D4ED8] dark:text-[#7DD3FC]">
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                Cargando
              </div>
              <div className="mt-1.5 h-3 w-full rounded bg-[#EFF6FF] dark:bg-[#162C49]" />
            </div>

            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                <Info className="w-3 h-3 text-[#0284C7]" aria-hidden="true" />
                Sin datos
              </div>
              <p className="mt-1 text-[10px] text-[#5B7493] dark:text-[#8BA6C6]">
                Sin registros para este filtro.
              </p>
            </div>

            <div className="rounded-lg border border-[#FECACA] dark:border-[#7F1D1D] bg-[#FEF2F2] dark:bg-[#2A1215] p-2">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#B91C1C] dark:text-[#FCA5A5]">
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                Error
              </div>
              <p className="mt-1 text-[10px] text-[#991B1B] dark:text-[#FECACA]">
                Fallo de red · Reintentar.
              </p>
            </div>

            <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-2">
              <div className="text-[10.5px] font-bold text-[#475E7B] dark:text-[#94B0CF]">
                «No consta»
              </div>
              <p className="mt-1 font-mono-num text-[10px] text-[#0B2545] dark:text-[#E6F0FA]">
                Dato omitido en boletín.
              </p>
            </div>
          </div>

          {/* 5 Component interaction states */}
          <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
            <div className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
              Estados del botón (selecciona para inspeccionar):
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['normal', 'hover', 'active', 'focus', 'disabled'] as const).map((st) => {
                const labelMap = {
                  normal: 'Normal',
                  hover: 'Encima',
                  active: 'Activo',
                  focus: 'Foco',
                  disabled: 'Deshabilitado',
                };
                const styleMap = {
                  normal: 'bg-[#1D4ED8] text-white',
                  hover: 'bg-[#1E40AF] text-white',
                  active: 'bg-[#0B2545] dark:bg-[#38BDF8] text-white dark:text-[#0B2545] scale-[0.97]',
                  focus: 'bg-[#1D4ED8] text-white ring-2 ring-[#0B2545] dark:ring-[#7DD3FC] ring-offset-2 dark:ring-offset-[#0C192C]',
                  disabled: 'bg-[#DCE7F3] dark:bg-[#1E334D] text-[#647E9C] dark:text-[#5B7493] cursor-not-allowed',
                };
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={st === 'disabled'}
                    onClick={() => setActiveAtomState(st)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${styleMap[st]}`}
                  >
                    {labelMap[st]}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10.5px] text-[#5B7493] dark:text-[#8BA6C6]">
              Estado inspeccionado: <strong className="text-[#0B2545] dark:text-[#E6F0FA]">{activeAtomState}</strong>
            </p>
          </div>
        </article>
      </div>

      {/* 9 · Datos y voz */}
      <article className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-4 flex flex-col gap-3">
        <div className="pb-2 border-b border-[#E6EFF8] dark:border-[#1E334D]">
          <h2 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
            9 · Datos y voz: escala cartográfica, formato editorial y textos de ayuda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Escala de color del mapa */}
          <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
            <div className="text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
              Escala de color del mapa (5 tramos)
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { color: '#DBEAFE', range: '4,0% – 5,9%', label: 'Menor tasa' },
                { color: '#93C5FD', range: '6,0% – 7,9%', label: 'Moderada baja' },
                { color: '#60A5FA', range: '8,0% – 9,4%', label: 'Intermedia' },
                { color: '#2563EB', range: '9,5% – 10,4%', label: 'Sobre promedio' },
                { color: '#1E3A8A', range: '10,5% – 11,2%', label: 'Mayor tasa' },
              ].map((step) => (
                <div key={step.range} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-5 rounded border border-[#DCE7F3] dark:border-[#243B58] shrink-0"
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="font-mono-num text-[#0B2545] dark:text-[#F0F6FC]">
                      {step.range}
                    </span>
                  </div>
                  <span className="text-[#5B7493] dark:text-[#8BA6C6]">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Escritura de cifras, fechas, pp y fuentes */}
          <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
            <div className="text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
              Normalización de cifras y fuentes
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#3B526E] dark:text-[#B5CBE2]">
              <li>
                <strong>Porcentajes:</strong> coma decimal sin espacio antes de «%» (<span className="font-mono-num text-[#0B2545] dark:text-[#E6F0FA]">9,6%</span>).
              </li>
              <li>
                <strong>Variación interanual:</strong> signo explícito y unidad «pp» (<span className="font-mono-num text-[#0B2545] dark:text-[#E6F0FA]">+1,0 pp</span>).
              </li>
              <li>
                <strong>Fechas y trimestres:</strong> formato <span className="font-mono-num text-[#0B2545] dark:text-[#E6F0FA]">30-09-2026</span> · «junio-agosto 2026».
              </li>
              <li>
                <strong>Cita estándar:</strong> Institución, Boletín, edición y fecha exacta.
              </li>
            </ul>
          </div>

          {/* Textos de ayuda */}
          <div className="rounded-lg border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0C192C] p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" aria-hidden="true" />
              Textos de ayuda para prensa
            </div>
            <div className="space-y-2 text-[11px] leading-snug text-[#3B526E] dark:text-[#B5CBE2]">
              <p>
                <strong>¿Por qué «pp» y no «%»?</strong> Si una tasa pasa de 8,8% a 9,8%, el aumento es de +1,0 punto porcentual (pp), evitando confundir variación absoluta con relativa.
              </p>
              <p>
                <strong>¿Cómo citar?</strong> Use siempre el enlace al boletín regional PDF para respaldar despachos o investigaciones periodísticas.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="pt-3 border-t border-[#E6EFF8] dark:border-[#1E334D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="font-display text-xs sm:text-sm font-semibold text-[#0B2545] dark:text-[#E6F0FA]">
          «Un sistema de diseño vivo asegura que cada dato público conserve su rigor técnico al llegar a redacciones y ciudadanía».
        </p>
        <span className="text-[11px] text-[#5B7493] dark:text-[#8BA6C6] whitespace-nowrap shrink-0">
          Referencia metodológica · Sistema INE Chile
        </span>
      </footer>
    </section>
  );
};
