import { z } from 'zod';

// Schema untuk data pemain bola
export const TopPlayerSchema = z.object({
  // rank: z.number(), // Bisa kosong
  name: z.string(),
  full_name: z.string(),
  heros: z.array(z.string()),
  image: z.string().optional(),
  nation: z.string(),
  nation_code: z.string(),
  team: z.string(),
  date_of_birth: z.string(),
  roles: z.array(z.string()),
  date_of_join: z.string(),
});

// Type yang dihasilkan dari schema
export type TopPlayer = z.infer<typeof TopPlayerSchema>;

// Schema untuk array data pemain bola
export const TopPlayersSchema = z.array(TopPlayerSchema);

// Fungsi untuk memvalidasi data dengan debugging
export const validateTopPlayers = (data: unknown) => {
  try {
    console.log("Validating data:", data);
    const validatedData = TopPlayersSchema.parse(data);
    console.log("Validation successful:", validatedData);
    return validatedData;
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
};