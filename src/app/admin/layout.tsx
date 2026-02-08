import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Gateway to Korea',
  description: 'Gateway to Korea Admin Dashboard',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
