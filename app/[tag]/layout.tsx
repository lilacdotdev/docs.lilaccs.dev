export default function TagLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

// Generate static params for all valid tags
export async function generateStaticParams() {
  return []
} 