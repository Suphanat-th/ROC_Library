
export interface Monster {
  name: string;
  image: string;
  lv: number;
  hp: number;
  race: string;
  property: string;
  scale: string;
  def: number;
  mdef: number;
  hit: number;
  element: ElementMonster;
}
export interface ElementMonster {
  [key: string]: number;
  neutral: number;
  water: number;
  earth: number;
  fire: number;
  wind: number;
  poison: number;
  holy: number;
  shadow: number;
  ghost: number;
  undead: number;
}