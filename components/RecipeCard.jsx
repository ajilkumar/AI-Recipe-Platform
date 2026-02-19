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
    if (recipe.matchPercentage !== undefined) {
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
      <Card className="h-full flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

        {data.showImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader className="pb-3">

          {/* TAG ROW WITH MATCH % */}
          <div className="flex justify-between gap-2 mb-2">
<div className="flex items-center justify-center">
            {data.cuisine && (
              <Badge variant="outline" className="capitalize">
                {data.cuisine}
              </Badge>
            )}

            {data.category && (
              <Badge variant="outline" className="capitalize">
                {data.category}
              </Badge>
            )}
            </div>

            <div>

            {data.matchPercentage !== undefined && (
              <Badge
                className={`text-white ${
                  data.matchPercentage >= 90
                    ? "bg-green-600"
                    : data.matchPercentage >= 75
                    ? "bg-orange-600"
                    : "bg-stone-600"
                }`}
              >
                {data.matchPercentage}% Match
              </Badge>
            )}
            </div>
          </div>

          <CardTitle className="text-xl font-semibold text-stone-900 leading-snug">
            {data.title}
          </CardTitle>

          {data.description && (
            <CardDescription className="line-clamp-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1">

          {/* META */}
          <div className="flex flex-wrap gap-4 text-sm text-stone-500">
            {(data.prepTime || data.cookTime) && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {parseInt(data.prepTime || 0) +
                  parseInt(data.cookTime || 0)}{" "}
                mins
              </div>
            )}

            {data.servings && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {data.servings} servings
              </div>
            )}
          </div>

          {/* MISSING INGREDIENTS */}
          {data.missingIngredients?.length > 0 && (
            <div className="rounded-xl bg-orange-50 p-3 border border-orange-100">
              <p className="text-xs font-medium text-orange-800 mb-2">
                Missing ingredients
              </p>
              <div className="flex flex-wrap gap-2">
                {data.missingIngredients.map((ing, i) => (
                  <Badge key={i} variant="outline" className="bg-white">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Link href={data.href} className="w-full">
            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 cursor-pointer">
              <ChefHat className="w-4 h-4" />
              View Recipe
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
