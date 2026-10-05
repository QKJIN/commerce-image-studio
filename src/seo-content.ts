// English FAQ shown on the page and published as FAQPage structured data.
// Platform rules were checked against each platform's help pages in
// October 2026; review them when the rules change.
export const faqCheckedDate = "October 2026";

export const englishFaq: Array<{ question: string; answer: string }> = [
  {
    question: "What size should Amazon product images be?",
    answer:
      "Amazon asks for main images on a pure white background (RGB 255, 255, 255) with the product filling about 85% of the frame. Images 1000 pixels or larger on the longest side enable zoom. The White product image preset exports a 1600 × 1600 JPG and fits the photo into 88% of the square, so crop tightly or remove the background first if your photo has wide margins.",
  },
  {
    question: "What is the best product image size for Shopify?",
    answer:
      "Shopify says square images of 2048 × 2048 pixels usually display best, and accepts images up to 5000 × 5000 pixels and 20 MB. Use a consistent aspect ratio for all main images. To export 2048 × 2048, open Custom settings, choose Square product image with padding and set the side length to 2048.",
  },
  {
    question: "What are eBay's photo requirements?",
    answer:
      "eBay requires photos to be at least 500 pixels on the longest side and does not allow added borders, text, artwork or watermarks. The 1200 and 1600 pixel presets are well above the minimum and add no borders or text.",
  },
  {
    question: "What size should Etsy listing photos be?",
    answer:
      "Etsy recommends at least 2000 pixels on the shortest side and a 4:3 aspect ratio, and notes that files over 1 MB may not finish uploading. The square presets here are not Etsy's recommended ratio; in Custom settings, choose Set short side and enter 2000, and keep an eye on file size.",
  },
  {
    question: "How do I make a product photo background white?",
    answer:
      "Transparent areas become white when you use a white product image preset. If your photo has a colored or gray background, open the editor, use Remove background, then save; the product is placed on white and surplus margins are trimmed. Check complex edges such as hair, glass and fine details before publishing.",
  },
  {
    question: "Are my product photos uploaded to a server?",
    answer:
      "No. Resizing, editing, compression and background removal all run in your browser. The background removal model, about 55 MB, is downloaded the first time you use that feature.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. There is no sign-up and no watermark, and the source code is open under the MIT license.",
  },
];
