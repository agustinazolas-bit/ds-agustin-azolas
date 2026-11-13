import React, { useEffect } from 'react';
import { CheckCircle2, Database, FileCode2, ShieldCheck, X } from 'lucide-react';

interface AiTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiTransparencyModal: React.FC<AiTransparencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/55 dark:bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-transparency-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-[#DCE7F3] dark:border-[#243B58] bg-white dark:bg-[#0C192C] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6EFF8] dark:border-[#1E334D]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] dark:bg-[#183354] text-[#1D4ED8] dark:text-[#7DD3FC]">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                Dimensión 10 · Accesibilidad e IA
              </p>
              <h2
                id="ai-transparency-title"
                className="font-display text-lg font-bold text-[#0B2545] dark:text-[#F0F6FC]"
              >
                Fundamentación de transparencia sobre el uso de IA generativa
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de transparencia"
            className="rounded-lg p-1.5 text-[#475E7B] dark:text-[#94B0CF] hover:bg-[#F4F8FC] dark:hover:bg-[#162C49] hover:text-[#0B2545] dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4 text-sm text-[#3B526E] dark:text-[#B5CBE2]">
          <p className="leading-relaxed">
            En concordancia con los principios de trazabilidad y responsabilidad para periodistas y recolectores de información, se explicita exactamente cómo y dónde intervino la inteligencia artificial generativa:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#10223A] p-3.5">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
                <FileCode2 className="w-4 h-4 text-[#1D4ED8] dark:text-[#7DD3FC]" aria-hidden="true" />
                Dónde se utilizó IA generativa
              </div>
              <ul className="space-y-1.5 text-xs leading-relaxed">
                <li>
                  <strong>Arquitectura frontend:</strong> Estructuración asistida de componentes React, TypeScript y tokens de diseño (colores, tipografía y espaciados) bajo la metodología Atomic Design.
                </li>
                <li>
                  <strong>Procesamiento cartográfico:</strong> Escritura del script de conversión del archivo oficial <code className="font-mono-num text-[#1D4ED8] dark:text-[#7DD3FC]">Regiones__1__93b3efc9.zip</code> (Shapefile EPSG:3857) hacia polígonos SVG ligeros y accesibles.
                </li>
                <li>
                  <strong>Documentación viva:</strong> Sistematización interactiva de átomos, moléculas, organismos, plantillas, estados y guía de datos y voz.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#DCE7F3] dark:border-[#1E334D] bg-[#F8FBFF] dark:bg-[#10223A] p-3.5">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-[#0B2545] dark:text-[#F0F6FC] mb-2">
                <Database className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8]" aria-hidden="true" />
                Integridad de datos sin generación sintética
              </div>
              <ul className="space-y-1.5 text-xs leading-relaxed">
                <li>
                  <strong>Cero cifras inventadas:</strong> Ningún indicador fue estimado, simulado o completado por un modelo de lenguaje.
                </li>
                <li>
                  <strong>Fuente directa en tiempo real:</strong> Todas las tasas regionales y nacionales provienen del endpoint <code className="font-mono-num text-[#0369A1] dark:text-[#38BDF8]">workers.dev/regiones</code> vinculado al Boletín ENE n.º 335 del INE.
                </li>
                <li>
                  <strong>Lectura determinística:</strong> Los resúmenes para prensa y ciudadanía se construyen mediante reglas fijas sobre las cifras exactas de la API.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[#BFDBFE] dark:border-[#244670] bg-[#EFF6FF]/60 dark:bg-[#132945] p-3 flex items-start gap-2.5 text-xs text-[#0B2545] dark:text-[#E6F0FA]">
            <CheckCircle2 className="w-4 h-4 text-[#1D4ED8] dark:text-[#7DD3FC] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Trazabilidad garantizada:</strong> Cada cifra desplegada conserva la cita textual del boletín regional correspondiente y enlace directo al PDF oficial del INE y a su serie histórica en Excel.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#E6EFF8] dark:border-[#1E334D] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#0B2545] dark:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#163B6B] dark:hover:bg-[#2563EB] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
