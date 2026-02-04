import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import YAML from "yaml";
import path from "path";

interface Recipe {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rotation_group: string;
  ingredients: string[];
  prep_time: number;
}

const app = express();
app.use(cors()); // ✅ allow cross-origin requests
const PORT = 3000;

// --- Load recipes ---
function loadRecipes(): Recipe[] {
  const file = fs.readFileSync("./data/recipes.yaml", "utf8");
  const parsed = YAML.parse(file);

  if (!parsed?.recipes) {
    throw new Error("Invalid recipes.yaml format");
  }

  return parsed.recipes as Recipe[];
}

// --- Load ingredient categories ---
function loadIngredientCategories(): Record<string, string> {
  const file = fs.readFileSync("./data/ingredientCategories.json", "utf8");
  return JSON.parse(file) as Record<string, string>;
}

// --- API routes ---
app.get("/api/recipes", (_req: Request, res: Response) => {
  const recipes = loadRecipes().map((r) => ({
    ...r,
    imageUrl: `/images/${r.image}`,
  }));

  res.json(recipes);
});

app.get("/api/ingredientCategories", (_req: Request, res: Response) => {
  const categories = loadIngredientCategories();
  res.json(categories);
});

// --- Static images ---
app.use("/images", express.static(path.resolve("./images")));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
