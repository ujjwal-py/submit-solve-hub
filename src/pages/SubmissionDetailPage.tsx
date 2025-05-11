
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import Editor from "@monaco-editor/react";

// Mock submissions data
const mockSubmissions = [
  {
    id: "1",
    userId: "1",
    username: "user",
    challengeId: "1",
    challengeTitle: "Two Sum",
    language: "javascript",
    submittedAt: "2023-07-10T10:30:00Z",
    code: "function twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}"
  },
  {
    id: "2",
    userId: "1",
    username: "user",
    challengeId: "2",
    challengeTitle: "Valid Parentheses",
    language: "python",
    submittedAt: "2023-07-11T14:45:00Z",
    code: "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    \n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else '#'\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    \n    return not stack"
  }
];

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
  
  const [submission, setSubmission] = useState(
    mockSubmissions.find((s) => s.id === id) || null
  );

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  // Redirect if submission doesn't exist
  useEffect(() => {
    if (!submission && !isLoading) {
      navigate("/admin");
    }
  }, [submission, isLoading, navigate]);

  if (isLoading || !user || !user.isAdmin || !submission) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-medium">{submission.username}</p>
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
