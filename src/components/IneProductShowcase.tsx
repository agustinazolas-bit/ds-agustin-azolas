import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  FileSpreadsheet,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import type {
  IneApiResponse,
  IneRegionData,
  MacroZoneKey,
  MapMetricKey,
  ProductZoneId,
} from '../types/ine';
import { ChileChoroplethMap, formatNumberEs } from './ChileChoroplethMap';

interface IneProductShowcaseProps {
  data: IneApiResponse | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedRegionCode: string;
  onSelectRegion: (codigo: string) => void;
  highlightedZone: ProductZoneId;
}

const MACRO_ZONES: { key: MacroZoneKey; label: string; codes: string[] }[] = [
  { key: 'all', label: 'Todo Chile', codes: [] },
  { key: 'norte', label: 'Norte', codes: ['AP', 'TA', 'AN', 'AT', 'CO'] },
  { key: 'centro', label: 'Centro', codes: ['VS', 'RM', 'LI', 'ML', 'NB', 'BI'] },
  { key: 'sur', label: 'Sur', codes: ['AR', 'LR', 'LL'] },
  { key: 'austral', label: 'Austral', codes: ['AI', 'MA'] },
];

function buildJournalistSummary(region: IneRegionData, nationalRate: number): string {
  const diff = region.tasa - nationalRate;
  const diffAbs = formatNumberEs(Math.abs(diff));
  const compText =
    Math.abs(diff) < 0.05
      ? 'igual al promedio nacional'
      : diff > 0
      ? `${diffAbs} puntos porcentuales sobre el promedio nacional`
      : `${diffAbs} puntos porcentuales bajo el promedio nacional`;

  const varText =
    region.variacion_pp > 0
      ? `subió ${formatNumberEs(region.variacion_pp)} pp en 12 meses`
      : region.variacion_pp < 0
      ? `bajó ${formatNumberEs(Math.abs(region.variacion_pp))} pp en 12 meses`
      : 'se mantuvo sin variación en 12 meses';

  return `En ${region.region}, la desocupación fue ${formatNumberEs(region.tasa)}% (${compText}) y ${varText}. Informalidad regional: ${formatNumberEs(region.informalidad)}%.`;
}

export const IneProductShowcase: React.FC<IneProductShowcaseProps> = ({
  data,
  loading,
  error,
  onRetry,
  selectedRegionCode,
  onSelectRegion,
  highlightedZone,
}) => {
  const [metric, setMetric] = useState<MapMetricKey>('tasa');
  const [macroZone, setMacroZone] = useState<MacroZoneKey>('all');

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

  const topComparatorRegions = useMemo(() => {
    if (!data?.regiones?.length) return [];
    const ordered = [...data.regiones].sort((a, b) => b.tasa - a.tasa);
    const picks = [ordered[0], ordered[1], ordered[ordered.length - 1]];
    if (activeRegion && !picks.some((p) => p.codigo === activeRegion.codigo)) {
      picks.splice(2, 0, activeRegion);
    }
    return picks;
  }, [data, activeRegion]);

  const handleZoneChange = (zone: MacroZoneKey) => {
    setMacroZone(zone);
    if (zone !== 'all' && data?.regiones) {
      const zoneDef = MACRO_ZONES.find((z) => z.key === zone);
      if (zoneDef && !zoneDef.codes.includes(selectedRegionCode)) {
        const firstInZone = data.regiones.find((r) => zoneDef.codes.includes(r.codigo));
        if (firstInZone) onSelectRegion(firstInZone.codigo);
      }
    }
  };

  const zoneRing = (zone: Exclude<ProductZoneId, null>) =>
    highlightedZone === zone
      ? 'ring-2 ring-[#0284C7] dark:ring-[#38BDF8] ring-offset-2 ring-offset-white dark:ring-offset-[#0C192C] transition-all duration-150'
      : 'transition-all duration-150';

  if (loading) {
    return (
      <div
        className="flex h-full flex-col justify-between rounded-xl border border-[#C7DAEE] dark:border-[#1E334D] bg-white dark:bg-[#0F1F35] p-4"
        aria-busy="true"
        aria-label="Cargando datos estadísticos del INE"
      >
        <div className="h-10 rounded-lg bg-[#EFF6FF] dark:bg-[#162C49] animate-pulse" />
        <div className="my-3 grid flex-1 grid-cols-12 gap-3">
          <div className="col-span-4 rounded-xl bg-[#F4F8FC] dark:bg-[#13253E] animate-pulse" />
          <div className="col-span-8 flex flex-col gap-3">
            <div className="h-24 rounded-xl bg-[#F4F8FC] dark:bg-[#13253E] animate-pulse" />
            <div className="flex-1 rounded-xl bg-[#F4F8FC] dark:bg-[#13253E] animate-pulse" />
          </div>
        </div>
        <div className="h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#162C49] animate-pulse" />
      </div>
    );
  }

  if (error || !data || !activeRegion) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-[#C7DAEE] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#0F1F35] p-6 text-center">
        <AlertCircle className="w-8 h-8 text-[#1D4ED8] dark:text-[#7DD3FC] mb-2" aria-hidden="true" />
        <h3 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC]">
          No fue posible cargar los datos del INE
        </h3>
        <p className="mt-1 max-w-md text-xs text-[#475E7B] dark:text-[#94B0CF]">
          {error ?? 'El servicio de estadísticas regionales no devolvió resultados.'}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Reintentar conexión
        </button>
      </div>
    );
  }

  const varUp = activeRegion.variacion_pp > 0;
  const varDown = activeRegion.variacion_pp < 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-[#C7DAEE] dark:border-[#243B58] bg-white dark:bg-[#0F1F35] shadow-sm overflow-hidden transition-colors">
      {/* Zone 1: Institutional Platform Header (IDENTIDAD VISUAL) */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 bg-[#0B2545] dark:bg-[#091526] px-4 py-2.5 text-white ${zoneRing(
          'identity'
        )}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1D4ED8] font-display text-xs font-extrabold tracking-tight text-white shrink-0">
            INE
          </div>
          <div>
            <div className="font-display text-xs font-bold leading-tight text-white">
              Plataforma de Empleo para Periodistas y Recolectores
            </div>
            <div className="text-[10.5px] text-[#BAE6FD] flex flex-wrap items-center gap-1.5">
              <span>Boletín ENE n.º {data.boletin}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{data.trimestre}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{data.fecha_publicacion}</span>
            </div>
          </div>
        </div>

        {/* Zone 4 control: Macro-zone & Region Selector (EXPERIENCIA CIUDADANA) */}
        <div className={`flex flex-wrap items-center gap-2 ${zoneRing('citizen')}`}>
          <div
            className="hidden sm:flex items-center gap-0.5 rounded-lg bg-[#163B6B] p-0.5"
            role="group"
            aria-label="Filtrar por macrozona"
          >
            {MACRO_ZONES.map((z) => (
              <button
                key={z.key}
                type="button"
                onClick={() => handleZoneChange(z.key)}
                className={`px-2 py-1 text-[10.5px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  macroZone === z.key
                    ? 'bg-[#0284C7] text-white'
                    : 'text-[#CBD5E1] hover:text-white'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>

          <label htmlFor="region-select" className="sr-only">
            Seleccionar región de Chile
          </label>
          <select
            id="region-select"
            value={activeRegion.codigo}
            onChange={(e) => onSelectRegion(e.target.value)}
            className="rounded-lg border border-[#3B82F6]/40 bg-[#163B6B] px-2.5 py-1 text-[11px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]"
          >
            {sortedRegions.map((reg) => (
              <option key={reg.codigo} value={reg.codigo}>
                {reg.region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <div className="grid flex-1 grid-cols-1 md:grid-cols-12 gap-3 p-3.5 bg-[#F8FBFF] dark:bg-[#0A1628]">
        {/* Left Column: Choropleth Map from ZIP (ORGANIZACIÓN DE LA INFORMACIÓN) */}
        <div
          className={`md:col-span-4 flex flex-col gap-2 min-h-[250px] ${zoneRing(
            'organization'
          )}`}
        >
          {/* Metric Switcher for Map */}
          <div
            className="grid grid-cols-3 gap-1 rounded-lg bg-[#E6EFF8] dark:bg-[#13253E] p-1"
            role="group"
            aria-label="Indicador del mapa"
          >
            <button
              type="button"
              onClick={() => setMetric('tasa')}
              className={`rounded-md py-1 text-[10px] font-semibold transition-colors whitespace-nowrap ${
                metric === 'tasa'
                  ? 'bg-white dark:bg-[#1D4ED8] text-[#1D4ED8] dark:text-white shadow-xs'
                  : 'text-[#475E7B] dark:text-[#94B0CF] hover:text-[#0B2545] dark:hover:text-white'
              }`}
            >
              Desocupación
            </button>
            <button
              type="button"
              onClick={() => setMetric('informalidad')}
              className={`rounded-md py-1 text-[10px] font-semibold transition-colors whitespace-nowrap ${
                metric === 'informalidad'
                  ? 'bg-white dark:bg-[#0284C7] text-[#0284C7] dark:text-white shadow-xs'
                  : 'text-[#475E7B] dark:text-[#94B0CF] hover:text-[#0B2545] dark:hover:text-white'
              }`}
            >
              Informalidad
            </button>
            <button
              type="button"
              onClick={() => setMetric('variacion_pp')}
              className={`rounded-md py-1 text-[10px] font-semibold transition-colors whitespace-nowrap ${
                metric === 'variacion_pp'
                  ? 'bg-white dark:bg-[#1D4ED8] text-[#1D4ED8] dark:text-white shadow-xs'
                  : 'text-[#475E7B] dark:text-[#94B0CF] hover:text-[#0B2545] dark:hover:text-white'
              }`}
            >
              Var. (pp)
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <ChileChoroplethMap
              regionsData={data.regiones}
              selectedCode={activeRegion.codigo}
              onSelectRegion={onSelectRegion}
              metric={metric}
              macroZone={macroZone}
            />
          </div>
        </div>

        {/* Right Column: Regional Cards, Context & Synthesis */}
        <div className="md:col-span-8 flex flex-col justify-between gap-2.5">
          {/* Selected Region Headline + National Reference */}
          <div
            className={`rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0F1F35] p-3 ${zoneRing(
              'organization'
            )}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-[#EDF3FA] dark:border-[#1E334D]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1D4ED8] dark:text-[#7DD3FC] shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base font-bold text-[#0B2545] dark:text-[#F0F6FC] leading-tight">
                    Región de {activeRegion.region}
                  </h3>
                  <p className="text-[11px] text-[#5B7493] dark:text-[#8BA6C6]">
                    Código territorial: <span className="font-mono-num font-semibold text-[#0B2545] dark:text-[#E6F0FA]">{activeRegion.codigo}</span> · Trimestre {data.trimestre}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-medium text-[#5B7493] dark:text-[#8BA6C6]">
                  Referencia nacional (Chile)
                </div>
                <div className="font-mono-num text-sm font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                  {formatNumberEs(data.nacional.tasa)}%{' '}
                  <span className="text-[11px] font-medium text-[#1D4ED8] dark:text-[#7DD3FC]">
                    ({data.nacional.variacion_pp > 0 ? '+' : ''}
                    {formatNumberEs(data.nacional.variacion_pp)} pp)
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Key KPI Molecules */}
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-lg bg-[#EFF6FF] dark:bg-[#142946] p-2.5">
                <div className="text-[10.5px] font-medium text-[#3B526E] dark:text-[#9FC1E8]">
                  Desocupación
                </div>
                <div className="mt-0.5 font-mono-num text-xl font-bold text-[#1D4ED8] dark:text-[#7DD3FC]">
                  {formatNumberEs(activeRegion.tasa)}%
                </div>
                <div className="mt-0.5 text-[10px] text-[#475E7B] dark:text-[#8BA6C6]">
                  Tasa regional
                </div>
              </div>

              <div className="rounded-lg bg-[#F4F8FC] dark:bg-[#10223A] border border-[#E6EFF8] dark:border-[#1E334D] p-2.5">
                <div className="text-[10.5px] font-medium text-[#3B526E] dark:text-[#9FC1E8]">
                  Variación 12 meses
                </div>
                <div className="mt-0.5 flex items-center gap-1 font-mono-num text-lg font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                  {varUp && (
                    <ArrowUpRight className="w-4 h-4 text-[#1D4ED8] dark:text-[#7DD3FC]" aria-hidden="true" />
                  )}
                  {varDown && (
                    <ArrowDownRight className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8]" aria-hidden="true" />
                  )}
                  <span>
                    {varUp ? '+' : ''}
                    {formatNumberEs(activeRegion.variacion_pp)} pp
                  </span>
                </div>
                <div className="mt-0.5 text-[10px] text-[#475E7B] dark:text-[#8BA6C6]">
                  {varUp ? 'Alza interanual' : varDown ? 'Baja interanual' : 'Sin cambio'}
                </div>
              </div>

              <div className="rounded-lg bg-[#F4F8FC] dark:bg-[#10223A] border border-[#E6EFF8] dark:border-[#1E334D] p-2.5">
                <div className="text-[10.5px] font-medium text-[#3B526E] dark:text-[#9FC1E8]">
                  Ocupación informal
                </div>
                <div className="mt-0.5 font-mono-num text-xl font-bold text-[#0369A1] dark:text-[#38BDF8]">
                  {formatNumberEs(activeRegion.informalidad)}%
                </div>
                <div className="mt-0.5 text-[10px] text-[#475E7B] dark:text-[#8BA6C6]">
                  Sobre total ocupados
                </div>
              </div>

              <div className="rounded-lg bg-[#F4F8FC] dark:bg-[#10223A] border border-[#E6EFF8] dark:border-[#1E334D] p-2.5">
                <div className="text-[10.5px] font-medium text-[#3B526E] dark:text-[#9FC1E8]">
                  Por sexo (H / M)
                </div>
                <div className="mt-1 flex items-baseline gap-1.5 font-mono-num text-sm font-bold text-[#0B2545] dark:text-[#F0F6FC]">
                  <span>{formatNumberEs(activeRegion.tasa_hombres)}%</span>
                  <span className="text-[#8BA3C0] font-normal">/</span>
                  <span className="text-[#1D4ED8] dark:text-[#7DD3FC]">{formatNumberEs(activeRegion.tasa_mujeres)}%</span>
                </div>
                <div className="mt-1 text-[10px] text-[#475E7B] dark:text-[#8BA6C6]">
                  Hombres vs. Mujeres
                </div>
              </div>
            </div>
          </div>

          {/* Context & Comparison Row (CONTEXTUALIZACIÓN DE LOS DATOS) */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${zoneRing('context')}`}>
            {/* Sex Breakdown Bars */}
            <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0F1F35] p-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
                <span>Brecha por sexo en {activeRegion.region}</span>
                <span className="font-mono-num text-[10px] text-[#5B7493] dark:text-[#8BA6C6]">
                  Dif: {formatNumberEs(Math.abs(activeRegion.tasa_mujeres - activeRegion.tasa_hombres))} pp
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10.5px] text-[#3B526E] dark:text-[#B5CBE2] mb-0.5">
                    <span>Hombres</span>
                    <span className="font-mono-num font-semibold text-[#0B2545] dark:text-[#F0F6FC]">
                      {formatNumberEs(activeRegion.tasa_hombres)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EFF6FF] dark:bg-[#142946] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#38BDF8] transition-all duration-200"
                      style={{ width: `${Math.min(100, (activeRegion.tasa_hombres / 15) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10.5px] text-[#3B526E] dark:text-[#B5CBE2] mb-0.5">
                    <span>Mujeres</span>
                    <span className="font-mono-num font-semibold text-[#1D4ED8] dark:text-[#7DD3FC]">
                      {formatNumberEs(activeRegion.tasa_mujeres)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EFF6FF] dark:bg-[#142946] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1D4ED8] dark:bg-[#3B82F6] transition-all duration-200"
                      style={{ width: `${Math.min(100, (activeRegion.tasa_mujeres / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Reference Bars */}
            <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-white dark:bg-[#0F1F35] p-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#0B2545] dark:text-[#F0F6FC] mb-1.5">
                <span>Contraste regional (Chile: {formatNumberEs(data.nacional.tasa)}%)</span>
              </div>
              <div className="space-y-1.5">
                {topComparatorRegions.map((item) => {
                  const isCurrent = item.codigo === activeRegion.codigo;
                  return (
                    <button
                      key={item.codigo}
                      type="button"
                      onClick={() => onSelectRegion(item.codigo)}
                      className="w-full text-left group focus-visible:outline-2 focus-visible:outline-[#1D4ED8] rounded"
                    >
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span
                          className={`truncate ${
                            isCurrent
                              ? 'font-bold text-[#1D4ED8] dark:text-[#7DD3FC]'
                              : 'text-[#3B526E] dark:text-[#B5CBE2] group-hover:text-[#0B2545] dark:group-hover:text-white'
                          }`}
                        >
                          {item.region}
                        </span>
                        <span className="font-mono-num font-semibold text-[#0B2545] dark:text-[#F0F6FC]">
                          {formatNumberEs(item.tasa)}%
                        </span>
                      </div>
                      <div className="mt-0.5 h-1.5 w-full rounded-full bg-[#EFF6FF] dark:bg-[#142946] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-200 ${
                            isCurrent
                              ? 'bg-[#1D4ED8] dark:bg-[#38BDF8]'
                              : 'bg-[#93C5FD] dark:bg-[#2563EB]/60'
                          }`}
                          style={{ width: `${Math.min(100, (item.tasa / 13) * 100)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Journalist / Citizen Translation + Official Source Footer */}
          <div
            className={`rounded-xl border border-[#BFDBFE] dark:border-[#244670] bg-[#EFF6FF]/70 dark:bg-[#132945] px-3 py-2.5 flex flex-col gap-1.5 ${zoneRing(
              'citizen'
            )}`}
          >
            <p className="text-[11.5px] leading-snug text-[#0B2545] dark:text-[#E6F0FA]">
              <span className="font-bold text-[#1D4ED8] dark:text-[#7DD3FC]">Nota verificable para prensa y ciudadanía: </span>
              {buildJournalistSummary(activeRegion, data.nacional.tasa)}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DBEAFE] dark:border-[#1E3A5F] text-[10.5px] text-[#3B526E] dark:text-[#B5CBE2]">
              <span className="truncate max-w-[420px]" title={activeRegion.fuente}>
                Fuente: {activeRegion.fuente}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={activeRegion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#1D4ED8] dark:text-[#7DD3FC] hover:underline"
                >
                  Boletín PDF
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a
                  href={data.serie_excel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#0369A1] dark:text-[#38BDF8] hover:underline"
                >
                  Serie Excel
                  <FileSpreadsheet className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
