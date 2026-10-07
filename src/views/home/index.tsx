import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ArrowRight, Check, Code2, Languages, Menu, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import style from "./index.module.scss";
import { Logo } from "@/components/Logo";
import { UploadCard } from "@/components/UploadCard";
import { Compare } from "@/components/Compare";
import { useAppLocale } from "@/locale-context";
import { changeLang, langList } from "@/locale";
import { homeState } from "@/states/home";
import { createImageList, useWorkerHandler } from "@/engines/transform";
import { getFilesFromClipboard, hasImageInClipboard } from "@/functions";
import { LeftContent } from "./LeftContent";
import { RightOption } from "./RightOption";
import { Select } from "@/components/Select";
import { activeCommercePreset, commercePresets, createCommercePreset } from "@/commerce-presets";
import { trackEvent, useAnalyticsEnabled } from "@/analytics";
import { englishFaq, faqCheckedDate } from "@/seo-content";
import { guides } from "@/guides";
import type { Landing } from "@/ClientApp";

const copy = {
  zh: {
    brand: "商图工坊",
    heading: "商图工坊",
    eyebrow: "为电商卖家准备的图片工具",
    summary: "批量统一商品图尺寸、背景和格式，处理好再上传。",
    intro: "选一个常用方案，加入图片，检查结果后逐张下载或打包保存。图片在你的浏览器中处理。",
    presets: "选择处理方案",
    custom: "自定义设置",
    privacyTitle: "商品图片留在你的设备上",
    privacyText: "处理在浏览器内完成，无需把原图上传到我们的服务器。上传到电商平台之前，你可以先检查每张图片的尺寸、颜色和清晰度。",
    guideTitle: "一批图片，三步完成",
    guide: [["选方案", "白底主图或详情页图片，先选用途。"], ["加图片", "拖入多张商品图，必要时逐张编辑。"], ["检查导出", "看尺寸与画质，再下载结果。"]],
    disclaimer: "预设是通用起点，发布前请核对目标平台的最新图片要求。",
    source: "项目源码",
    thirdParty: "第三方许可",
    start: "开始处理商品图",
  },
  en: {
    brand: "Commerce Image Studio",
    heading: "Product Photo Resizer & White Background Maker",
    eyebrow: "Free image tool for online sellers",
    summary: "Turn product photos into square, white-background images for Amazon, Shopify, eBay and Etsy. Resize, remove backgrounds and compress in batches, right in your browser.",
    intro: "Choose a preset, add product photos, review the output, then download individually or as a ZIP. Nothing is uploaded and there is no sign-up.",
    presets: "Choose an output",
    custom: "Custom settings",
    privacyTitle: "Your product images stay on your device",
    privacyText: "Processing happens in your browser. Your originals are not uploaded to our server. Review each image's size, color, and detail before publishing.",
    guideTitle: "How to make white background product photos",
    guide: [["Choose a preset", "Pick a square white product image or a lighter detail-page image."], ["Add product photos", "Drop in a batch, then crop, rotate or remove the background where needed."], ["Review and download", "Check size and quality, then download each image or a ZIP."]],
    disclaimer: "These presets are general starting points. Check your marketplace's current image requirements before publishing.",
    source: "Project source",
    thirdParty: "Third-party licenses",
    start: "Prepare product images",
  },
};

const Home = observer(({ landing }: { landing?: Landing }) => {
  useWorkerHandler();
  const { lang } = useAppLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const text = lang === "zh-CN" ? copy.zh : copy.en;
  const selected = activeCommercePreset(homeState.tempOption);
  const analyticsEnabled = useAnalyticsEnabled();
  const busy = homeState.hasTaskRunning();

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (!hasImageInClipboard(event)) return;
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) return;
      event.preventDefault();
      const files = await getFilesFromClipboard(event);
      if (files.length > 0) createImageList(files);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const choosePreset = (id: (typeof commercePresets)[number]["id"]) => {
    const option = createCommercePreset(id);
    trackEvent("preset-selected", { preset: id });
    homeState.tempOption = structuredClone(option);
    homeState.option = option;
    if (homeState.list.size > 0) homeState.reCompress();
  };

  const scrollToTool = () => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={style.page}>
      <header className={style.header}>
        <a href="#top" className={style.brand} aria-label={text.brand}><Logo title={text.brand} /></a>
        <div className={style.headerTools}>
          <nav className={menuOpen ? style.navOpen : ""} aria-label="Primary navigation">
            <a href="#workspace">{text.start}</a>
            {lang !== "zh-CN" && <a href="#faq">FAQ</a>}
            <a href="#privacy">{lang === "zh-CN" ? "隐私" : "Privacy"}</a>
          </nav>
          <div className={style.headerActions}>
            <div className={style.language}><Languages size={16} /><Select compact value={lang} ariaLabel="Language" options={langList.map((item) => ({ value: item.key, label: item.label }))} onChange={changeLang} /></div>
            <button type="button" className={style.menuButton} aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className={style.hero}>
          <div className={style.heroCopy}>
            {landing && <nav className={style.breadcrumb} aria-label="Breadcrumb"><a href={`/${lang}/`}>Home</a><span aria-hidden="true">/</span><span>{landing.breadcrumb}</span></nav>}
            <span className={style.eyebrow}><ShieldCheck size={16} />{text.eyebrow}</span>
            <h1>{landing?.heading ?? text.heading}</h1>
            <p>{landing?.summary ?? text.summary}</p>
          </div>
          <div className={style.workspace} id="workspace">
            <div className={style.workspaceTop}>
              <div><i /><i /><i /><strong>{text.brand}</strong></div>
              <button type="button" className="button" onClick={() => { homeState.showOption = true; }}><SlidersHorizontal size={17} />{text.custom}</button>
            </div>
            <div className={style.presetBar} aria-label={text.presets}>
              <strong>{text.presets}</strong>
              <div className={style.presetChoices}>{commercePresets.map((preset) => {
                const label = lang === "zh-CN" ? preset.zh : preset.en;
                return <button key={preset.id} type="button" disabled={busy} aria-pressed={selected === preset.id} className={selected === preset.id ? style.presetActive : ""} onClick={() => choosePreset(preset.id)}><span>{label.title}</span><small>{label.detail}</small></button>;
              })}</div>
            </div>
            <div className={style.workbench}>{homeState.list.size === 0 ? <UploadCard /> : <LeftContent />}<RightOption /></div>
          </div>
          <div className={style.heroDetails}><p>{text.intro}</p><span className={style.presetDisclaimer}>{text.disclaimer}</span></div>
        </section>

        {landing ? landing.content : <>
        <section className={style.how}>
          <div className={style.sectionHeading}><h2>{text.guideTitle}</h2></div>
          <ol>{text.guide.map((step, index) => <li key={step[0]}><b>{index + 1}</b><div><h3>{step[0]}</h3><p>{step[1]}</p></div></li>)}</ol>
        </section>

        <section className={style.privacy} id="privacy">
          <div><span className={style.eyebrow}><ShieldCheck size={16} />{lang === "zh-CN" ? "本地处理" : "LOCAL PROCESSING"}</span><h2>{text.privacyTitle}</h2><p>{text.privacyText}</p>{analyticsEnabled && <p>{lang === "zh-CN" ? "我们使用不设 Cookie 的匿名统计，只记录访问量和功能使用次数，不记录文件名或图片内容。" : "We use anonymous, cookie-free statistics that count visits and feature use. File names and image content are never recorded."}</p>}<ul><li><Check size={16} />{lang === "zh-CN" ? "无需注册" : "No sign-up"}</li><li><Check size={16} />{lang === "zh-CN" ? "批量处理" : "Batch processing"}</li></ul></div>
          <div className={style.privacyVisual}><ShieldCheck size={48} /><strong>{lang === "zh-CN" ? "原图不上传" : "No image uploads"}</strong></div>
        </section>

        {lang !== "zh-CN" && (
          <section className={style.faq} id="faq">
            <div className={style.sectionHeading}><h2>Product image size FAQ</h2><p>Marketplace image rules, checked against each platform&apos;s help pages in {faqCheckedDate}. Rules change, so confirm the current requirements before publishing.</p></div>
            <div className={style.faqList}>{englishFaq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
            <div className={style.guideLinks}><strong>Platform guides</strong>{guides.map((guide) => <a key={guide.slug} href={`/en-US/${guide.slug}/`}>{guide.navLabel}</a>)}</div>
          </section>
        )}
        </>}

        <section className={style.finalCta}><h2>{text.start}</h2><button type="button" className="button buttonAccent buttonLarge" onClick={scrollToTool}>{text.start}<ArrowRight size={18} /></button></section>
      </main>

      <footer className={style.footer}><Logo title={text.brand} /><p>{lang === "zh-CN" ? "基于 Pic Smaller 开源项目二次开发。" : "Built on the open-source Pic Smaller project."}</p><div><a href="https://github.com/QKJIN/commerce-image-studio" target="_blank" rel="noreferrer"><Code2 size={16} />{text.source}</a><a href="https://github.com/joye61/pic-smaller" target="_blank" rel="noreferrer">Pic Smaller</a><a href="https://github.com/QKJIN/commerce-image-studio/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT License</a><a href="https://github.com/QKJIN/commerce-image-studio/blob/main/THIRD_PARTY_NOTICES.md" target="_blank" rel="noreferrer">{text.thirdParty}</a></div>{lang !== "zh-CN" && <nav className={style.footerGuides} aria-label="Guides"><strong>Guides</strong>{guides.map((guide) => <a key={guide.slug} href={`/en-US/${guide.slug}/`}>{guide.navLabel}</a>)}</nav>}</footer>
      {homeState.compareId !== null && <Compare />}
    </div>
  );
});

export default Home;
