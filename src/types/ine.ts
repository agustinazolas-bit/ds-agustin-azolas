export interface IneNationalData {
  tasa: number;
  variacion_pp: number;
  fuente: string;
  url: string;
}

export interface IneRegionData {
  region: string;
  codigo: string;
  tasa: number;
  variacion_pp: number;
  tasa_hombres: number;
  tasa_mujeres: number;
  informalidad: number;
  fuente: string;
  url: string;
}

export interface IneApiResponse {
  trimestre: string;
  fecha_publicacion: string;
  boletin: number;
  serie_excel: string;
  nacional: IneNationalData;
  regiones: IneRegionData[];
  via?: string;
}

export interface ChileGeoRegion {
  codigo: string;
  codregion: string;
  nombre_shp: string;
  area_km: number;
  cx: number;
  cy: number;
  bbox: [number, number, number, number];
  d: string;
}

export interface ChileGeoDataset {
  source: string;
  viewBox: string;
  width: number;
  height: number;
  regions: ChileGeoRegion[];
}

export type MapMetricKey = 'tasa' | 'informalidad' | 'variacion_pp';
export type MacroZoneKey = 'all' | 'norte' | 'centro' | 'sur' | 'austral';
export type ProductZoneId = 'identity' | 'organization' | 'context' | 'citizen' | null;
