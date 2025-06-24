"use client"

import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function TestCompleted() {
  // const router = useRouter()
  const [teamName, setTeamName] = useState("")
  const [score, setScore] = useState<number | null>(null)
  const [totalQuestions, setTotalQuestions] = useState(0)

  useEffect(() => {
    // Check if test was completed
    const completed = localStorage.getItem("testCompleted") === "true"
    if (!completed) {
      // router.push("/team-login")
      return
    }

    // Get team name
    const storedTeamName = localStorage.getItem("teamName")
    if (!storedTeamName) {
      // router.push("/team-login")
      return
    }
    setTeamName(storedTeamName)

    // Get results
    const allResults = JSON.parse(localStorage.getItem("allResults") || "[]")
    const teamResult = allResults.find((r: any) => r.teamName === storedTeamName)

    if (teamResult) {
      setScore(teamResult.score)
      setTotalQuestions(teamResult.totalQuestions)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Test Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-2">
              Thank you, <span className="font-semibold">{teamName}</span>!
            </p>
            <p className="text-gray-600">Your responses have been recorded.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-600">Your responses have been recorded successfully.</p>
            <p className="text-gray-600 mt-2">Thank you for participating in the IT Manager Aptitude Test!</p>
          </div>



          <div className="pt-4">
            <Link to="/">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

