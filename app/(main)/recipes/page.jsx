/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { Bookmark, ChefHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { getSavedRecipes } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";

export default function SavedRecipesPage() {
  const {
    loading,
    data: recipesData,
    fn: fetchSavedRecipes,
  } = useFetch(getSavedRecipes);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const recipes = recipesData?.recipes || [];

  // console.log('Users saved recipes: ', recipes) // debug log

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 to-white mt-8">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
              <Bookmark className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
                Saved{" "}
                <span className="font-serif text-orange-500">Recipes</span>
              </h1>
              <p className="text-sm text-stone-500">
                {recipes.length} recipes in your collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Loading State → Skeleton Grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-55 rounded-2xl bg-stone-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.documentId}
                recipe={recipe}
                variant="list"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="bg-orange-50 text-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mb-2">
              Your collection is empty
            </h2>

            <p className="text-stone-500 mb-8">
              Save recipes while exploring and build your personal AI-powered
              cookbook.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                  <ChefHat className="w-4 h-4" />
                  Explore Recipes
                </Button>
              </Link>

              <Link href="/pantry">
                <Button variant="outline" className="gap-2">
                  Go to Pantry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
