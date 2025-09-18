import { AdminErrorBoundary } from '@/components/AdminErrorBoundary'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminErrorBoundary>
      {children}
    </AdminErrorBoundary>
  )
}
