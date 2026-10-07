export interface ArtistRef {
  name: string;
  slug: string;
}

export interface AlbumInfo {
  title: string;
  slug: string;
  year: number;
  formato: string;
  precio: number;
  stock: number;
  destacado: boolean;
}

export interface AlbumArt {
  coverPath: string;
  backgroundMode:
    | "immersive-fullbleed"
    | "immersive-glitch"
    | "immersive-baroque"
    | "immersive-portrait";
  fx: string[];
}

export interface AlbumPalette {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  surface2: string;
  textContrast: string;
  mood: string;
}

export interface AlbumAudio {
  trackTitle: string;
  src: string | null;
  license: "local-demo" | "preview-licensed" | "pending-asset";
  loop: boolean;
  targetGainDb: number;
}

export interface AlbumFx {
  glitch: number;
  noise: number;
  ornament: number;
  texture: "liquid" | "static" | "velvet" | "matte";
}

export interface Section {
  id: string;
  order: number;
  artist: ArtistRef;
  album: AlbumInfo;
  genres: string[];
  art: AlbumArt;
  palette: AlbumPalette;
  audio: AlbumAudio;
  fx: AlbumFx;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  description: string;
}

export interface CatalogContent {
  site: SiteInfo;
  sections: Section[];
}

export interface CartItem {
  slug: string;
  title: string;
  artist: string;
  coverPath: string;
  price: number;
  qty: number;
  accent: string;
}
