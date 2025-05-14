
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

interface Submission {
  id: string;
  user_id: string;
  username?: string;
  challengeId: string;
  challengeTitle: string;
  language: string;
  submittedAt: string;
  code: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const AdminPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);
  
  // Fetch submissions from Supabase
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.isAdmin) return;
      
      setIsLoadingSubmissions(true);
      try {
        // Get all submissions
        const { data, error } = await supabase
          .from("submissions")
          .select(`
            id,
            user_id,
            challenge_id,
            language,
            code,
            submitted_at
          `)
          .order('submitted_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching submissions:", error);
          return;
        }
        
        // Process submissions and add challenge titles
        const processedSubmissions = data.map(submission => {
          const challenge = challenges.find(c => c.id === submission.challenge_id);
          return {
            id: submission.id,
            user_id: submission.user_id,
            username: submission.user_id.slice(0, 8), // Using part of the UUID as a temp username
            challengeId: submission.challenge_id,
            challengeTitle: challenge ? challenge.title : `Challenge ${submission.challenge_id}`,
            language: submission.language,
            submittedAt: submission.submitted_at,
            code: submission.code
          };
        });
        
        setSubmissions(processedSubmissions);
      } catch (error) {
        console.error("Error in fetchSubmissions:", error);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };
    
    if (user?.isAdmin) {
      fetchSubmissions();
    }
  }, [user]);

  if (isLoading || !user || !user.isAdmin) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Review and manage user submissions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSubmissions ? (
              <div className="text-center py-8">
                <p>Loading submissions...</p>
              </div>
            ) : submissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Challenge</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-xs">{submission.user_id}</TableCell>
                      <TableCell>{submission.challengeTitle}</TableCell>
                      <TableCell className="capitalize">{submission.language}</TableCell>
                      <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                      <TableCell>
                        <button 
                          className="text-primary hover:underline"
                          onClick={() => navigate(`/admin/submission/${submission.id}`)}
                        >
                          View Details
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No submissions yet
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPage;
