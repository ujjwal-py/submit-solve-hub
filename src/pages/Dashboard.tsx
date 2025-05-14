
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { challenges, Challenge } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [challengesWithStatus, setChallengesWithStatus] = useState<Challenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Fetch challenge statuses from Supabase
  useEffect(() => {
    const fetchChallengeStatuses = async () => {
      if (!user) return;

      setIsLoadingChallenges(true);
      try {
        // Get all challenge statuses for the user
        const { data, error } = await supabase
          .from("challenge_status")
          .select("challenge_id, status")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching challenge statuses:", error);
          return;
        }

        // Create a map of challenge_id to status
        const statusMap = new Map();
        if (data) {
          data.forEach(item => {
            statusMap.set(item.challenge_id, item.status);
          });
        }

        // Merge challenge data with status
        const updatedChallenges = challenges.map(challenge => ({
          ...challenge,
          status: statusMap.get(challenge.id) || "Not Started"
        }));

        setChallengesWithStatus(updatedChallenges);
      } catch (error) {
        console.error("Error in fetchChallengeStatuses:", error);
      } finally {
        setIsLoadingChallenges(false);
      }
    };

    if (user) {
      fetchChallengeStatuses();
    } else {
      // If no user, just show challenges with default status
      setChallengesWithStatus(challenges);
      setIsLoadingChallenges(false);
    }
  }, [user]);

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
      case "Started":
        return <Badge variant="outline" className="status-badge status-started bg-blue-100 text-blue-800 border-blue-300">Started</Badge>;
      case "Submitted":
        return <Badge variant="outline" className="status-badge status-submitted bg-green-100 text-green-800 border-green-300">Submitted</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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

        {isLoadingChallenges ? (
          <div className="flex justify-center py-12">
            <div className="text-lg">Loading challenges...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challengesWithStatus.map((challenge) => (
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
        )}
      </main>
    </div>
  );
};

export default Dashboard;
