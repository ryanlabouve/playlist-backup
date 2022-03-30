export interface User {
  accessToken?: string;
}

export interface PlaylistItemImg {
  height: string;
  url: string;
}

export interface Playlist {
  href: string;
  id: string;
  images?: PlaylistItemImg[];
  name: string;
}

export interface Track {
  data: any;
  name: string;
  id: string;
  href: string;
  duration_ms: string;
  preview_url: string;
  uri: string;
}

export interface PlaylistMeta {
  offset: number;
  previous: string;
  next: string;
  limit: number;
  href: string;
  total: number;
}
