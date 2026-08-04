import { useState } from "react";
import { Check, Lock } from "lucide-react";
import Modal from "./Modal";
import Cat from "./Cat";
import CoinIcon from "./CoinIcon";
import { useLanguage } from "../i18n";
import { SKINS, SNACKS } from "../petTypes";
import type { PetState, SkinId } from "../petTypes";

interface PetShopModalProps {
  pet: PetState;
  onClose: () => void;
  onBuySkin: (skinId: SkinId, cost: number) => Promise<boolean>;
  onEquip: (skinId: SkinId) => void;
  onFeedSnack: (cost: number) => Promise<boolean>;
}

export default function PetShopModal({ pet, onClose, onBuySkin, onEquip, onFeedSnack }: PetShopModalProps) {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"skins" | "snacks">("skins");
  const [fedFlash, setFedFlash] = useState<string | null>(null);

  const handleSnack = async (id: string, cost: number) => {
    const ok = await onFeedSnack(cost);
    if (ok) {
      setFedFlash(id);
      setTimeout(() => setFedFlash(null), 1200);
    }
  };

  return (
    <Modal title={t("pet.shopTitle")} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex rounded-full bg-neutral-100 p-1 text-xs font-medium">
          <button
            onClick={() => setTab("skins")}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              tab === "skins" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
            }`}
          >
            {t("pet.tabSkins")}
          </button>
          <button
            onClick={() => setTab("snacks")}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              tab === "snacks" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
            }`}
          >
            {t("pet.tabSnacks")}
          </button>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-amber-700">
          <CoinIcon size={16} /> {pet.coins}
        </span>
      </div>

      {tab === "skins" ? (
        <div className="grid grid-cols-2 gap-3">
          {SKINS.map((skin) => {
            const owned = pet.ownedSkins.includes(skin.id);
            const equipped = pet.equippedSkin === skin.id;
            const canAfford = pet.coins >= skin.cost;
            return (
              <div
                key={skin.id}
                className={`rounded-xl border p-3 flex flex-col items-center gap-2 ${
                  equipped ? "border-teal-500 bg-teal-50" : "border-neutral-200"
                }`}
              >
                <div className="h-16 w-16">
                  <Cat mood="idle" skin={skin.id} />
                </div>
                <p className="text-xs font-medium text-neutral-700 text-center">
                  {lang === "zh" ? skin.nameZh : skin.nameEn}
                </p>
                {owned ? (
                  <button
                    onClick={() => onEquip(skin.id)}
                    disabled={equipped}
                    className={`w-full text-xs rounded-full px-2 py-1 font-medium flex items-center justify-center gap-1 ${
                      equipped
                        ? "bg-teal-500 text-white"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {equipped ? (
                      <>
                        <Check size={12} /> {t("pet.equipped")}
                      </>
                    ) : (
                      t("pet.equip")
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => onBuySkin(skin.id, skin.cost)}
                    disabled={!canAfford}
                    className="w-full text-xs rounded-full px-2 py-1 font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 flex items-center justify-center gap-1"
                  >
                    {!canAfford && <Lock size={11} />} <CoinIcon size={13} /> {skin.cost}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {SNACKS.map((snack) => {
            const canAfford = pet.coins >= snack.cost;
            return (
              <div
                key={snack.id}
                className="rounded-xl border border-neutral-200 p-3 flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{snack.emoji}</span>
                <p className="text-xs font-medium text-neutral-700 text-center">
                  {lang === "zh" ? snack.nameZh : snack.nameEn}
                </p>
                <button
                  onClick={() => handleSnack(snack.id, snack.cost)}
                  disabled={!canAfford}
                  className="w-full text-xs rounded-full px-2 py-1 font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 flex items-center justify-center gap-1"
                >
                  {fedFlash === snack.id ? (
                    t("pet.fed")
                  ) : (
                    <>
                      <CoinIcon size={13} /> {snack.cost}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
