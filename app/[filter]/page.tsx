import { redirect } from "next/navigation"

const validFilters = ["projects", "ai", "machine-learning", "web-dev", "hardware", "software", "personal", "other"]

interface FilterPageProps {
  params: {
    filter: string
  }
}

export default function FilterPage({ params }: FilterPageProps) {
  if (!validFilters.includes(params.filter)) {
    redirect("/")
  }

  // This will be handled by the main page component
  redirect("/")
}

export function generateStaticParams() {
  return validFilters.map((filter) => ({
    filter,
  }))
}
