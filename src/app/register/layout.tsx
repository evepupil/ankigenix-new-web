import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "注册",
  description: "注册 Ankigenix 账户，免费体验AI驱动的科学闪卡生成器，开启高效学习之旅。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
