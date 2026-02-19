/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import {
  ArrowLeft,
  ChefHat,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {useFetch} from "@/hooks/useFetch";
import { getRecipesByPantryIngredients } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";
import PricingModal from "@/components/PricingModal";

export default function PantryRecipesPage() {
  const {
    loading,
    data: recipesData,
    fn: fetchSuggestions,
  } = useFetch(getRecipesByPantryIngredients);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const recipes = recipesData?.recipes || [];
  const ingredientsUsed = recipesData?.ingredientsUsed || "";

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 to-white mt-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/pantry"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-600 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pantry
          </Link>

          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-xl">
              <ChefHat className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
                AI Recipe <span className="font-serif text-orange-600">Suggestions</span>
              </h1>
              <p className="text-sm text-stone-500">
                Based on your available ingredients
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Context Panel */}
        {(ingredientsUsed || recipesData) && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Ingredients */}
            {ingredientsUsed && (
              <div className="bg-white border border-stone-200 rounded-2xl p-5 flex gap-3">
                <Package className="w-5 h-5 text-orange-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm mb-1">
                    Your Ingredients
                  </h3>
                  <p className="text-sm text-stone-500">{ingredientsUsed}</p>
                </div>
              </div>
            )}

            {/* Plan Status */}
            {recipesData && (
              <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 flex gap-3 items-center">
                <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />

                <div className="text-sm">
                  {recipesData.recommendationsLimit === "unlimited" ? (
                    <span className="text-green-600 font-semibold">
                      Unlimited AI recommendations ✨
                    </span>
                  ) : (
                    <span className="text-orange-700">
                      Upgrade to Pro for unlimited AI suggestions
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading → Skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-stone-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && recipes.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-stone-900">
                  Top Matches
                </h2>
              </div>

              <Badge variant="secondary">{recipes.length} recipes</Badge>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} variant="pantry" />
              ))}
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => fetchSuggestions(new FormData())}
                disabled={loading}
                className="gap-2"
                variant="outline"
              >
                <Sparkles className="w-4 h-4" />
                Get New Suggestions
              </Button>
            </div>
          </>
        )}

        {/* Empty Pantry */}
        {!loading && recipes.length === 0 && recipesData?.success === false && (
          <div className="text-center py-20">
            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-semibold text-stone-900 mb-2">
              Your pantry is empty
            </h3>

            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Add ingredients to unlock AI-powered recipe suggestions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pantry/scan">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                  <Sparkles className="w-4 h-4" />
                  Scan with AI
                </Button>
              </Link>

              <Link href="/pantry">
                <Button variant="outline">Add Manually</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Rate Limit */}
        {!loading && recipesData === undefined && (
          <div className="text-center py-20">
            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-semibold text-stone-900 mb-2">
              Monthly limit reached
            </h3>

            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Upgrade to Pro for unlimited AI-powered recipe generation.
            </p>

            <PricingModal>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                Upgrade to Pro
              </Button>
            </PricingModal>
          </div>
        )}
      </div>
    </div>
  );
}
