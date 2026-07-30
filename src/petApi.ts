import { supabase } from "./supabaseClient";
import type { PetState, SkinId } from "./petTypes";

interface PetStateRow {
  user_id: string;
  coins: number;
  equipped_skin: string;
  owned_skins: string[];
}

function mapRow(row: PetStateRow): PetState {
  return {
    coins: row.coins,
    equippedSkin: row.equipped_skin as SkinId,
    ownedSkins: row.owned_skins as SkinId[],
  };
}

export async function fetchOrCreatePetState(): Promise<PetState> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { data: existing, error: fetchError } = await supabase
    .from("pet_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (fetchError) throw fetchError;

  if (existing) return mapRow(existing as PetStateRow);

  const { data: created, error: insertError } = await supabase
    .from("pet_state")
    .insert({ user_id: userId })
    .select()
    .single();
  if (insertError) throw insertError;
  return mapRow(created as PetStateRow);
}

export async function addCoins(currentCoins: number, delta: number): Promise<number> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const nextCoins = currentCoins + delta;
  const { error } = await supabase
    .from("pet_state")
    .update({ coins: nextCoins, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
  return nextCoins;
}

export async function spendCoins(currentCoins: number, amount: number): Promise<number> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const nextCoins = currentCoins - amount;
  const { error } = await supabase
    .from("pet_state")
    .update({ coins: nextCoins, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
  return nextCoins;
}

export async function buySkin(
  currentCoins: number,
  ownedSkins: SkinId[],
  skinId: SkinId,
  cost: number
): Promise<{ coins: number; ownedSkins: SkinId[] }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const nextCoins = currentCoins - cost;
  const nextOwned = [...ownedSkins, skinId];

  const { error } = await supabase
    .from("pet_state")
    .update({ coins: nextCoins, owned_skins: nextOwned, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
  return { coins: nextCoins, ownedSkins: nextOwned };
}

export async function equipSkin(skinId: SkinId): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { error } = await supabase
    .from("pet_state")
    .update({ equipped_skin: skinId, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
}
