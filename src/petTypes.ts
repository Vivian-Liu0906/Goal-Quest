export type SkinId = "default" | "bowtie" | "scarf" | "partyhat" | "sunglasses" | "crown";

export interface SkinDef {
  id: SkinId;
  nameZh: string;
  nameEn: string;
  cost: number;
}

export const SKINS: SkinDef[] = [
  { id: "default", nameZh: "素颜猫咪", nameEn: "Plain Cat", cost: 0 },
  { id: "bowtie", nameZh: "领结", nameEn: "Bowtie", cost: 150 },
  { id: "scarf", nameZh: "围巾", nameEn: "Scarf", cost: 300 },
  { id: "partyhat", nameZh: "派对帽", nameEn: "Party Hat", cost: 500 },
  { id: "sunglasses", nameZh: "墨镜", nameEn: "Sunglasses", cost: 750 },
  { id: "crown", nameZh: "皇冠", nameEn: "Crown", cost: 1200 },
];

export interface SnackDef {
  id: string;
  nameZh: string;
  nameEn: string;
  cost: number;
  emoji: string;
}

export const SNACKS: SnackDef[] = [
  { id: "yarn", nameZh: "毛线球", nameEn: "Yarn Ball", cost: 20, emoji: "🧶" },
  { id: "fish", nameZh: "小鱼干", nameEn: "Fish Treat", cost: 40, emoji: "🐟" },
  { id: "milk", nameZh: "牛奶", nameEn: "Milk", cost: 60, emoji: "🥛" },
  { id: "premium", nameZh: "高级零食", nameEn: "Premium Treat", cost: 100, emoji: "🍗" },
];

export const COINS_PER_FOCUS_MINUTE = 1;

export interface PetState {
  coins: number;
  equippedSkin: SkinId;
  ownedSkins: SkinId[];
}
