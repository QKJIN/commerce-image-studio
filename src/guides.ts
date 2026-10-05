import type { CommercePresetId } from "@/commerce-presets";

// English landing pages, one per marketplace or task. Each page opens the
// tool with its preset and adds a guide. Platform rules must be checked
// against the linked sources and the date updated when they change.
export type Guide = {
  slug: string;
  presetId: CommercePresetId;
  navLabel: string;
  title: string;
  description: string;
  heading: string;
  summary: string;
  checked: string;
  requirementsTitle: string;
  requirements: Array<[string, string]>;
  toolFit: string[];
  steps: Array<[string, string]>;
  mistakes: Array<[string, string]>;
  faq: Array<{ question: string; answer: string }>;
  sources: Array<{ label: string; url: string }>;
};

export const guides: Guide[] = [
  {
    slug: "amazon-product-image-size",
    presetId: "main-1600",
    navLabel: "Amazon product image size",
    title: "Amazon Product Image Size & Requirements (2026) + Free Resizer",
    description:
      "Amazon main image rules: pure white background, product filling 85% of the frame, 1000+ pixels for zoom. Make 1600 × 1600 white-background images free.",
    heading: "Amazon Product Image Size & Requirements",
    summary:
      "Make Amazon main images at 1600 × 1600 pixels on a white background. Resize, remove backgrounds and compress product photos in batches, right in your browser.",
    checked: "October 2026",
    requirementsTitle: "Amazon main image requirements",
    requirements: [
      ["Image size", "500 to 10,000 pixels on the longest side. Amazon prefers images larger than 1,000 pixels on each side so shoppers can zoom."],
      ["Background", "Pure white, RGB 255, 255, 255."],
      ["Product fill", "The product should fill 85% or more of the frame."],
      ["File format", "JPEG (preferred), TIFF, PNG or non-animated GIF."],
      ["Content", "The main image shows the product only. Keep text, logos, watermarks and added graphics off the main image; use secondary images for lifestyle shots and details."],
    ],
    toolFit: [
      "The White product image preset exports a 1600 × 1600 JPG, comfortably above the 1,000 pixel zoom threshold.",
      "Transparent areas are filled with pure white (#FFFFFF, RGB 255, 255, 255).",
      "The whole photo is fitted into 88% of the square. If your photo has wide margins around the product, crop it first or use Remove background, which trims surplus space, so the product itself fills about 85%.",
      "A photo shot on a gray or colored background keeps that background unless you remove it in the editor.",
    ],
    steps: [
      ["Choose White product image", "It is already selected on this page: 1600 × 1600 pixels, JPG, white fill."],
      ["Add your product photos", "Drop in a batch of photos or a whole folder. Each photo is processed in your browser."],
      ["Remove backgrounds where needed", "Click the edit button on any photo shot on a non-white background, choose Remove background, check the edges and save."],
      ["Check fill and edges", "Open the before-and-after preview. The product should fill most of the square and the background should be clean white."],
      ["Download", "Download images one at a time or all at once as a ZIP, then upload them as your main images in Seller Central."],
    ],
    mistakes: [
      ["Off-white backgrounds", "A background that looks white but is light gray (for example RGB 245, 245, 245) is not pure white. Amazon can suppress a listing until a compliant main image is uploaded."],
      ["Product too small", "Large margins around the product make it look small in search results and can fall below the 85% fill guideline. Crop tightly before resizing."],
      ["Images under 1,000 pixels", "Smaller images are accepted from 500 pixels but cannot be zoomed, which makes it harder for shoppers to see detail."],
      ["Text or badges on the main image", "Save callouts such as \"Free shipping\" or feature labels for secondary images."],
    ],
    faq: [
      {
        question: "What is the best image size for Amazon?",
        answer:
          "Amazon accepts 500 to 10,000 pixels on the longest side and prefers images over 1,000 pixels on each side for zoom. A square 1600 × 1600 or 2000 × 2000 pixel image is a common choice because it zooms well and keeps file sizes reasonable.",
      },
      {
        question: "Does the Amazon main image have to be on a white background?",
        answer:
          "Yes. The main image must be on a pure white background, RGB 255, 255, 255. Secondary images can show the product in use or on other backgrounds.",
      },
      {
        question: "Can I make Amazon images without uploading my photos?",
        answer:
          "Yes. This tool resizes, removes backgrounds and compresses images in your browser, so your photos are not uploaded to a server. The background removal model, about 55 MB, downloads the first time you use it.",
      },
      {
        question: "Is a 1200 × 1200 image enough for Amazon?",
        answer:
          "It is above the 1,000 pixel zoom threshold, so it works. 1600 × 1600 gives shoppers more detail when they zoom, which is why it is the default on this page.",
      },
    ],
    sources: [
      { label: "Amazon: How to take product photos", url: "https://sell.amazon.com/blog/product-photos" },
      { label: "Amazon Seller Central: Product image requirements (sign-in required)", url: "https://sellercentral.amazon.com/help/hub/reference/external/G1881" },
    ],
  },
];

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
