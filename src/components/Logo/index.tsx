import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

// Keep in sync with public/icon.svg.
const LogoMark = ({ size = 40 }: { size?: number }) => (
  <svg
    className={style.icon}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="64" height="64" rx="14" fill="#007a60" />
    <path
      d="M24.5 23v-3.5a7.5 7.5 0 0 1 15 0V23"
      fill="none"
      stroke="#fff"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M17.6 23h28.8a2 2 0 0 1 2 2.1l-1.5 22.6a3.5 3.5 0 0 1-3.5 3.3H20.6a3.5 3.5 0 0 1-3.5-3.3l-1.5-22.6a2 2 0 0 1 2-2.1z"
      fill="#fff"
    />
    <circle cx="38.5" cy="32" r="3.2" fill="#e7bd59" />
    <path d="M21.5 45.5 28 37.5l4.5 5 3.5-3.5 6.5 6.5z" fill="#007a60" />
  </svg>
);

export const Logo = observer(
  ({ iconSize = 40, title = "商图工坊" }: LogoProps) => {
    return (
      <div className={style.container}>
        <LogoMark size={iconSize} />
        <span>{title}</span>
      </div>
    );
  },
);
