import { Button } from "@/components/ui/button"
import Link from "next/link"
 
export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-card rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="mb-4">
          {searchParams.error 
            ? `Error: ${searchParams.error}` 
            : 'Sorry, there was a problem signing you in.'}
        </p>
        <Button asChild>
          <Link href="/auth/signin">
            Try Again
          </Link>
        </Button>
      </div>
    </div>
  )
}
