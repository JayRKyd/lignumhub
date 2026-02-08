"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (maxSize && file.size > maxSize) {
        setError(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        return;
      }
      if (accept && !file.type.match(accept.replace("*", ".*"))) {
        setError("Invalid file type");
        return;
      }

      setError(null);
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      onFileSelect(file);
    },
    [maxSize, accept, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragging
            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-slate-800",
          disabled && "opacity-50 cursor-not-allowed",
          preview && "border-solid border-green-500"
        )}
      >
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
              {selectedFile?.name}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Upload className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {isDragging ? "Drop your file here" : "Drag & drop your receipt"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or click to browse files
                </p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                JPG, PNG up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Camera button for mobile */}
      <div className="flex gap-3 sm:hidden">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
