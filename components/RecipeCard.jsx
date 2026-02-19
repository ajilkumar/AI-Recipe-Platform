import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecipeCard({ recipe, variant = "default" }) {
  // Handle different recipe data structures
  const getRecipeData = () => {
    // For MealDB recipes (category/cuisine pages)
    if (recipe.strMeal) {
      return {
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
        showImage: true,
      };
    }

    // For AI-generated pantry recipes
    if (recipe.matchPercentage) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage,
        missingIngredients: recipe.missingIngredients || [],
        image: recipe.imageUrl, // Add image support
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl, // Show if image exists
      };
    }

    // For Strapi recipes (saved recipes, search results)
    if (recipe) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }

    return {};
  };

  const data = getRecipeData();

  // Variant: grid (for category/cuisine pages with images)
  if (variant === "grid") {
    return (
      <Link href={data.href} className="group">
        <Card className="h-full rounded-2xl overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            {data.showImage ? (
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="relative w-full h-full bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <ChefHat className="w-12 h-12 text-orange-200" />
              </div>
            )}

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Card Content */}
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-bold text-stone-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
              {data.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    );
  }

  // Variant: pantry (for AI-generated suggestions with match percentage)
  if (variant === "pantry") {
    return (
      <Card className="rounded-none border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        {/* Image at top (if available) */}
        {data.showImage && (
          <div className="relative aspect-video">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Match Percentage Badge on Image */}
            {data.matchPercentage && (
              <div className="absolute top-4 right-4">
                <Badge
                  className={`${
                    data.matchPercentage >= 90
                      ? "bg-green-600"
                      : data.matchPercentage >= 75
                        ? "bg-orange-600"
                        : "bg-stone-600"
                  } text-white text-lg px-3 py-1.5 shadow-lg`}
                >
                  {data.matchPercentage}% Match
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {data.cuisine && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200 capitalize"
                  >
                    {data.cuisine}
                  </Badge>
                )}
                {data.category && (
                  <Badge
                    variant="outline"
                    className="text-stone-600 border-stone-200 capitalize"
                  >
                    {data.category}
                  </Badge>
                )}
              </div>
            </div>
            {/* Match Percentage Badge (if no image) */}
            {!data.showImage && data.matchPercentage && (
              <div className="flex flex-col items-end gap-1">
                <Badge
                  className={`${
                    data.matchPercentage >= 90
                      ? "bg-green-600"
                      : data.matchPercentage >= 75
                        ? "bg-orange-600"
                        : "bg-stone-600"
                  } text-white text-lg px-3 py-1`}
                >
                  {data.matchPercentage}%
                </Badge>
                <span className="text-xs text-stone-500">Match</span>
              </div>
            )}
          </div>

          <CardTitle className="text-2xl font-serif font-bold text-stone-900">
            {data.title}
          </CardTitle>

          {data.description && (
            <CardDescription className="text-stone-600 leading-relaxed mt-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Time & Servings */}
          {(data.prepTime || data.cookTime || data.servings) && (
            <div className="flex gap-4 text-sm text-stone-500">
              {(data.prepTime || data.cookTime) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {parseInt(data.prepTime || 0) +
                      parseInt(data.cookTime || 0)}{" "}
                    mins
                  </span>
                </div>
              )}
              {data.servings && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{data.servings} servings</span>
                </div>
              )}
            </div>
          )}

          {/* Missing Ingredients */}
          {data.missingIngredients && data.missingIngredients.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-100">
              <h4 className="text-sm font-semibold text-orange-900 mb-2">
                You&apos;ll need:
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.missingIngredients.map((ingredient, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-orange-700 border-orange-200 bg-white"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Link href={data.href} className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
              <ChefHat className="w-4 h-4" />
              View Full Recipe
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Variant: list (for saved recipes, search results)
  if (variant === "list") {
    return (
      <Link href={data.href} className="group block h-full">
        <Card className="h-full overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200">
          <div className="flex flex-col sm:flex-row h-full">
            {/* Image */}
            <div className="ml-2 rounded-xl relative w-full sm:w-44 md:w-52 aspect-4/3 sm:aspect-square shrink-0 overflow-hidden bg-stone-100">
              {data.showImage ? (
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 200px"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                  <ChefHat className="w-10 h-10 text-orange-300" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
              {/* Top badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {data.cuisine && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200 capitalize"
                  >
                    {data.cuisine}
                  </Badge>
                )}
                {data.category && (
                  <Badge
                    variant="outline"
                    className="text-stone-600 border-stone-200 capitalize"
                  >
                    {data.category}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-stone-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                {data.title}
              </h3>

              {/* Description */}
              {data.description && (
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                  {data.description}
                </p>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Meta */}
              {(data.prepTime || data.cookTime || data.servings) && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mt-4">
                  {(data.prepTime || data.cookTime) && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>
                        {parseInt(data.prepTime || 0) +
                          parseInt(data.cookTime || 0)}{" "}
                        mins
                      </span>
                    </div>
                  )}

                  {data.servings && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{data.servings} servings</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant (fallback)
  return (
    <Link href={data.href}>
      <Card className="rounded-none border-stone-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden py-0">
        {data.showImage && (
          <div className="relative aspect-video">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg">{data.title}</CardTitle>
          {data.description && (
            <CardDescription className="line-clamp-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
