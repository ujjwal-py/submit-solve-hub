
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

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = programmingLanguages.find((lang) => lang.value === value);
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      setCode(selectedLanguage.defaultCode);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call to submit code
    setTimeout(() => {
      // Update challenge status
      if (challenge) {
        const updatedChallenge = { ...challenge, status: "Submitted" as const };
        setChallenge(updatedChallenge);
        
        // Update challenges list
        const updatedChallenges = challenges.map((c) =>
          c.id === id ? updatedChallenge : c
        );
        
        // In a real app, we would persist this to a database
        console.log("Submitted solution:", {
          userId: user?.id,
          challengeId: id,
          language: language.value,
          code,
          submittedAt: new Date().toISOString(),
        });
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Solution submitted",
        description: "Your solution has been successfully submitted for review.",
      });
    }, 1500);
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
                  challenge.status === "Submitted"
                    ? "text-green-500"
                    : "text-gray-500"
                }
              >
                {challenge.status}
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
                height="100%"
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
