"use client";

import { useParams } from "next/navigation";
import RecipeGrid from "@/components/RecipeGrid";
import { getMealsByArea } from "@/actions/mealdb.actions";

export default function CategoryRecipesPage() {
  const params = useParams();
  const cuisine = params.cuisine();

  return (
    <RecipeGrid
      type="cuisine"
      value={cuisine}
      fetchActions={getMealsByArea}
      backlink="/dashboard"
    />
  );
}
