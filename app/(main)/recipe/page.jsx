/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Flame,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useFetch";
import {
  getOrGenerateRecipe,
  saveRecipeToCollection,
  removeRecipeFromCollection,
} from "@/actions/recipe.actions";
import { toast } from "sonner";
import Image from "next/image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RecipePDF } from "@/components/RecipePDF";
import ProLockedSection from "@/components/ProLockedSection";
import { ClockLoader } from "react-spinners";

/* -------------------------------------------------------------------------- */
/*                               UI HELPERS                                   */
/* -------------------------------------------------------------------------- */

const Meta = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 text-sm text-stone-600">
    <Icon className="w-4 h-4 text-orange-600" />
    {children}
  </div>
);

const groupIngredients = (ingredients) =>
  ingredients.reduce((acc, ing) => {
    const cat = ing.category || "Other";
    acc[cat] = acc[cat] || [];
    acc[cat].push(ing);
    return acc;
  }, {});

const StepItem = ({ step }) => (
  <div className="relative pl-12">
    <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-semibold shadow">
      {step.step}
    </div>

    <h3 className="font-semibold text-stone-900 mb-2">{step.title}</h3>

    <p className="text-stone-600 leading-relaxed mb-3">{step.instruction}</p>

    {step.tip && (
      <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 text-sm text-orange-900">
        <Lightbulb className="w-4 h-4 inline mr-2" />
        <strong>Pro tip:</strong> {step.tip}
      </div>
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

function RecipeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recipeName = searchParams.get("cook");

  const [recipe, setRecipe] = useState(null);
  const [recipeId, setRecipeId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const {
    loading: loadingRecipe,
    data: recipeData,
    fn: fetchRecipe,
  } = useFetch(getOrGenerateRecipe);

  const {
    loading: saving,
    data: saveData,
    fn: saveToCollection,
  } = useFetch(saveRecipeToCollection);

  const {
    loading: removing,
    data: removeData,
    fn: removeFromCollection,
  } = useFetch(removeRecipeFromCollection);

  /* ------------------------------ FETCH RECIPE ----------------------------- */

  useEffect(() => {
    if (recipeName && !recipe) {
      const formData = new FormData();
      formData.append("recipeName", recipeName);
      fetchRecipe(formData);
    }
  }, [recipeName]);

  useEffect(() => {
    if (recipeData?.success) {
      setRecipe(recipeData.recipe);
      setRecipeId(recipeData.recipeId);
      setIsSaved(recipeData.isSaved);

      toast.success(
        recipeData.fromDatabase
          ? "Recipe loaded from database"
          : "New recipe generated!",
      );
    }
  }, [recipeData]);

  useEffect(() => {
    if (saveData?.success) setIsSaved(true);
  }, [saveData]);

  useEffect(() => {
    if (removeData?.success) setIsSaved(false);
  }, [removeData]);

  const handleToggleSave = async () => {
    if (!recipeId) return;

    const formData = new FormData();
    formData.append("recipeId", recipeId);

    isSaved
      ? await removeFromCollection(formData)
      : await saveToCollection(formData);
  };

  /* -------------------------------------------------------------------------- */
  /*                                STATES UI                                   */
  /* -------------------------------------------------------------------------- */

  if (!recipeName) return <EmptyState />;

  if (loadingRecipe === null || loadingRecipe)
    return <LoadingState recipeName={recipeName} />;

  if (loadingRecipe === false && !recipe) return <ErrorState router={router} />;

  /* -------------------------------------------------------------------------- */
  /*                                 MAIN UI                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 to-white pt-20 pb-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* HERO */}
        <Hero
          recipe={recipe}
          isSaved={isSaved}
          saving={saving}
          removing={removing}
          handleToggleSave={handleToggleSave}
        />

        {/* GRID */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-8">
          {/* SIDEBAR */}
          <IngredientsSidebar recipe={recipe} recipeData={recipeData} />

          {/* MAIN CONTENT */}
          <div className="space-y-8">
            <Instructions recipe={recipe} />
            <Tips recipe={recipe} recipeData={recipeData} />
            <Substitutions recipe={recipe} recipeData={recipeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              HERO SECTION                                  */
/* -------------------------------------------------------------------------- */

const Hero = ({ recipe, isSaved, saving, removing, handleToggleSave }) => (
  <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border mb-10">
    {recipe.imageUrl && (
      <div className="relative h-65 sm:h-80 w-full">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>
    )}

    <div className="relative p-5 sm:p-8 -mt-16 sm:-mt-24">
      <div className="rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl border p-5 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className="bg-orange-100 text-orange-700 border-none capitalize">
            {recipe.cuisine}
          </Badge>
          <Badge variant="secondary">{recipe.category}</Badge>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold">{recipe.title}</h1>

        <p className="mt-3 text-stone-600 max-w-2xl">{recipe.description}</p>

        <div className="flex flex-wrap gap-4 mt-5">
          <Meta icon={Clock}>
            {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} mins
          </Meta>
          <Meta icon={Users}>{recipe.servings} servings</Meta>
          {recipe.nutrition?.calories && (
            <Meta icon={Flame}>{recipe.nutrition.calories} cal</Meta>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            onClick={handleToggleSave}
            className="rounded-xl cursor-pointer"
          >
            {isSaved ? (
              <BookmarkCheck className="mr-2 w-4 h-4" />
            ) : (
              <Bookmark className="mr-2 w-4 h-4" />
            )}
            {isSaved ? "Saved" : "Save recipe"}
          </Button>

          <PDFDownloadLink
            document={<RecipePDF recipe={recipe} />}
            fileName={`${recipe.title}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="outline"
                className="rounded-xl cursor-pointer"
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                {loading ? "Preparing..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                          INGREDIENTS SIDEBAR                               */
/* -------------------------------------------------------------------------- */

const IngredientsSidebar = ({ recipe, recipeData }) => (
  <div className="lg:sticky lg:top-24 h-fit">
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
        <ChefHat className="w-5 h-5 text-orange-600" />
        Ingredients
      </h2>

      {Object.entries(groupIngredients(recipe.ingredients)).map(
        ([category, items]) => (
          <div key={category} className="mb-6 last:mb-0">
            <p className="text-xs font-semibold text-stone-400 uppercase mb-2">
              {category}
            </p>

            <ul className="space-y-2 text-sm">
              {items.map((ing, i) => (
                <li key={i} className="flex justify-between">
                  <span>{ing.item}</span>
                  <span className="text-orange-600 font-medium">
                    {ing.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      )}

      {/* Nutrition */}
      {recipe.nutrition && (
        <div className="mt-6 pt-6 border-t">
          <ProLockedSection
            isPro={recipeData.isPro}
            lockText="Nutrition is Pro-only"
          >
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <Nutrition label="Calories" value={recipe.nutrition.calories} />
              <Nutrition label="Protein" value={recipe.nutrition.protein} />
              <Nutrition label="Carbs" value={recipe.nutrition.carbs} />
              <Nutrition label="Fat" value={recipe.nutrition.fat} />
            </div>
          </ProLockedSection>
        </div>
      )}
    </div>
  </div>
);

const Nutrition = ({ label, value }) => (
  <div className="bg-stone-50 rounded-xl p-3">
    <div className="font-semibold text-stone-900">{value}</div>
    <div className="text-xs text-stone-500">{label}</div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                              INSTRUCTIONS                                  */
/* -------------------------------------------------------------------------- */

const Instructions = ({ recipe }) => (
  <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
    <h2 className="text-xl font-semibold mb-8">Step-by-step instructions</h2>

    <div className="space-y-10">
      {recipe.instructions.map((step) => (
        <StepItem key={step.step} step={step} />
      ))}
    </div>

    <div className="mt-10 rounded-xl bg-green-50 border border-green-200 p-5 flex gap-3">
      <CheckCircle2 className="text-green-600" />
      <p className="text-green-800 text-sm">
        You&apos;re all done! Enjoy your delicious {recipe.title}.
      </p>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                             TIPS & SUBS                                    */
/* -------------------------------------------------------------------------- */

const Tips = ({ recipe, recipeData }) =>
  recipe.tips?.length ? (
    <div className="rounded-2xl border bg-orange-50 p-6 sm:p-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="text-orange-600" />
        Chef’s tips
      </h2>

      <ProLockedSection isPro={recipeData.isPro} lockText="Pro feature">
        <ul className="space-y-3 text-sm text-stone-700">
          {recipe.tips.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <CheckCircle2 className="text-orange-600 w-4 h-4 mt-1" />
              {tip}
            </li>
          ))}
        </ul>
      </ProLockedSection>
    </div>
  ) : null;

const Substitutions = ({ recipe, recipeData }) =>
  recipe.substitutions?.length ? (
    <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Substitutions</h2>

      <ProLockedSection isPro={recipeData.isPro} lockText="Pro feature">
        <div className="space-y-4">
          {recipe.substitutions.map((sub, i) => (
            <div key={i}>
              <p className="font-medium mb-2">
                Instead of{" "}
                <span className="text-orange-600">{sub.original}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sub.alternatives.map((alt, j) => (
                  <Badge key={j} variant="secondary">
                    {alt}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ProLockedSection>
    </div>
  ) : null;

/* -------------------------------------------------------------------------- */
/*                              STATES                                        */
/* -------------------------------------------------------------------------- */

const LoadingState = ({ recipeName }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <ClockLoader color="#ea580c" />
    <h2 className="text-2xl font-semibold mt-6">Preparing your recipe</h2>
    <p className="text-stone-500 mt-2">{recipeName}</p>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <AlertCircle className="w-10 h-10 text-orange-600 mb-4" />
    <p>No recipe selected</p>
  </div>
);

const ErrorState = ({ router }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
    <p className="mb-4">Failed to load recipe</p>
    <Button onClick={() => router.back()}>Go back</Button>
  </div>
);

/* -------------------------------------------------------------------------- */

export default function RecipePage() {
  return (
    <Suspense fallback={<LoadingState recipeName="Loading..." />}>
      <RecipeContent />
    </Suspense>
  );
}
