export interface ServerInfoDto {
  name: string;
  ratePercent: number;
  DateFrom: Date | null;
  DateTo: Date | null;
  description?: string;
}

/** One Rate (EXP / DROP / DEATH): its Base rate plus every Rate event, past or future. */
export interface RateSource {
  base: ServerInfoDto;
  events: ServerInfoDto[];
}
