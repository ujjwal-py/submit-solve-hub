
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import Editor from "@monaco-editor/react";
import { supabase } from "@/integrations/supabase/client";
import { challenges } from "@/lib/data";

interface Submission {
  id: string;
  user_id: string;
  challenge_id: string;
  challengeTitle: string;
  language: string;
  submittedAt: string;
  code: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};

const SubmissionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  // Fetch submission details from Supabase
  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      if (!id || !user?.isAdmin) return;

      setIsLoadingSubmission(true);
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching submission:", error);
          navigate("/admin");
          return;
        }

        if (data) {
          const challenge = challenges.find(c => c.id === data.challenge_id);
          setSubmission({
            id: data.id,
            user_id: data.user_id,
            challenge_id: data.challenge_id,
            challengeTitle: challenge ? challenge.title : `Challenge ${data.challenge_id}`,
            language: data.language,
            submittedAt: data.submitted_at,
            code: data.code
          });
        } else {
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error in fetchSubmissionDetails:", error);
        navigate("/admin");
      } finally {
        setIsLoadingSubmission(false);
      }
    };

    if (user?.isAdmin && id) {
      fetchSubmissionDetails();
    }
  }, [id, user, navigate]);

  // Redirect if submission doesn't exist
  useEffect(() => {
    if (!isLoadingSubmission && !submission && !isLoading) {
      navigate("/admin");
    }
  }, [submission, isLoadingSubmission, isLoading, navigate]);

  if (isLoading || !user || !user.isAdmin || isLoadingSubmission) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!submission) {
    return <div className="flex items-center justify-center h-screen">Submission not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="text-primary hover:underline flex items-center mb-4"
          >
            ← Back to Admin Dashboard
          </button>
          <h1 className="text-3xl font-bold">Submission Details</h1>
        </div>

        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Challenge</p>
                  <p className="font-medium">{submission.challengeTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium font-mono text-xs">{submission.user_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium capitalize">{submission.language}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDate(submission.submittedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="code-editor-container">
                <Editor
                  height="500px"
                  language={submission.language}
                  theme="vs-dark"
                  value={submission.code}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SubmissionDetailPage;
