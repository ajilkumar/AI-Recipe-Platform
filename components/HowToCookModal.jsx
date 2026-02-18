"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function HowToCookModal() {
  const router = useRouter();
  const [recipeName, setRecipeName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipeName.trim()) {
      toast.error("Please enter a recipe name");
      return;
    }

    router.push(`/recipe?cook=${encodeURIComponent(recipeName.trim())}`);
    handleOpenChange(false);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) setRecipeName("");
  };

  const examples = [
    "Butter Chicken",
    "Chocolate Brownies",
    "Caesar Salad",
    "Masala Dosa",
    "Ramen",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* TRIGGER */}
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-orange-600 transition">
          <ChefHat className="w-4 h-4" />
          How to Cook?
        </button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
        {/* HEADER HERO */}
        <div className="bg-linear-to-br from-orange-500 to-amber-500 text-white px-6 py-7">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              AI Cooking Assistant
            </DialogTitle>

            <DialogDescription className="text-orange-100">
              Enter any dish and get step-by-step cooking guidance instantly
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* INPUT */}
          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">
              What would you like to cook?
            </label>

            <div className="relative">
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="e.g. Chicken Biryani, Ramen, Chocolate Cake"
                className="w-full h-14 rounded-2xl border border-stone-200 bg-stone-50 px-5 pr-12 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />

              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Try something popular
            </p>

            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setRecipeName(example)}
                  className="px-4 py-1.5 rounded-full bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-700 text-sm transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            type="submit"
            disabled={!recipeName.trim()}
            className="w-full h-12 rounded-2xl text-base bg-orange-600 hover:bg-orange-700 shadow-md"
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Generate Recipe
          </Button>

          {/* FOOTNOTE */}
          <p className="text-center text-xs text-stone-400">
            AI will generate ingredients, steps, tips & nutrition
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
