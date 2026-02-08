"use client";

import { Dialog } from "./ui/dialog";
import React, { useState } from "react";
import { DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import PricingSection from "./PricingSection";

const PricingModal = ({ subscriptionTier = "free", children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const canOpen = subscriptionTier === "free";

  return (
    <Dialog open={isOpen} onOpenChange={canOpen ? setIsOpen : undefined}>
      <DialogTrigger asChild disabled={!canOpen}>
        {children}
      </DialogTrigger>

      <DialogContent className="p-8 pt-4 sm:max-w-4xl">
        <DialogTitle />
        <div>
          <PricingSection
            subscriptionTier={subscriptionTier}
            isModal={true}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
