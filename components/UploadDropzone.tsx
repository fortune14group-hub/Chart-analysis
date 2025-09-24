"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { sv } from "@/lib/i18n/sv";

export type UploadDropzoneProps = {
  name: string;
  onFileChange?: (file: File | null) => void;
};

export default function UploadDropzone({ name, onFileChange }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setError(sv.errors.badFile);
        onFileChange?.(null);
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError(sv.errors.badFile);
        onFileChange?.(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setPreview(String(reader.result));
      reader.readAsDataURL(file);
      setError(null);
      onFileChange?.(file);
    },
    [onFileChange]
  );

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${dragActive ? "border-primary bg-primary/10" : "border-border"}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <button
        type="button"
        className="rounded-xl border px-4 py-2 text-sm hover:bg-accent"
        onClick={() => inputRef.current?.click()}
      >
        {sv.upload.drop}
      </button>
      <p className="text-xs opacity-70">{sv.upload.note}</p>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {preview && (
        <div className="relative mt-4 h-48 w-full overflow-hidden rounded-xl border">
          <Image src={preview} alt="Preview" fill className="object-contain" />
        </div>
      )}
    </div>
  );
}
