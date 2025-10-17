import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Target, Trophy, Calendar } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" data-testid="text-landing-title">
            StudyFlow
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Track your study sessions, build streaks, and achieve your learning goals
          </p>
          <Button
            size="lg"
            onClick={handleLogin}
            className="gap-2"
            data-testid="button-login"
          >
            <BookOpen className="h-5 w-5" />
            Sign in to Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Study Sessions</h3>
            <p className="text-sm text-muted-foreground">
              Create custom study sessions organized by themes and track your progress
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Focus Timer</h3>
            <p className="text-sm text-muted-foreground">
              Stay focused with built-in timer and take notes after each session
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Streak Badges</h3>
            <p className="text-sm text-muted-foreground">
              Earn badges for daily streaks from 7 days to 10 years of consistent study
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">
              View your study calendar and detailed statistics for all your sessions
            </p>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Sign in with Google, GitHub, Apple, or email to access your study data from any device
          </p>
        </div>
      </div>
    </div>
  );
}
