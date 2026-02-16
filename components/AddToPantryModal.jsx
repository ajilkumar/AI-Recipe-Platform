/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import { useFetch } from "@/hooks/useFetch";
import {
  scanPantryImage,
  saveToPantry,
  addPantryItemManually,
} from "@/actions/pantry.actions";
import { toast } from "sonner";

export default function AddToPantryModal({ isOpen, onClose, onSuccess }) {
  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [manualItem, setManualItem] = useState({ name: "", quantity: "" });

  /* ================= FETCH HOOKS ================= */
  const { loading: scanning, data: scanData, fn: scanImage } =
    useFetch(scanPantryImage);

  const { loading: saving, data: saveData, fn: saveScannedItems } =
    useFetch(saveToPantry);

  const { loading: adding, data: addData, fn: addManualItem } =
    useFetch(addPantryItemManually);

  /* ================= HANDLERS ================= */

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setScannedIngredients([]);
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("image", selectedImage);
    await scanImage(formData);
  };

  const handleSaveScanned = async () => {
    if (scannedIngredients.length === 0) {
      toast.error("No ingredients to save");
      return;
    }

    const formData = new FormData();
    formData.append("ingredients", JSON.stringify(scannedIngredients));
    await saveScannedItems(formData);
  };

  const handleAddManual = async (e) => {
    e.preventDefault();

    if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", manualItem.name);
    formData.append("quantity", manualItem.quantity);
    await addManualItem(formData);
  };

  const handleClose = () => {
    setActiveTab("scan");
    setSelectedImage(null);
    setScannedIngredients([]);
    setManualItem({ name: "", quantity: "" });
    onClose();
  };

  const removeIngredient = (index) => {
    setScannedIngredients(scannedIngredients.filter((_, i) => i !== index));
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (scanData?.success && scanData?.ingredients) {
      setScannedIngredients(scanData.ingredients);
      toast.success(`Found ${scanData.ingredients.length} ingredients!`);
    }
  }, [scanData]);

  useEffect(() => {
    if (saveData?.success) {
      toast.success(saveData.message);
      handleClose();
      onSuccess?.();
    }
  }, [saveData]);

  useEffect(() => {
    if (addData?.success) {
      toast.success("Item added to pantry!");
      handleClose();
      onSuccess?.();
    }
  }, [addData]);

  /* ================= UI ================= */

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95%] sm:w-full max-w-2xl rounded-2xl p-0 overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="px-6 pt-6 pb-4 border-b bg-white">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Add to <span className="text-orange-600 font-serif">Pantry</span>
          </DialogTitle>
          <DialogDescription>
            Scan with AI or add items manually
          </DialogDescription>
        </div>

        {/* ================= BODY WITH ADAPTIVE HEIGHT ================= */}
        <div className="px-6 pb-6">

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col"
          >

            {/* ================= CENTERED TABS ================= */}
            <div className="flex justify-center mt-4">
              <TabsList className="grid grid-cols-2 bg-stone-100 p-1 rounded-xl w-full max-w-md">
                <TabsTrigger value="scan" className="gap-2 rounded-lg">
                  <Camera className="w-4 h-4" />
                  AI Scan
                </TabsTrigger>

                <TabsTrigger value="manual" className="gap-2 rounded-lg">
                  <Plus className="w-4 h-4" />
                  Manual
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ================= AI SCAN TAB (SCROLL ENABLED) ================= */}
            <TabsContent
              value="scan"
              className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-2"
            >
              {scannedIngredients.length === 0 ? (
                <>
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    loading={scanning}
                  />

                  {selectedImage && !scanning && (
                    <Button
                      onClick={handleScan}
                      className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Scan Image
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {/* REVIEW HEADER */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Review detected items
                      </h3>
                      <p className="text-sm text-stone-500">
                        {scannedIngredients.length} found
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setScannedIngredients([]);
                        setSelectedImage(null);
                      }}
                    >
                      Scan again
                    </Button>
                  </div>

                  {/* INGREDIENT LIST */}
                  <div className="space-y-3">
                    {scannedIngredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-white border rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{ingredient.name}</p>
                          <p className="text-sm text-stone-500">
                            {ingredient.quantity}
                          </p>
                        </div>

                        {ingredient.confidence && (
                          <Badge className="bg-green-50 text-green-700 border border-green-200">
                            {Math.round(ingredient.confidence * 100)}%
                          </Badge>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeIngredient(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleSaveScanned}
                    disabled={saving}
                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Save to pantry
                  </Button>
                </>
              )}
            </TabsContent>

            {/* ================= MANUAL TAB (SCROLL ENABLED) ================= */}
            <TabsContent
              value="manual"
              className="mt-6 max-h-[60vh] overflow-y-auto pr-2"
            >
              <form onSubmit={handleAddManual} className="space-y-5">

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Ingredient name
                  </label>
                  <input
                    type="text"
                    value={manualItem.name}
                    onChange={(e) =>
                      setManualItem({ ...manualItem, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. Chicken breast"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={manualItem.quantity}
                    onChange={(e) =>
                      setManualItem({
                        ...manualItem,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. 500g / 2 cups"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={adding}
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add item
                </Button>

              </form>
            </TabsContent>

          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
