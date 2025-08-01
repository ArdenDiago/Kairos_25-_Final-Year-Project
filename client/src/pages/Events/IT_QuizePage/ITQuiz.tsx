
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HostQuiz from "./pages/HostQuiz";
import PlayerQuiz from "./pages/PlayerQuiz";
import ITQuizParticipant from "./pages/ITQuizParticipant";
import ITQuizHost from "./pages/ITQuizHost";

const queryClient = new QueryClient();

const ITQuiz = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/host/:quizId" element={<HostQuiz />} />
          <Route path="/play/:gameId" element={<PlayerQuiz />} />
          <Route path="/itquizparticipant" element={<ITQuizParticipant />} />
          <Route path="/itquizhost" element={<ITQuizHost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default ITQuiz;
