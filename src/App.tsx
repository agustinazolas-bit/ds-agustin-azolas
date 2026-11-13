import { useCallback, useEffect, useState } from 'react';
import { AiTransparencyModal } from './components/AiTransparencyModal';
import { SlideOneAtomicDesign } from './components/SlideOneAtomicDesign';
import { SlideThreeDesignSystem } from './components/SlideThreeDesignSystem';
import { SlideTwoProductDesign } from './components/SlideTwoProductDesign';
import { TopNav } from './components/TopNav';
import type { IneApiResponse } from './types/ine';

const INE_API_URL = 'https://ia-toolkit.agustin-azolas.workers.dev/regiones';

export default function App() {
  const [activeSlide, setActiveSlide] = useState<1 | 2 | 3>(1);
  const [transparencyOpen, setTransparencyOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ine-ds-theme') === 'dark';
    } catch {
      return false;
    }
  });

  const [ineData, setIneData] = useState<IneApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>('RM');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('ine-ds-theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  const fetchRegionsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(INE_API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al consultar estadísticas regionales.`);
      }
      const json: IneApiResponse = await response.json();
      setIneData(json);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo establecer conexión con el servicio de estadísticas del INE.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegionsData();
  }, [fetchRegionsData]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (transparencyOpen) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'SELECT' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA')
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setActiveSlide((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)));
      } else if (e.key === 'ArrowLeft') {
        setActiveSlide((prev) => (prev === 1 ? 3 : ((prev - 1) as 1 | 2 | 3)));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [transparencyOpen]);

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col bg-[#F4F8FC] dark:bg-[#07111F] text-[#0B2545] dark:text-[#E6F0FA] transition-colors"
    >
      <TopNav
        activeSlide={activeSlide}
        onSelectSlide={setActiveSlide}
        onOpenTransparency={() => setTransparencyOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      <main className="flex-1 flex flex-col justify-center px-4 py-4 lg:px-8 lg:py-5">
        {activeSlide === 1 && (
          <SlideOneAtomicDesign
            onOpenTransparency={() => setTransparencyOpen(true)}
          />
        )}

        {activeSlide === 2 && (
          <SlideTwoProductDesign
            data={ineData}
            loading={loading}
            error={error}
            onRetry={fetchRegionsData}
            selectedRegionCode={selectedRegionCode}
            onSelectRegion={setSelectedRegionCode}
          />
        )}

        {activeSlide === 3 && (
          <SlideThreeDesignSystem
            data={ineData}
            selectedRegionCode={selectedRegionCode}
            onSelectRegion={setSelectedRegionCode}
            onOpenTransparency={() => setTransparencyOpen(true)}
            isDark={isDark}
          />
        )}
      </main>

      <AiTransparencyModal
        isOpen={transparencyOpen}
        onClose={() => setTransparencyOpen(false)}
      />
    </div>
  );
}
