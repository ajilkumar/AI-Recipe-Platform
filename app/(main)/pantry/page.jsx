"use client";

import AddToPantryModal from "@/components/AddToPantryModal";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { useState } from "react";

const PantryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState({ name: "", quantity: "" });

  const handleModalSuccess = () => {
    // your success logic
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            
            <div className="flex items-center gap-4">
              <Package className="w-16 h-16 text-orange-600" />

              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                  My Pantry
                </h1>
                <p className="text-stone-600 font-light mt-4">
                  Manage your ingredients and discover what you can cook
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white gap-2 cursor-pointer"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Add to Pantry
            </Button>
          </div>

          {/* MOBILE BUTTON */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden w-full bg-orange-600 hover:bg-orange-700 text-white gap-2 mb-4"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Add to Pantry
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <AddToPantryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default PantryPage;
