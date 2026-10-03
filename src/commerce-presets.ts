import type { CompressOption } from "@/engines/ImageBase";
import { DefaultCompressOption } from "@/options";

export type CommercePresetId = "main-1600" | "main-1200" | "detail-webp";

export const commercePresets: Array<{
  id: CommercePresetId;
  zh: { title: string; detail: string };
  en: { title: string; detail: string };
}> = [
  {
    id: "main-1600",
    zh: { title: "白底主图", detail: "1600 × 1600 · JPG" },
    en: { title: "White product image", detail: "1600 × 1600 · JPG" },
  },
  {
    id: "main-1200",
    zh: { title: "轻量主图", detail: "1200 × 1200 · JPG" },
    en: { title: "Compact product image", detail: "1200 × 1200 · JPG" },
  },
  {
    id: "detail-webp",
    zh: { title: "详情页图片", detail: "长边 1600 · WebP" },
    en: { title: "Product detail image", detail: "Long edge 1600 · WebP" },
  },
];

export function createCommercePreset(id: CommercePresetId): CompressOption {
  const option = structuredClone(DefaultCompressOption);
  if (id === "detail-webp") {
    option.resize = { method: "setLong", long: 1600 };
    option.format.target = "webp";
    option.jpeg.quality = 0.8;
    return option;
  }

  option.resize = { method: "squarePad", squareSize: id === "main-1600" ? 1600 : 1200 };
  option.format = { target: "jpg", transparentFill: "#FFFFFF" };
  option.jpeg.quality = 0.85;
  return option;
}

export function activeCommercePreset(option: CompressOption): CommercePresetId | null {
  if (option.resize.method === "squarePad" && option.format.target === "jpg" && option.format.transparentFill === "#FFFFFF" && option.jpeg.quality === 0.85) {
    if (option.resize.squareSize === 1600) return "main-1600";
    if (option.resize.squareSize === 1200) return "main-1200";
  }
  if (option.resize.method === "setLong" && option.resize.long === 1600 && option.format.target === "webp" && option.jpeg.quality === 0.8) return "detail-webp";
  return null;
}
