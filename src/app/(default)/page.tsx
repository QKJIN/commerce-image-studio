import ClientPage from "../ClientPage";
import RootLocaleRedirect from "../RootLocaleRedirect";
import zhCN from "@/locales/zh-CN";

export default function Page() {
  return (
    <>
      <ClientPage lang="zh-CN" locale={zhCN} />
      <RootLocaleRedirect />
    </>
  );
}
