
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navbar } from "@/components/Navbar";
import { challenges } from "@/lib/data";

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

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

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
            {mockSubmissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Challenge</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.username}</TableCell>
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
