import type { Prize } from "@/types/scroll";

// Source: https://roc.gnjoy.in.th/promotion/ragnarok-festa-2026-scroll/
const IMG = "/assets/images/scroll/festa2026";

export const FESTA_2026_PRIZES: Prize[] = [
  { id: "wings-thanatos", name: "Costume Wings of Arrogant Thanatos", image: `${IMG}/WingsofArrogantThanatos.png`, quantity: 1, tier: "SSR", rate: 0.03, announce: true },
  { id: "card-album-1", name: "Sealed Card Album", image: `${IMG}/sealed.png`, quantity: 1, tier: "SSR", rate: 0.1 },
  { id: "card-album-2", name: "Sealed Card Album II", image: `${IMG}/sealed.png`, quantity: 1, tier: "SSR", rate: 0.1 },
  { id: "blue-spirit", name: "Blue Spirit Effect (Middle)", image: `${IMG}/blueeffect.png`, quantity: 1, tier: "SR", rate: 0.6 },
  { id: "enr-oridecon", name: "[NFS] Enriched Oridecon", image: `${IMG}/enri_oridecon.png`, quantity: 1, tier: "A", rate: 0.8 },
  { id: "enr-elunium", name: "[NFS] Enriched Elunium", image: `${IMG}/enri_elunium.png`, quantity: 1, tier: "A", rate: 0.8 },
  { id: "festa-stone", name: "Festa Stone Random Box", image: `${IMG}/festastone.png`, quantity: 1, tier: "A", rate: 0.87 },
  { id: "poison-box", name: "Poison Bottle Box", image: `${IMG}/poisonbox.png`, quantity: 1, tier: "A", rate: 1 },
  { id: "blood-twig", name: "Blood Twing", image: `${IMG}/bloodtwig.png`, quantity: 1, tier: "A", rate: 1 },
  { id: "agi-biscuit", name: "[Scroll] AGI Biscuit Stick", image: `${IMG}/agi_biscuit.png`, quantity: 2, tier: "B", rate: 6.1 },
  { id: "int-biscuit", name: "[Scroll] INT Biscuit Stick", image: `${IMG}/int_biscuit.png`, quantity: 2, tier: "B", rate: 6.1 },
  { id: "str-biscuit", name: "[Scroll] STR Biscuit Stick", image: `${IMG}/str_biscuit.png`, quantity: 2, tier: "B", rate: 6.1 },
  { id: "vit-biscuit", name: "[Scroll] VIT Biscuit Stick", image: `${IMG}/vit_biscuit.png`, quantity: 2, tier: "B", rate: 6.1 },
  { id: "dex-biscuit", name: "[Scroll] DEX Biscuit Stick", image: `${IMG}/dex_biscuit.png`, quantity: 2, tier: "B", rate: 6.1 },
  { id: "luk-biscuit", name: "[Scroll] LUK Biscuit Stick", image: `${IMG}/luk_biscuit.png`, quantity: 2, tier: "B", rate: 6.1 },
  { id: "perfume-matk", name: "Thai Perfume MATK", image: `${IMG}/thaiperfumematk.png`, quantity: 5, tier: "C", rate: 8 },
  { id: "perfume-aspd", name: "Thai Perfume ASPD", image: `${IMG}/thaiperfumeaspd.png`, quantity: 5, tier: "C", rate: 8 },
  { id: "mental-potion", name: "[Scroll] Mental Potion", image: `${IMG}/mental.png`, quantity: 5, tier: "B", rate: 8 },
  { id: "aspersio", name: "Lv.5 Aspersio Scroll", image: `${IMG}/aspersio.png`, quantity: 5, tier: "B", rate: 8 },
  { id: "perfume-atk", name: "Thai Perfume ATK", image: `${IMG}/thaiperfumeatk.png`, quantity: 5, tier: "C", rate: 8.1 },
  { id: "kafra-card", name: "[Scroll] Kafra Card", image: `${IMG}/kafra.png`, quantity: 5, tier: "E", rate: 9 },
  { id: "ex-def", name: "[Scroll] Ex Def Potion", image: `${IMG}/ex_def.png`, quantity: 5, tier: "E", rate: 9 },
];
