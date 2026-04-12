export const metadata = {
  robots: 'noindex, nofollow',
  title: '...',
}

import { CRTProvider } from "@/components/CRTProvider";

export default function VoidLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#121212' }}>
        <CRTProvider>
          {children}
        </CRTProvider>
      </body>
    </html>
  )
}
