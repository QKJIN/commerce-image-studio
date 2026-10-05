"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Crop, RotateCcw, RotateCw, Sparkles, Undo2, X } from "lucide-react";
import { isAnimatedImage } from "@/engines/animation";
import { useAppLocale } from "@/locale-context";
import type { ImageItem } from "@/states/home";
import style from "./ImageEditor.module.scss";
import { trackEvent } from "@/analytics";

type Box = { x: number; y: number; width: number; height: number };

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Image export failed")), "image/png");
  });
}

async function transformedBlob(blob: Blob, kind: "left" | "right" | "brightness" | "crop", brightness: number, crop?: Box) {
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    if (kind === "crop" && crop) {
      const x = Math.round(crop.x * bitmap.width);
      const y = Math.round(crop.y * bitmap.height);
      const width = Math.max(1, Math.round(crop.width * bitmap.width));
      const height = Math.max(1, Math.round(crop.height * bitmap.height));
      canvas.width = Math.min(width, bitmap.width - x);
      canvas.height = Math.min(height, bitmap.height - y);
      canvas.getContext("2d")!.drawImage(bitmap, x, y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    } else if (kind === "left" || kind === "right") {
      canvas.width = bitmap.height;
      canvas.height = bitmap.width;
      const context = canvas.getContext("2d")!;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(kind === "right" ? Math.PI / 2 : -Math.PI / 2);
      context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    } else {
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d")!;
      context.filter = `brightness(${brightness}%)`;
      context.drawImage(bitmap, 0, 0);
    }
    return canvasBlob(canvas);
  } finally {
    bitmap.close();
  }
}

export default function ImageEditor({ item, onClose, onApply }: { item: ImageItem; onClose: () => void; onApply: (blob: Blob) => void }) {
  const { lang } = useAppLocale();
  const zh = lang === "zh-CN";
  const [history, setHistory] = useState<Blob[]>([item.blob]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [cropMode, setCropMode] = useState(false);
  const [selection, setSelection] = useState<Box | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unsupported, setUnsupported] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const working = history[history.length - 1];

  useEffect(() => {
    const url = URL.createObjectURL(working);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [working]);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    isAnimatedImage(item.blob, item.blob.type).then((animated) => {
      if (alive && animated) {
        setUnsupported(true);
        setError(zh ? "动态图暂不支持逐张编辑。" : "Animated images cannot be edited here.");
      }
    });
    return () => { alive = false; };
  }, [item.blob, zh]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const commit = (blob: Blob) => {
    setHistory((previous) => [...previous, blob]);
    setSelection(null);
    setCropMode(false);
    setBrightness(100);
    setError("");
  };

  const operate = async (kind: "left" | "right" | "brightness" | "crop") => {
    if (busy || unsupported) return;
    setBusy(true);
    setError("");
    try {
      commit(await transformedBlob(working, kind, brightness, selection ?? undefined));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  const removeBackground = async () => {
    if (busy || unsupported) return;
    setBusy(true);
    setError("");
    try {
      const worker = workerRef.current ?? new Worker(new URL("@/engines/BackgroundWorker.ts", import.meta.url));
      workerRef.current = worker;
      const result = await new Promise<Blob>((resolve, reject) => {
        worker.onmessage = (event: MessageEvent<{ result?: Blob; error?: string }>) => {
          if (event.data.result) resolve(event.data.result);
          else reject(new Error(event.data.error ?? "Background removal failed"));
        };
        worker.onerror = (event) => reject(new Error(event.message));
        worker.postMessage({ id: Date.now(), blob: working });
      });
      commit(result);
      trackEvent("background-removed");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      trackEvent("background-failed");
    } finally {
      setBusy(false);
    }
  };

  const point = (event: React.PointerEvent<HTMLImageElement>) => {
    const rect = imageRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    };
  };

  const startCrop = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!cropMode || busy) return;
    dragStart.current = point(event);
    setSelection(null);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateCrop = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!dragStart.current) return;
    const end = point(event);
    const start = dragStart.current;
    setSelection({ x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y) });
  };

  const undo = () => {
    setHistory((previous) => previous.length > 1 ? previous.slice(0, -1) : previous);
    setBrightness(100);
    setSelection(null);
    setCropMode(false);
    setError("");
  };

  return createPortal(
    <div className={style.backdrop}>
      <section className={style.editor} role="dialog" aria-modal="true" aria-label={zh ? "编辑商品图片" : "Edit product image"}>
        <header className={style.header}>
          <div><span>{zh ? "逐张编辑" : "Edit image"}</span><h2 title={item.name}>{item.name}</h2></div>
          <button ref={closeRef} type="button" className={style.close} onClick={onClose} aria-label={zh ? "关闭" : "Close"}><X size={22} /></button>
        </header>
        <div className={style.stage}>
          <div className={style.imageWrap}>
            {previewUrl && <img ref={imageRef} src={previewUrl} alt={zh ? "正在编辑的图片" : "Image being edited"} draggable={false} style={{ filter: `brightness(${brightness}%)` }} onLoad={(event) => setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} onPointerDown={startCrop} onPointerMove={updateCrop} onPointerUp={() => { dragStart.current = null; }} />}
            {cropMode && selection && <div className={style.selection} style={{ left: `${selection.x * 100}%`, top: `${selection.y * 100}%`, width: `${selection.width * 100}%`, height: `${selection.height * 100}%` }} />}
          </div>
          <small>{dimensions.width} × {dimensions.height}{cropMode ? (zh ? " · 在图片上拖动选择保留区域" : " · Drag on the image to select an area") : ""}</small>
        </div>
        <div className={style.controls}>
          <div className={style.actions}>
            <button type="button" disabled={busy || unsupported} onClick={() => operate("left")}><RotateCcw size={18} />{zh ? "左转" : "Left"}</button>
            <button type="button" disabled={busy || unsupported} onClick={() => operate("right")}><RotateCw size={18} />{zh ? "右转" : "Right"}</button>
            <button type="button" className={cropMode ? style.active : ""} disabled={busy || unsupported} onClick={() => { setCropMode(!cropMode); setSelection(null); }}><Crop size={18} />{zh ? "裁剪" : "Crop"}</button>
            {cropMode && <button type="button" disabled={busy || !selection || selection.width < 0.02 || selection.height < 0.02} onClick={() => operate("crop")}>{zh ? "应用裁剪" : "Apply crop"}</button>}
            <button type="button" disabled={busy || unsupported} onClick={removeBackground}><Sparkles size={18} />{zh ? "去背景" : "Remove background"}</button>
          </div>
          <div className={style.brightness}>
            <label htmlFor="image-brightness">{zh ? "亮度" : "Brightness"} · {brightness}%</label>
            <input id="image-brightness" type="range" min="50" max="150" value={brightness} disabled={busy || unsupported} onChange={(event) => setBrightness(Number(event.target.value))} />
            <button type="button" disabled={busy || unsupported || brightness === 100} onClick={() => operate("brightness")}>{zh ? "应用亮度" : "Apply brightness"}</button>
          </div>
          <p className={style.hint}>{busy ? (zh ? "正在处理；关闭窗口可取消。" : "Processing; close this window to cancel.") : (zh ? "去背景首次约需下载 55 MB；请检查透明和复杂边缘。" : "First use downloads about 55 MB; check transparent and detailed edges.")}</p>
          {error && <p className={style.error} role="alert">{error}</p>}
        </div>
        <footer className={style.footer}>
          <button type="button" disabled={busy || history.length < 2} onClick={undo}><Undo2 size={18} />{zh ? "撤销" : "Undo"}</button>
          <button type="button" disabled={busy || unsupported || (history.length === 1 && brightness === 100 && !error)} onClick={() => { setHistory([item.blob]); setBrightness(100); setCropMode(false); setSelection(null); setError(""); }}>{zh ? "重置" : "Reset"}</button>
          <button type="button" className="button buttonAccent" disabled={busy || unsupported || history.length === 1 || brightness !== 100} onClick={() => onApply(working)}><Check size={18} />{zh ? "保存并重新生成" : "Save and regenerate"}</button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
