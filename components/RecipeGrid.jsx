"use client";

import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
// import useFetch from "@/hooks/useFetch";
import RecipeCard from "@/components/RecipeCard";
import { useFetch } from "@/hooks/useFetch";

export default function RecipeGrid({
  type, // "category" or "cuisine"
  value, // actual category/cuisine name
  fetchAction, // server action to fetch meals
  backLink = "/dashboard",
}) {
  const { loading, data, fn: fetchMeals } = useFetch(fetchAction);

  useEffect(() => {
    if (value) {
      // Capitalize first letter for API call
      const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
      fetchMeals(formattedValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const meals = data?.meals || [];
  const displayName = value?.replace(/-/g, " "); // Convert "saudi-arabian" to "saudi arabian"

  return (
    <div className="min-h-screen bg-stone-50/50 pt-12 pb-20 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-6">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors px-4 py-2 rounded-full hover:bg-stone-200/50 w-fit -ml-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 capitalize tracking-tight leading-[1.1]">
              {displayName}
              <span className="text-orange-600 block sm:inline sm:ml-4 font-serif">
                {type === "cuisine" ? "Cuisine" : "Recipes"}
              </span>
            </h1>

            {!loading && meals.length > 0 && (
              <p className="text-xl text-stone-500 max-w-2xl font-light">
                Found {meals.length} delicious {displayName.toLowerCase()}{" "}
                {type === "cuisine" ? "dishes" : "recipes"} for you to try.
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-6" />
            <p className="text-stone-400 font-medium text-lg animate-pulse">
              Curating recipes...
            </p>
          </div>
        )}

        {/* Meals Grid - Using RecipeCard */}
        {!loading && meals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
            {meals.map((meal) => (
              <RecipeCard key={meal.idMeal} recipe={meal} variant="grid" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && meals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl shadow-sm border border-stone-100 mx-auto max-w-2xl px-6">
            <div className="text-8xl mb-8 opacity-80">🍳</div>
            <h3 className="text-3xl font-bold text-stone-900 mb-4">
              No recipes found
            </h3>
            <p className="text-stone-500 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any {displayName}{" "}
              {type === "cuisine" ? "dishes" : "recipes"} at the moment.
            </p>
            <Link href={backLink}>
              <span className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-stone-900/20">
                <ArrowLeft className="w-4 h-4" />
                Explore other categories
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}