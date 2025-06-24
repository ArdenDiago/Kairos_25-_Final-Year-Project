"use client"

import type React from "react"

import { useState } from "react"
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TeamLogin({ onSubmitButton }) {
  const [teamName, setTeamName] = useState("")
  const [error, setError] = useState("")
  // const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamName.trim()) {
      setError("Please enter a team name")
      return
    }

    // Store team name in localStorage
    localStorage.setItem("teamName", teamName)
    localStorage.removeItem("testStarted")
    localStorage.removeItem("testCompleted")
    localStorage.removeItem("answers")
    localStorage.removeItem("endTime")
    onSubmitButton();
    // Redirect to test page
    // router.push("/test")
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-800 bg-gray-900 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Team Login</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Enter your team name to start the aptitude test
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
              />
            </div>
            <div className="text-sm text-gray-400">
              <p>You will have 30 minutes to complete the test once you start.</p>

            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"

            >
              Start Test
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

