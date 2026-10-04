/**
 * Background-removal preprocessing/postprocessing adapted from
 * chenjindu/browser-remove-background (Apache-2.0).
 * Changed for this application: worker-only WASM execution, cancellation,
 * and automatic trimming around the extracted subject.
 * See THIRD_PARTY_NOTICES.md and licenses/browser-remove-background.LICENSE.
 */
import * as ort from "onnxruntime-web/wasm";

const size = 1024;
const pixels = size * size;
let sessionPromise: Promise<ort.InferenceSession> | null = null;

async function getSession() {
  if (!sessionPromise) {
    ort.env.wasm.wasmPaths = `${self.location.origin}/ort/`;
    ort.env.wasm.numThreads = 1;
    sessionPromise = (async () => {
      const response = await fetch("/models/isnet-w8.onnx");
      if (!response.ok) throw new Error(`Model download failed: ${response.status}`);
      const model = await response.arrayBuffer();
      return ort.InferenceSession.create(model, { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
    })().catch((error) => {
      sessionPromise = null;
      throw error;
    });
  }
  return sessionPromise;
}

async function removeBackground(blob: Blob): Promise<Blob> {
  const session = await getSession();
  const bitmap = await createImageBitmap(blob);
  try {
    const input = new OffscreenCanvas(size, size);
    const inputContext = input.getContext("2d", { willReadFrequently: true })!;
    inputContext.drawImage(bitmap, 0, 0, size, size);
    const rgba = inputContext.getImageData(0, 0, size, size).data;
    const values = new Float32Array(pixels * 3);
    for (let index = 0; index < pixels; index++) {
      values[index] = rgba[index * 4] / 255 - 0.5;
      values[pixels + index] = rgba[index * 4 + 1] / 255 - 0.5;
      values[pixels * 2 + index] = rgba[index * 4 + 2] / 255 - 0.5;
    }

    const result = await session.run({ input_image: new ort.Tensor("float32", values, [1, 3, size, size]) });
    const mask = result.output_image?.data;
    if (!mask || mask.length !== pixels) throw new Error("The model did not return an image mask");
    let minimum = Infinity;
    let maximum = -Infinity;
    for (const value of mask) {
      const number = Number(value);
      if (number < minimum) minimum = number;
      if (number > maximum) maximum = number;
    }

    const maskCanvas = new OffscreenCanvas(size, size);
    const maskContext = maskCanvas.getContext("2d")!;
    const maskImage = maskContext.createImageData(size, size);
    const range = maximum - minimum || 1;
    for (let index = 0; index < pixels; index++) {
      const alpha = Math.round(Math.max(0, Math.min(1, (Number(mask[index]) - minimum) / range)) * 255);
      maskImage.data[index * 4] = 255;
      maskImage.data[index * 4 + 1] = 255;
      maskImage.data[index * 4 + 2] = 255;
      maskImage.data[index * 4 + 3] = alpha;
    }
    maskContext.putImageData(maskImage, 0, 0);

    const output = new OffscreenCanvas(bitmap.width, bitmap.height);
    const outputContext = output.getContext("2d", { willReadFrequently: true })!;
    outputContext.drawImage(bitmap, 0, 0);
    outputContext.globalCompositeOperation = "destination-in";
    outputContext.drawImage(maskCanvas, 0, 0, output.width, output.height);
    outputContext.globalCompositeOperation = "source-over";

    const alpha = outputContext.getImageData(0, 0, output.width, output.height).data;
    let left = output.width;
    let top = output.height;
    let right = -1;
    let bottom = -1;
    for (let y = 0; y < output.height; y++) {
      for (let x = 0; x < output.width; x++) {
        if (alpha[(y * output.width + x) * 4 + 3] < 80) continue;
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
    if (right < left || bottom < top) return output.convertToBlob({ type: "image/png" });

    const padding = Math.round(Math.max(right - left, bottom - top) * 0.04);
    left = Math.max(0, left - padding);
    top = Math.max(0, top - padding);
    right = Math.min(output.width - 1, right + padding);
    bottom = Math.min(output.height - 1, bottom + padding);
    const trimmed = new OffscreenCanvas(right - left + 1, bottom - top + 1);
    trimmed.getContext("2d")!.drawImage(output, left, top, trimmed.width, trimmed.height, 0, 0, trimmed.width, trimmed.height);
    return trimmed.convertToBlob({ type: "image/png" });
  } finally {
    bitmap.close();
  }
}

self.addEventListener("message", async (event: MessageEvent<{ id: number; blob: Blob }>) => {
  const { id, blob } = event.data;
  try {
    const result = await removeBackground(blob);
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
});
