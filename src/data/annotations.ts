import type { ProductZoneId } from '../types/ine';

export interface DesignAnnotation {
  id: Exclude<ProductZoneId, null>;
  number: string;
  title: string;
  description: string;
  targetLabel: string;
}

export const PRODUCT_ANNOTATIONS: DesignAnnotation[] = [
  {
    id: 'identity',
    number: '1',
    title: 'IDENTIDAD VISUAL',
    description:
      'Tonalidades azules, tipografía amigable y componentes consistentes para generar una experiencia cercana, institucional y accesible.',
    targetLabel: 'Cabecera institucional y escala cromática',
  },
  {
    id: 'organization',
    number: '2',
    title: 'ORGANIZACIÓN DE LA INFORMACIÓN',
    description:
      'Tarjetas estadísticas, selectores territoriales y visualizaciones que permiten identificar rápidamente los indicadores relevantes.',
    targetLabel: 'Mapa territorial INE y fichas métricas',
  },
  {
    id: 'context',
    number: '3',
    title: 'CONTEXTUALIZACIÓN DE LOS DATOS',
    description:
      'Incorporación de fuentes, variaciones temporales y comparaciones regionales para facilitar la interpretación de los resultados.',
    targetLabel: 'Comparativa nacional, variación pp y boletín',
  },
  {
    id: 'citizen',
    number: '4',
    title: 'EXPERIENCIA CIUDADANA',
    description:
      'Diseñada para periodistas, recolectores de información y ciudadanía mediante navegación simplificada, explicaciones accesibles y adaptación multidispositivo.',
    targetLabel: 'Lectura periodística y filtros territoriales',
  },
];
