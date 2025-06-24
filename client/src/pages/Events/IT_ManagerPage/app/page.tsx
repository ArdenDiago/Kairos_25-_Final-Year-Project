import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, FileSpreadsheet, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
            IT Manager Aptitude Test
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Test your IT management knowledge with our comprehensive aptitude assessment
          </p>

          <div className="grid gap-8 md:grid-cols-3 mb-16">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <Clock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">30-Minute Timer</h2>
              <p className="text-gray-400">Complete 30 questions within the time limit</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <Users className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Team-Based</h2>
              <p className="text-gray-400">Participate as a team and showcase your collective knowledge</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <FileSpreadsheet className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Instant Results</h2>
              <p className="text-gray-400">Host can access and export detailed performance data</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/team-login">
              <Button
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Start as Team
              </Button>
            </Link>
            <Link href="/host-login">
              <Button
                size="lg"
                variant="outline"
                className="w-full md:w-auto border-purple-500 text-purple-400 hover:bg-purple-950"
              >
                Login as Host
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} IT Manager Aptitude Test. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

