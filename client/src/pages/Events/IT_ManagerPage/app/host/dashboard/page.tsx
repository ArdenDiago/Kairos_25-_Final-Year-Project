import React, { useEffect, useState } from 'react';
import { fetchResultsFromServer, fetchQuestionsFromServer } from '../../../../../../server/Events/ItManager.js';

// Define interfaces for server data
interface Result {
  _id: string;
  teamName: string;
  accuracyScore: number;
  answers: any[];
  duration: number;
  score: number;
  totalQuestions: number;
  timestamp: string;
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  duration: number;
}

const Leaderboard: React.FC<{ results: Result[] }> = ({ results }) => {
  // Calculate average duration
  const averageDuration = results.length > 0 
    ? (results.reduce((sum, result) => sum + result.duration, 0) / results.length).toFixed(2)
    : '0.00';

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Rank,Team Name,Score,Accuracy (%),Duration (s),Timestamp'];
    const rows = results
      .sort((a, b) => b.score - a.score)
      .map((result, index) => 
        `${index + 1},${result.teamName},${result.score}/${result.totalQuestions},${result.accuracyScore},${result.duration},${new Date(result.timestamp).toLocaleString()}`
      );
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'leaderboard.csv';
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Leaderboard</h2>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">Total Teams: {results.length}</p>
        <p className="text-gray-600">Average Duration: {averageDuration} seconds</p>
        <button
          onClick={exportToCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export to CSV
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Rank</th>
            <th className="p-3">Team Name</th>
            <th className="p-3">Score</th>
            <th className="p-3">Accuracy (%)</th>
            <th className="p-3">Duration (s)</th>
            <th className="p-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {results.sort((a, b) => b.score - a.score).map((result, index) => (
            <tr key={result._id} className="border-b">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{result.teamName}</td>
              <td className="p-3">{result.score}/{result.totalQuestions}</td>
              <td className="p-3">{result.accuracyScore}</td>
              <td className="p-3">{result.duration}</td>
              <td className="p-3">{new Date(result.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const QuestionList: React.FC<{ questions: Question[] }> = ({ questions }) => {
  // Handle non-array or empty questions
  {console.log("Question arrr: ",questions)}
  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Questions</h2>
        <p className="text-gray-600">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Questions</h2>
      <p className="text-gray-600 mb-4">Total Questions: {questions.length}</p>
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question._id} className="border p-4 rounded-md">
            <p className="font-semibold">Question {index + 1}: {question.question}</p>
            <ul className="list-disc ml-6 mt-2">
              {question.options.map((option, i) => (
                <li key={i} className="text-gray-600">{option}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HostDashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsData, questionsData] = await Promise.all([
          fetchResultsFromServer(),
          fetchQuestionsFromServer(),
        ]);

        // Log the questions data for debugging
        console.log('Questions data:', questionsData);

        // Ensure questionsData is an array
        const validatedQuestions = Array.isArray(questionsData) ? questionsData : [];
        setResults(resultsData);
        setQuestions(validatedQuestions);
        console.log("Questions Added: ", questions);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Host Dashboard</h1>
      <Leaderboard results={results} />
      <QuestionList questions={questions} />
    </div>
  );
}