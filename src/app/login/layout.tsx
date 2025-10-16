import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "登录",
  description: "登录您的 Ankigenix 账户，开始使用AI驱动的闪卡生成服务。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
