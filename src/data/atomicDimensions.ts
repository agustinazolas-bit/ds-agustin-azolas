export interface AtomicDimension {
  index: string;
  title: string;
  description: string;
  keyword: string;
  stage: 'Definición' | 'Fundación' | 'Composición' | 'Operación' | 'Ética';
  iconName:
    | 'compass'
    | 'shield'
    | 'palette'
    | 'circleDot'
    | 'layers'
    | 'layoutGrid'
    | 'smartphone'
    | 'activity'
    | 'messageSquare'
    | 'eye';
}

export const ATOMIC_DIMENSIONS: AtomicDimension[] = [
  {
    index: '01',
    title: 'EL PRODUCTO',
    description:
      'Plataforma orientada esencialmente a periodistas y recolectores de información para consultar indicadores del INE, seleccionar regiones y comparar resultados verificables hacia la ciudadanía.',
    keyword: 'PROPÓSITO',
    stage: 'Definición',
    iconName: 'compass',
  },
  {
    index: '02',
    title: 'PRINCIPIOS',
    description:
      'Transparencia, accesibilidad, comprensión y trazabilidad. Toda cifra debe tener una fuente identificable y conservar su rigurosidad al traducirse a lenguaje ciudadano.',
    keyword: 'CONFIANZA',
    stage: 'Definición',
    iconName: 'shield',
  },
  {
    index: '03',
    title: 'TOKENS',
    description:
      'Definición de la identidad visual mediante una escala cromática azul, tipografías, espaciados, dimensiones y propiedades gráficas consistentes.',
    keyword: 'CONSISTENCIA',
    stage: 'Fundación',
    iconName: 'palette',
  },
  {
    index: '04',
    title: 'ÁTOMOS',
    description:
      'Elementos mínimos de interacción: botones, etiquetas, selectores, campos, iconos y cifras estadísticas.',
    keyword: 'ELEMENTOS',
    stage: 'Fundación',
    iconName: 'circleDot',
  },
  {
    index: '05',
    title: 'MOLÉCULAS',
    description:
      'Agrupación de elementos básicos para formar componentes funcionales: tarjetas estadísticas, selectores regionales, leyendas cartográficas y fuentes.',
    keyword: 'COMPOSICIÓN',
    stage: 'Composición',
    iconName: 'layers',
  },
  {
    index: '06',
    title: 'ORGANISMOS',
    description:
      'Integración de componentes complejos: cabecera, navegación, fichas regionales, mapas, tablas y bloques explicativos.',
    keyword: 'ESTRUCTURA',
    stage: 'Composición',
    iconName: 'layoutGrid',
  },
  {
    index: '07',
    title: 'PLANTILLAS Y PÁGINAS',
    description:
      'Separación entre la estructura visual reutilizable y las páginas que incorporan datos reales de los boletines del INE. Adaptación a dispositivos móviles y computadores.',
    keyword: 'ESCALABILIDAD',
    stage: 'Operación',
    iconName: 'smartphone',
  },
  {
    index: '08',
    title: 'ESTADOS',
    description:
      'Representación de situaciones de interacción y funcionamiento: carga, ausencia de datos, errores, información no disponible, selección y foco.',
    keyword: 'RESPUESTA',
    stage: 'Operación',
    iconName: 'activity',
  },
  {
    index: '09',
    title: 'DATOS Y VOZ',
    description:
      'Normalización de porcentajes, puntos porcentuales, fechas y fuentes. Definición de un lenguaje ciudadano que facilite la comprensión sin perder precisión estadística.',
    keyword: 'COMUNICACIÓN',
    stage: 'Ética',
    iconName: 'messageSquare',
  },
  {
    index: '10',
    title: 'ACCESIBILIDAD E IA',
    description:
      'Contraste, legibilidad, navegación mediante foco, textos alternativos y transparencia sobre el uso de inteligencia artificial en el procesamiento y presentación de información.',
    keyword: 'RESPONSABILIDAD',
    stage: 'Ética',
    iconName: 'eye',
  },
];
