import { supabase } from "./supabase";

export const ScoreService = {
  async saveScore(
    exerciseType: "qcm" | "dragdrop" | "numpad",
    score: number,
    total: number,
  ): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return; // pas connecté → pas de sauvegarde

    const { error } = await supabase.from("scores").insert({
      student_id: user.id,
      exercise_type: exerciseType,
      score,
      total,
    });

    if (error) console.error("Erreur sauvegarde score:", error);
    else console.log("Score sauvegardé ✅");
  },
};
