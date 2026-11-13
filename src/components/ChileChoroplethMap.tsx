import React, { useMemo, useState } from 'react';
import geoRaw from '../data/chileRegionsGeo.json';
import type {
  ChileGeoDataset,
  IneRegionData,
  MacroZoneKey,
  MapMetricKey,
} from '../types/ine';

const geoData = geoRaw as ChileGeoDataset;

interface ChileChoroplethMapProps {
  regionsData: IneRegionData[];
  selectedCode: string;
  onSelectRegion: (codigo: string) => void;
  metric: MapMetricKey;
  macroZone: MacroZoneKey;
}

const VIEWBOX_MAP: Record<MacroZoneKey, string> = {
  all: '0 0 155.7 704',
  norte: '58 4 86 278',
  centro: '32 262 72 130',
  sur: '28 360 62 130',
  austral: '6 468 118 205',
};

const STROKE_SCALE: Record<MacroZoneKey, number> = {
  all: 0.7,
  norte: 0.5,
  centro: 0.35,
  sur: 0.35,
  austral: 0.55,
};

function getBlueScaleColor(value: number, min: number, max: number, metric: MapMetricKey): string {
  const ratio = max === min ? 0.5 : Math.max(0, Math.min(1, (value - min) / (max - min)));

  if (metric === 'informalidad') {
    if (ratio < 0.2) return '#E0F2FE';
    if (ratio < 0.4) return '#BAE6FD';
    if (ratio < 0.6) return '#38BDF8';
    if (ratio < 0.8) return '#0284C7';
    return '#075985';
  }

  if (metric === 'variacion_pp') {
    if (value < 0) return '#BAE6FD';
    if (ratio < 0.4) return '#93C5FD';
    if (ratio < 0.65) return '#3B82F6';
    if (ratio < 0.85) return '#1D4ED8';
    return '#1E3A8A';
  }

  if (ratio < 0.2) return '#DBEAFE';
  if (ratio < 0.4) return '#93C5FD';
  if (ratio < 0.6) return '#60A5FA';
  if (ratio < 0.8) return '#2563EB';
  return '#1E3A8A';
}

export function formatNumberEs(n: number, decimals = 1): string {
  return n.toFixed(decimals).replace('.', ',');
}

export const ChileChoroplethMap: React.FC<ChileChoroplethMapProps> = ({
  regionsData,
  selectedCode,
  onSelectRegion,
  metric,
  macroZone,
}) => {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const dataByCode = useMemo(() => {
    const map = new Map<string, IneRegionData>();
    for (const item of regionsData) {
      map.set(item.codigo, item);
    }
    return map;
  }, [regionsData]);

  const { minVal, maxVal } = useMemo(() => {
    if (!regionsData.length) return { minVal: 0, maxVal: 10 };
    const vals = regionsData.map((r) => r[metric]);
    return {
      minVal: Math.min(...vals),
      maxVal: Math.max(...vals),
    };
  }, [regionsData, metric]);

  const hoveredItem = hoveredCode ? dataByCode.get(hoveredCode) : null;
  const activeStroke = STROKE_SCALE[macroZone];

  const metricUnit = metric === 'variacion_pp' ? ' pp' : '%';
  const metricLabel =
    metric === 'tasa'
      ? 'Desocupación'
      : metric === 'informalidad'
      ? 'Informalidad'
      : 'Variación interanual';

  return (
    <div className="relative flex h-full flex-col justify-between rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0E1E34] p-3 transition-colors">
      {/* Map Header */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#E6EFF8] dark:border-[#1E334D]">
        <span className="text-[11px] font-semibold text-[#0B2545] dark:text-[#F0F6FC]">
          Mapa regional INE
        </span>
        <span className="text-[10px] font-medium text-[#5B7493] dark:text-[#8BA6C6]">
          {metricLabel}
        </span>
      </div>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute left-3 right-3 top-10 z-20 rounded-lg border border-[#BFDBFE] dark:border-[#2B4B75] bg-white/95 dark:bg-[#0C192C]/95 px-2.5 py-1.5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#0B2545] dark:text-[#F0F6FC] truncate">
              {hoveredItem.region}
            </span>
            <span className="font-mono-num text-[11px] font-bold text-[#1D4ED8] dark:text-[#7DD3FC] shrink-0">
              {metric === 'variacion_pp' && hoveredItem[metric] > 0 ? '+' : ''}
              {formatNumberEs(hoveredItem[metric])}
              {metricUnit}
            </span>
          </div>
        </div>
      )}

      {/* SVG Map from Regiones__1__93b3efc9.zip */}
      <div className="relative my-1 flex-1 min-h-[200px] flex items-center justify-center">
        <svg
          viewBox={VIEWBOX_MAP[macroZone]}
          className="h-full w-full max-h-[320px] transition-all duration-200"
          role="img"
          aria-label="Mapa coroplético de las 16 regiones de Chile vinculado a los datos del INE"
        >
          {geoData.regions.map((geo) => {
            const datum = dataByCode.get(geo.codigo);
            const val = datum ? datum[metric] : minVal;
            const isSelected = geo.codigo === selectedCode;
            const isHovered = geo.codigo === hoveredCode;
            const fill = datum
              ? getBlueScaleColor(val, minVal, maxVal, metric)
              : '#E2E8F0';

            return (
              <path
                key={geo.codigo}
                d={geo.d}
                fill={fill}
                stroke={isSelected ? '#0B2545' : isHovered ? '#38BDF8' : '#FFFFFF'}
                strokeWidth={
                  isSelected
                    ? activeStroke * 2.4
                    : isHovered
                    ? activeStroke * 1.8
                    : activeStroke
                }
                strokeLinejoin="round"
                tabIndex={0}
                role="button"
                aria-label={`${datum?.region ?? geo.nombre_shp}: ${formatNumberEs(val)}${metricUnit}`}
                aria-pressed={isSelected}
                onClick={() => onSelectRegion(geo.codigo)}
                onMouseEnter={() => setHoveredCode(geo.codigo)}
                onMouseLeave={() => setHoveredCode(null)}
                onFocus={() => setHoveredCode(geo.codigo)}
                onBlur={() => setHoveredCode(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectRegion(geo.codigo);
                  }
                }}
                className="cursor-pointer transition-opacity duration-150 focus:outline-none"
                style={{
                  opacity:
                    hoveredCode && !isHovered && !isSelected ? 0.72 : 1,
                }}
              />
            );
          })}

          {/* Selected Region Pin Dot */}
          {geoData.regions
            .filter((g) => g.codigo === selectedCode)
            .map((g) => (
              <g key={`pin-${g.codigo}`} className="pointer-events-none">
                <circle
                  cx={g.cx}
                  cy={g.cy}
                  r={activeStroke * 4.2}
                  fill="#FFFFFF"
                  stroke="#0B2545"
                  strokeWidth={activeStroke * 1.6}
                />
                <circle
                  cx={g.cx}
                  cy={g.cy}
                  r={activeStroke * 1.8}
                  fill="#0284C7"
                />
              </g>
            ))}
        </svg>
      </div>

      {/* Cartographic Scale Legend */}
      <div className="pt-1.5 border-t border-[#E6EFF8] dark:border-[#1E334D]">
        <div className="flex items-center justify-between text-[10px] font-mono-num text-[#475E7B] dark:text-[#94B0CF] mb-1">
          <span>
            {metric === 'variacion_pp' && minVal > 0 ? '+' : ''}
            {formatNumberEs(minVal)}
            {metricUnit}
          </span>
          <span>Escala regional</span>
          <span>
            {metric === 'variacion_pp' && maxVal > 0 ? '+' : ''}
            {formatNumberEs(maxVal)}
            {metricUnit}
          </span>
        </div>
        <div
          className="grid grid-cols-5 h-1.5 rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <span className="bg-[#DBEAFE]" />
          <span className="bg-[#93C5FD]" />
          <span className="bg-[#60A5FA]" />
          <span className="bg-[#2563EB]" />
          <span className="bg-[#1E3A8A]" />
        </div>
        <p className="mt-1 text-[9.5px] text-[#647E9C] dark:text-[#7B97B8] truncate">
          Base vectorial: Regiones__1__93b3efc9.zip
        </p>
      </div>
    </div>
  );
};
