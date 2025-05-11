
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { challenges, Challenge } from "@/lib/data";
import { Navbar } from "@/components/Navbar";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const getDifficultyColor = (difficulty: Challenge["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-orange-500";
      case "Hard":
        return "text-red-500";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: Challenge["status"]) => {
    switch (status) {
      case "Not Started":
        return <Badge variant="outline" className="status-badge status-not-started">Not Started</Badge>;
      case "Submitted":
        return <Badge variant="outline" className="status-badge status-submitted">Submitted</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Coding Challenges</h1>
          <p className="text-muted-foreground">
            Click on a challenge to view details and submit your solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id}
              className="challenge-card overflow-hidden hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/challenge/${challenge.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{challenge.title}</h3>
                  {getStatusBadge(challenge.status)}
                </div>
                <p className="text-muted-foreground text-sm mb-4">{challenge.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
