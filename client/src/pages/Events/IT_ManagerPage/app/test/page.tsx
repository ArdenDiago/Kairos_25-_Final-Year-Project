"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Clock, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getQuestions, postData } from "../../../../../server/Events/ItManager.js"

interface Question {
  question: string
  options: string[]
}

export default function Test({ onCompleat }: { onCompleat: () => void }) {
  const [teamName, setTeamName] = useState("")
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [error, setError] = useState("")
  const [showUnanswered, setShowUnanswered] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Create refs for each question
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Fetch questions from server
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await getQuestions()
        const transformedQuestions: Question[] = response.map((q: any) => ({
          question: q.question,
          options: q.options,
        }))
        setQuestions(transformedQuestions)
        questionRefs.current = new Array(transformedQuestions.length).fill(null)
      } catch (err) {
        setError("Failed to load questions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()

    const storedTeamName = localStorage.getItem("teamName")
    if (!storedTeamName) {
      return
    }
    setTeamName(storedTeamName)

    const completed = localStorage.getItem("testCompleted") === "true"
    if (completed) {
      return
    }

    const savedAnswers = localStorage.getItem("answers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }

    const started = localStorage.getItem("testStarted") === "true"
    if (started) {
      setTestStarted(true)
      const endTimeStr = localStorage.getItem("endTime")
      if (endTimeStr) {
        const endTime = Number.parseInt(endTimeStr, 10)
        const now = Math.floor(Date.now() / 1000)
        const remaining = Math.max(0, endTime - now)
        setTimeLeft(remaining)
      }
      const savedStartTime = localStorage.getItem("startTime")
      if (savedStartTime) {
        setStartTime(Number.parseInt(savedStartTime, 10))
      }
    }
  }, [])

  useEffect(() => {
    if (!testStarted) return

    localStorage.setItem("testStarted", "true")
    localStorage.setItem("answers", JSON.stringify(answers))
    if (startTime) {
      localStorage.setItem("startTime", startTime.toString())
    }

    if (!localStorage.getItem("endTime")) {
      const endTime = Math.floor(Date.now() / 1000) + timeLeft
      localStorage.setItem("endTime", endTime.toString())
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testStarted, answers, startTime])

  const startTest = () => {
    setTestStarted(true)
    setStartTime(Math.floor(Date.now() / 1000))
  }

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
    if (showUnanswered) {
      setShowUnanswered(false)
    }
  }

  const handleSubmitAttempt = () => {
    if (Object.keys(answers).length < questions.length) {
      setShowUnanswered(true)
      const unansweredIndex = questions.findIndex((_, index) => answers[index] === undefined)
      if (unansweredIndex !== -1 && questionRefs.current[unansweredIndex]) {
        questionRefs.current[unansweredIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
      return
    }
    handleSubmit()
  }

  const handleSubmit = async () => {
    const submissionTime = Math.floor(Date.now() / 1000)
    const duration = startTime ? submissionTime - startTime : 0

    const results = {
      teamName,
      answers,
      totalQuestions: questions.length,
      timestamp: new Date().toISOString(),
      duration, // Duration in seconds
    }

    try {
      await postData(results)
      localStorage.setItem("testCompleted", "true")
      setTestCompleted(true)
      onCompleat()
    } catch (err) {
      setError("Failed to submit results to server.")
      localStorage.setItem("testCompleted", "true")
      onCompleat()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div>Loading questions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 text-black">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, {teamName}!</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Test Instructions:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You will have 30 minutes to complete the test.</li>
              <li>The test consists of {questions.length} multiple-choice questions.</li>
              <li>All questions are displayed on a single page.</li>
              <li>You must answer all questions before submitting.</li>
              <li>The test will be automatically submitted when the timer ends.</li>
            </ul>
          </div>
          <Button onClick={startTest} className="bg-purple-600 hover:bg-purple-700 text-white">
            Start Test Now
          </Button>
        </div>
      </div>
    )
  }

  const unansweredCount = questions.length - Object.keys(answers).length
  const unansweredQuestions = questions
    .map((_, index) => (answers[index] === undefined ? index : null))
    .filter((index): index is number => index !== null)

  return (
    <>
    <div className="min-h-screen bg-gray-100 pb-20 text-black">
      <div className="sticky top-0 z-10 bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="font-bold">Team: {teamName}</h1>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <Clock className={`h-5 w-5 ${timeLeft < 300 ? "text-red-500" : "text-gray-700"}`} />
              <span className={timeLeft < 300 ? "text-red-500" : "text-gray-700"}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {Object.keys(answers).length} of {questions.length} questions Ditails zur Seite gehen und dort eine neue Seite in einem neuen Fenster öffnen
              Progress: {Object.keys(answers).length} of {questions.length} questions answered
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((Object.keys(answers).length / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">IT Manager Aptitude Test</h2>
            <p className="text-gray-600">Answer all {questions.length} questions below. Your answers are saved automatically.</p>
          </div>

          {showUnanswered && unansweredCount > 0 && (
            <Alert variant="destructive" className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-800" />
              <AlertDescription className="text-amber-800">
                Please answer all questions before submitting. You have {unansweredCount} unanswered questions.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-8">
            {questions.map((question, index) => {
              const isAnswered = answers[index] !== undefined

              return (
                <div
                  key={index}
                  ref={(el) => (questionRefs.current[index] = el)}
                  className={`transition-all duration-300 ${
                    showUnanswered && !isAnswered ? "ring-2 ring-red-400 rounded-lg" : ""
                  }`}
                >
                  <Card
                    className={`border-gray-200 ${
                      showUnanswered && !isAnswered ? "bg-red-50" : isAnswered ? "bg-green-50 border-green-200" : ""
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="mb-4 flex items-start">
                        <span
                          className={`flex items-center justify-center rounded-full w-8 h-8 mr-3 flex-shrink-0 ${
                            isAnswered
                              ? "bg-green-100 text-green-800"
                              : showUnanswered
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold">{question.question}</h3>
                      </div>
                      <div className="space-y-3 pl-11">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            onClick={() => handleAnswerChange(index, optionIndex)}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                              answers[index] === optionIndex
                                ? "bg-purple-100 border-purple-300"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                                answers[index] === optionIndex ? "border-purple-600" : "border-gray-300"
                              }`}
                            >
                              {answers[index] === optionIndex && <div className="w-3 h-3 rounded-full bg-purple-600"></div>}
                            </div>
                            <Label className="cursor-pointer w-full">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          <div className="mt-8 sticky bottom-4 flex justify-center">
            <Button
              onClick={handleSubmitAttempt}
              size="lg"
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 px-8 py-6 text-lg"
            >
              {unansweredCount > 0 ? `Submit Test (${unansweredCount} questions remaining)` : "Submit Test"}
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    </>
  )
}