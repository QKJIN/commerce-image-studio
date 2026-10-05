import type { Guide } from "@/guides";
import { guides } from "@/guides";
import { getLocalePath } from "@/locale-config";
import style from "./GuideContent.module.scss";

export function GuideContent({ guide }: { guide: Guide }) {
  const related = guides.filter((item) => item.slug !== guide.slug);
  return (
    <div className={style.guide}>
      <section className={style.section}>
        <h2>{guide.requirementsTitle}</h2>
        <p className={style.note}>Checked against the sources below in {guide.checked}. Rules change, so confirm the current requirements before publishing.</p>
        <table className={style.table}>
          <tbody>{guide.requirements.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
        </table>
      </section>

      <section className={style.section}>
        <h2>How this tool fits</h2>
        <ul className={style.list}>{guide.toolFit.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className={style.section}>
        <h2>How to resize product photos step by step</h2>
        <ol className={style.steps}>{guide.steps.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </section>

      <section className={style.section}>
        <h2>Common mistakes</h2>
        <dl className={style.mistakes}>{guide.mistakes.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
      </section>

      <section className={style.section} id="faq">
        <h2>Frequently asked questions</h2>
        <div className={style.faq}>{guide.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className={style.section}>
        <h2>Sources</h2>
        <ul className={style.list}>{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
        {related.length > 0 && (
          <>
            <h2>More product image guides</h2>
            <ul className={style.list}>{related.map((item) => <li key={item.slug}><a href={`${getLocalePath("en-US")}${item.slug}/`}>{item.navLabel}</a></li>)}</ul>
          </>
        )}
      </section>
    </div>
  );
}
