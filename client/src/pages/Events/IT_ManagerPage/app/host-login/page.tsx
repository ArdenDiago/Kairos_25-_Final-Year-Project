"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HostLogin({onAdmin}) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate();
  console.log("hii");

  // For demo purposes, using a hardcoded password
  // In a real application, this would be authenticated properly
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === "admin123") {
      localStorage.setItem("isHost", "true")
      onAdmin();
      // navigate('dashboard');
    } else {
      setError("Invalid password")
    }
  }

  return (
    <div className  ="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-800 bg-gray-900 text-white">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <Lock className="h-12 w-12 text-purple-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Host Login</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Access the admin dashboard to view test results
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter host password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
              />
              {/* <p className="text-xs text-gray-400">For demo: use "admin123"</p> */}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

