import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

export const Logo = observer(
  ({ iconSize = 40, title = "商图工坊" }: LogoProps) => {
    return (
      <div className={style.container}>
        <span
          className={style.icon}
          style={{ width: iconSize, height: iconSize }}
        >
          <span aria-hidden="true">图</span>
        </span>
        <span>{title}</span>
      </div>
    );
  },
);
