import { useCallback, useEffect, useState } from "react";
import type { PetState, SkinId } from "./petTypes";
import * as api from "./petApi";
import { COINS_PER_FOCUS_MINUTE } from "./petTypes";

export function usePet(userId: string | null) {
  const [pet, setPet] = useState<PetState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    api
      .fetchOrCreatePetState()
      .then(setPet)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  const earnCoinsForFocus = useCallback(
    async (focusMinutes: number) => {
      if (!pet) return;
      const delta = focusMinutes * COINS_PER_FOCUS_MINUTE;
      const nextCoins = await api.addCoins(pet.coins, delta);
      setPet((prev) => (prev ? { ...prev, coins: nextCoins } : prev));
      return delta;
    },
    [pet]
  );

  const spend = useCallback(
    async (amount: number) => {
      if (!pet) return false;
      if (pet.coins < amount) return false;
      const nextCoins = await api.spendCoins(pet.coins, amount);
      setPet((prev) => (prev ? { ...prev, coins: nextCoins } : prev));
      return true;
    },
    [pet]
  );

  const purchaseSkin = useCallback(
    async (skinId: SkinId, cost: number) => {
      if (!pet) return false;
      if (pet.coins < cost) return false;
      if (pet.ownedSkins.includes(skinId)) return false;
      const result = await api.buySkin(pet.coins, pet.ownedSkins, skinId, cost);
      setPet((prev) => (prev ? { ...prev, ...result } : prev));
      return true;
    },
    [pet]
  );

  const equip = useCallback(async (skinId: SkinId) => {
    setPet((prev) => (prev ? { ...prev, equippedSkin: skinId } : prev));
    await api.equipSkin(skinId);
  }, []);

  return { pet, loading, earnCoinsForFocus, spend, purchaseSkin, equip };
}
