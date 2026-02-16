"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RingLoader } from "react-spinners";

export default function ImageUploader({ onImageSelect, loading }) {
  /* ================= STATE ================= */
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  /* ================= DROP HANDLER ================= */
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      onImageSelect(file);
    },
    [onImageSelect]
  );

  /* ================= DROPZONE ================= */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10485760,
    noClick: true,
    noKeyboard: true,
  });

  /* ================= CLEAR IMAGE ================= */
  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= PREVIEW MODE ================= */
  if (preview) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden border bg-stone-100 shadow-sm">

        {/* Image */}
        <Image src={preview} alt="Pantry preview" fill className="object-cover" />

        {/* Remove Button */}
        {!loading && (
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 backdrop-blur-md bg-white/80 hover:bg-white p-2.5 rounded-full shadow-md transition"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <RingLoader color="white" />
          </div>
        )}
      </div>
    );
  }

  /* ================= UPLOAD MODE ================= */
  return (
    <>
      <div
        {...getRootProps()}
        className={`relative w-full aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
        ${
          isDragActive
            ? "border-orange-600 bg-orange-50 scale-[1.02] shadow-lg"
            : "border-stone-300 bg-linear-to-b from-stone-50 to-white hover:border-orange-400 hover:bg-orange-50/40"
        }`}
      >
        <input {...getInputProps()} />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">

          {/* ICON */}
          <div
            className={`mb-4 p-5 rounded-full transition-all duration-300
            ${
              isDragActive
                ? "bg-orange-600 scale-110"
                : "bg-orange-100"
            }`}
          >
            {isDragActive ? (
              <ImageIcon className="w-8 h-8 text-white" />
            ) : (
              <Camera className="w-8 h-8 text-orange-600" />
            )}
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-bold text-stone-900 mb-2">
            {isDragActive ? "Drop your image here" : "Scan Your Pantry"}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-sm text-stone-500 max-w-xs mb-6">
            {isDragActive
              ? "Release to upload"
              : "Take a photo or drag & drop your fridge/pantry"}
          </p>

          {/* ACTION BUTTONS */}
          {!isDragActive && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

              {/* PRIMARY CTA */}
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>

              {/* SECONDARY CTA */}
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="border-orange-200 text-orange-700 hover:bg-orange-50 gap-2"
              >
                <Upload className="w-4 h-4" />
                Browse
              </Button>
            </div>
          )}

          {/* HELPER TEXT */}
          <p className="text-xs text-stone-400 mt-6">
            JPG, PNG, WebP • Max 10MB
          </p>
        </div>
      </div>

      {/* ================= HIDDEN INPUT (MOBILE CAMERA) ================= */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onDrop([file]);
        }}
        className="hidden"
      />
    </>
  );
}
