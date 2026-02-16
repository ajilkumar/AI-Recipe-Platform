/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChefHat,
  Loader2,
  Package,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getPantryItems,
  deletePantryItem,
  updatePantryItem,
} from "@/actions/pantry.actions";
import { toast } from "sonner";
import AddToPantryModal from "@/components/AddToPantryModal";
import PricingModal from "@/components/PricingModal";
import { useFetch } from "@/hooks/useFetch";

export default function PantryPage() {
  /* ================= STATE ================= */
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", quantity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ================= FETCH HOOKS ================= */
  const {
    loading: loadingItems,
    data: itemsData,
    fn: fetchItems,
  } = useFetch(getPantryItems);

  const {
    loading: deleting,
    data: deleteData,
    fn: deleteItem,
  } = useFetch(deletePantryItem);

  const {
    loading: updating,
    data: updateData,
    fn: updateItem,
  } = useFetch(updatePantryItem);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchItems();
  }, []);

  /* ================= SET ITEMS ================= */
  useEffect(() => {
    if (itemsData?.success) setItems(itemsData.items);
  }, [itemsData]);

  /* ================= DELETE SUCCESS ================= */
  useEffect(() => {
    if (deleteData?.success && !deleting) {
      toast.success("Item removed from pantry");
      fetchItems();
    }
  }, [deleteData]);

  /* ================= UPDATE SUCCESS ================= */
  useEffect(() => {
    if (updateData?.success) {
      toast.success("Item updated successfully");
      setEditingId(null);
      fetchItems();
    }
  }, [updateData]);

  /* ================= HANDLERS ================= */
  const handleDelete = async (itemId) => {
    const formData = new FormData();
    formData.append("itemId", itemId);
    await deleteItem(formData);
  };

  const startEdit = (item) => {
    setEditingId(item.documentId);
    setEditValues({ name: item.name, quantity: item.quantity });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("itemId", editingId);
    formData.append("name", editValues.name);
    formData.append("quantity", editValues.quantity);
    await updateItem(formData);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", quantity: "" });
  };

  const handleModalSuccess = () => fetchItems();

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 to-white pt-24 pb-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-2xl">
              <Package className="w-8 h-8 text-orange-600" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                My{" "}
                <span className="text-orange-600 font-serif font-bold">
                  Pantry
                </span>
              </h1>
              <p className="text-stone-500 text-sm">
                Track ingredients & cook smarter
              </p>
            </div>
          </div>

          {/* Desktop Add Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex gap-2 bg-orange-600 hover:bg-orange-700 shadow-sm cursor-pointer"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </Button>
        </div>

        {/* ================= USAGE BADGE ================= */}
        {itemsData?.scansLimit !== undefined && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white shadow-sm text-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />

              {itemsData.scansLimit === "unlimited" ? (
                <span className="font-medium text-green-600">
                  Unlimited AI scans
                </span>
              ) : (
                <PricingModal>
                  <span className="cursor-pointer text-stone-600">
                    Upgrade for unlimited scans
                  </span>
                </PricingModal>
              )}
            </div>
          </div>
        )}

        {/* ================= QUICK RECIPE CARD ================= */}
        {items.length > 0 && (
          <Link href="/pantry/recipes" className="block mb-10">
            <div className="rounded-3xl p-6 bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:scale-[1.02] transition">
              <div className="flex items-center gap-4">
                <ChefHat className="w-7 h-7" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    What can I cook today?
                  </h3>
                  <p className="text-sm text-green-100">
                    From your {items.length} ingredients
                  </p>
                </div>
                <Badge className="bg-white/20 border-none">
                  {items.length}
                </Badge>
              </div>
            </div>
          </Link>
        )}

        {/* ================= LOADING ================= */}
        {loadingItems && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          </div>
        )}

        {/* ================= GRID ================= */}
        {!loadingItems && items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.documentId}
                className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition"
              >
                {editingId === item.documentId ? (
                  <>
                    {/* EDIT MODE */}
                    <input
                      value={editValues.name}
                      onChange={(e) =>
                        setEditValues({ ...editValues, name: e.target.value })
                      }
                      className="input mb-2"
                    />

                    <input
                      value={editValues.quantity}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          quantity: e.target.value,
                        })
                      }
                      className="input mb-3"
                    />

                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit} disabled={updating}>
                        {updating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>

                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* VIEW MODE */}
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-stone-500">
                          {item.quantity}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <IconButton onClick={() => startEdit(item)}>
                          <Edit2 size={16} />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(item.documentId)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </div>

                    <p className="text-xs text-stone-400 mt-3">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loadingItems && items.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto mb-6 w-16 h-16 bg-orange-100 flex items-center justify-center rounded-2xl">
              <Package className="text-orange-600" />
            </div>

            <h3 className="text-xl font-semibold mb-2">Your pantry is empty</h3>

            <p className="text-stone-500 mb-6">
              Add ingredients to start discovering recipes.
            </p>

            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2 " />
              Add first item
            </Button>
          </div>
        )}
      </div>

      {/* ================= MOBILE FLOATING BUTTON ================= */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button
          onClick={() => setIsModalOpen(true)}
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <Plus />
        </Button>
      </div>

      {/* ================= MODAL ================= */}
      <AddToPantryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

/* ================= REUSABLE ICON BUTTON ================= */
function IconButton({ children, ...props }) {
  return (
    <button {...props} className="p-2 rounded-lg hover:bg-stone-100 transition">
      {children}
    </button>
  );
}
