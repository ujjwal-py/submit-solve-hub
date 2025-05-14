
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { challenges, programmingLanguages } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import Editor from "@monaco-editor/react";
import { supabase } from "@/integrations/supabase/client";

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState(
    challenges.find((c) => c.id === id) || null
  );
  const [language, setLanguage] = useState(programmingLanguages[0]);
  const [code, setCode] = useState(programmingLanguages[0].defaultCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<string>("Not Started");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Redirect if challenge doesn't exist
  useEffect(() => {
    if (!challenge && !isLoading) {
      navigate("/dashboard");
    }
  }, [challenge, isLoading, navigate]);

  // Fetch challenge status from Supabase or create a new status
  useEffect(() => {
    const fetchChallengeStatus = async () => {
      if (!user || !id) return;

      setIsLoadingStatus(true);
      try {
        // Try to get existing status
        const { data, error } = await supabase
          .from("challenge_status")
          .select("status")
          .eq("user_id", user.id)
          .eq("challenge_id", id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching challenge status:", error);
          return;
        }

        if (data) {
          // Status exists
          setChallengeStatus(data.status);
          setIsSubmitted(data.status === "Submitted");
          
          // Update challenge object with status
          if (challenge) {
            setChallenge({
              ...challenge,
              status: data.status as any
            });
          }
        } else {
          // Status doesn't exist, create a new one with "Started" status
          if (user && id) {
            const { error: insertError } = await supabase
              .from("challenge_status")
              .insert({
                user_id: user.id,
                challenge_id: id,
                status: "Started"
              });

            if (insertError) {
              console.error("Error inserting challenge status:", insertError);
              return;
            }

            setChallengeStatus("Started");
            
            // Update challenge object with status
            if (challenge) {
              setChallenge({
                ...challenge,
                status: "Started" as any
              });
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchChallengeStatus:", error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    if (user && id) {
      fetchChallengeStatus();
    }
  }, [user, id, challenge]);

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = programmingLanguages.find((lang) => lang.value === value);
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      setCode(selectedLanguage.defaultCode);
    }
  };

  const handleSubmit = async () => {
    if (!user || !id) return;
    
    setIsSubmitting(true);
    
    try {
      // Save submission to Supabase
      const { error: submissionError } = await supabase
        .from("submissions")
        .insert({
          user_id: user.id,
          challenge_id: id,
          language: language.value,
          code
        });

      if (submissionError) {
        console.error("Error saving submission:", submissionError);
        toast({
          title: "Error",
          description: "Failed to submit solution. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Update challenge status to Submitted
      const { error: statusError } = await supabase
        .from("challenge_status")
        .update({ status: "Submitted", updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("challenge_id", id);

      if (statusError) {
        console.error("Error updating challenge status:", statusError);
      }

      // Update local state
      setChallengeStatus("Submitted");
      
      if (challenge) {
        const updatedChallenge = { ...challenge, status: "Submitted" as const };
        setChallenge(updatedChallenge);
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Solution submitted",
        description: "Your solution has been successfully submitted for review.",
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading || !user || !challenge) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:underline flex items-center mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-sm font-medium">
              Difficulty:{" "}
              <span
                className={
                  challenge.difficulty === "Easy"
                    ? "text-green-500"
                    : challenge.difficulty === "Medium"
                    ? "text-orange-500"
                    : "text-red-500"
                }
              >
                {challenge.difficulty}
              </span>
            </span>
            <span className="text-sm font-medium">
              Status:{" "}
              <span
                className={
                  challengeStatus === "Submitted"
                    ? "text-green-500"
                    : challengeStatus === "Started"
                    ? "text-blue-500"
                    : "text-gray-500"
                }
              >
                {isLoadingStatus ? "Loading..." : challengeStatus}
              </span>
            </span>
          </div>
        </div>

        {/* Challenge Image */}
        <Card className="mb-6 overflow-hidden">
          <img
            src={challenge.imageUrl}
            alt={challenge.title}
            className="w-full object-cover"
          />
        </Card>

        {/* Code Editor */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="language-selector flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Language:</span>
                <Select
                  value={language.value}
                  onValueChange={handleLanguageChange}
                  disabled={isSubmitted}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  className="gradient-bg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Solution"}
                </Button>
              ) : (
                <Button disabled className="bg-success text-white">
                  Submitted
                </Button>
              )}
            </div>
            <div className="code-editor-container">
              <Editor
                height="500px"
                language={language.value}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: isSubmitted,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
            <h3 className="font-semibold text-lg">Solution Submitted</h3>
            <p>Your solution has been submitted and will be reviewed soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChallengePage;
