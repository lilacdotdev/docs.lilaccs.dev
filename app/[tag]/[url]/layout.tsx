export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

// Generate static params for all valid tag/url combinations
export async function generateStaticParams() {
  return []
} 