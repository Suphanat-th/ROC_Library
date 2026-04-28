export interface MapFilter {
  label: string;
  icon: string;
  color: "primary" | "warning" | "error" | "secondary" | "info" | "success" | "ghost" | "outline";
  key: string;
}

export interface DungeonMapHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  credits?: string;
  notes?: string[];
  logoPath?: string;
}

export interface DungeonMapControlsProps {
  filters: Record<string, boolean>;
  onFilterChange: (filterKey: string, value: boolean) => void;
  filterOptions: MapFilter[];
  onReset?: () => void;
  additionalControls?: React.ReactNode;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export interface DungeonMapContainerProps {
  mapName: string;
  mapDescription?: string;
  mapSubtitle?: string;
  credits?: string;
  notes?: string[];
  logoPath?: string;
  filters: Record<string, boolean>;
  onFilterChange: (filterKey: string, value: boolean) => void;
  filterOptions: MapFilter[];
  onReset?: () => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  children: React.ReactNode;
  additionalControls?: React.ReactNode;
  showControls?: boolean;
}
