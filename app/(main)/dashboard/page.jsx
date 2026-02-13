import { Globe, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getRecipeOfTheDay,
  getCategories,
  getAreas,
} from "@/actions/mealdb.actions";
import { getCategoryEmoji, getCountryFlag } from "@/lib/data";

export default async function DashboardPage() {
  // Fetch data server-side
  const recipeData = await getRecipeOfTheDay();
  const categoriesData = await getCategories();
  const areasData = await getAreas();

  const recipeOfTheDay = recipeData?.recipe;
  const categories = categoriesData?.categories || [];
  const areas = areasData?.areas || [];

  return (
    <div className="min-h-screen bg-stone-50/50">
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header Section */}
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
              What are we cooking <br className="hidden md:block" />
              <span className="text-orange-600 font-serif italic">today?</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-500 font-light leading-relaxed">
              Explore thousands of recipes from around the globe.{" "}
              <br className="hidden md:block" />
              From quick bites to gourmet feasts.
            </p>
          </div>
          <div className="hidden md:block">
            <Button
              variant="outline"
              className="rounded-full px-6 border-stone-200 text-stone-600 hover:text-orange-600 hover:border-orange-200 transition-colors"
            >
              Surprise Me <Flame className="w-4 h-4 ml-2 text-orange-500" />
            </Button>
          </div>
        </header>

        {/* Recipe of the Day - Hero Section */}
        {recipeOfTheDay && (
          <section className="mb-24 md:mb-32">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-orange-100 to-amber-100 text-orange-600 shadow-sm ring-1 ring-orange-200/50">
                <Flame className="w-5 h-5" />
              </span>
              <span className="text-sm font-bold tracking-widest text-orange-600 uppercase font-serif">
                Daily Highlight
              </span>
            </div>

            <div className="bg-white rounded-[2rem] p-4 md:p-6 shadow-xl shadow-stone-200/50 border border-stone-100 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-200/50 group">
              <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
                {/* Content */}
                <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 px-4 md:px-6 pb-4 md:pb-6 lg:py-8">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge
                      variant="secondary"
                      className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none px-3 py-1 text-xs font-semibold tracking-wide uppercase"
                    >
                      {recipeOfTheDay.strCategory}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-stone-500 border-stone-200 px-3 py-1 text-xs font-medium tracking-wide uppercase flex items-center gap-1.5"
                    >
                      <Globe className="w-3 h-3" />
                      {recipeOfTheDay.strArea}
                    </Badge>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight transition-colors duration-300 ">
                    {recipeOfTheDay.strMeal}
                  </h2>

                  <p className="text-stone-600 mb-8 line-clamp-3 leading-relaxed text-base md:text-lg">
                    {recipeOfTheDay.strInstructions
                      ?.replace(/^STEP \d+\s*|^Step \d+\s*|^\d+\.\s*/i, "")
                      .substring(0, 180)}
                    ...&rdquo;
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <Link
                      href={`/recipe?cook=${encodeURIComponent(recipeOfTheDay.strMeal)}`}
                    >
                      <Button
                        size="lg"
                        className="rounded-full cursor-pointer bg-stone-900 text-white hover:bg-orange-600 transition-colors duration-300 px-8 h-12 text-base shadow-xl shadow-stone-900/20 hover:shadow-orange-600/20"
                      >
                        View Recipe <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="lg:col-span-7 order-1 lg:order-2">
                  <div className="relative aspect-4/3 lg:aspect-16/10 w-full overflow-hidden rounded-[1.5rem] bg-stone-200">
                    <Image
                      src={recipeOfTheDay.strMealThumb}
                      alt={recipeOfTheDay.strMeal}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categories Grid */}
        <section className="mb-24 md:mb-32">
          <div className="flex items-end justify-between mb-10 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">
                Categories
              </h2>
              <p className="text-stone-500">
                Curated collections for every craving
              </p>
            </div>
            <Link
              href="/categories"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.strCategory}
                href={`/recipes/category/${category.strCategory.toLowerCase()}`}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl p-6 border border-stone-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50/50 transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <span className="text-4xl md:text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 block mb-2">
                    {getCategoryEmoji(category.strCategory)}
                  </span>
                  <h3 className="font-semibold text-stone-700 group-hover:text-orange-600 transition-colors text-sm md:text-base">
                    {category.strCategory}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cuisines Section */}
        <section className="pb-12">
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">
              Global Kitchen
            </h2>
            <p className="text-stone-500">Travel the world from your kitchen</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {areas.map((area) => (
              <Link
                key={area.strArea}
                href={`/recipes/cuisine/${area.strArea
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="group"
              >
                <div className="bg-white rounded-xl px-5 py-4 border border-stone-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 flex items-center gap-3">
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {getCountryFlag(area.strArea)}
                  </span>
                  <span className="font-medium text-stone-600 group-hover:text-orange-600 transition-colors text-sm truncate">
                    {area.strArea}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
