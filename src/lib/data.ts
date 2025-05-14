
export type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Not Started" | "Started" | "Submitted";
  imageUrl: string;
};

export const challenges: Challenge[] = [
  {
    id: "1",
    title: "Two Sum",
    description: "Find two numbers in the array that add up to the target.",
    difficulty: "Easy",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Two+Sum+Problem"
  },
  {
    id: "2",
    title: "Valid Parentheses",
    description: "Determine if the input string has valid parentheses.",
    difficulty: "Easy",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Valid+Parentheses+Problem"
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Longest+Substring+Problem"
  },
  {
    id: "4",
    title: "LRU Cache",
    description: "Implement an LRU Cache with get and put operations.",
    difficulty: "Medium",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=LRU+Cache+Problem"
  },
  {
    id: "5",
    title: "Merge K Sorted Lists",
    description: "Merge k sorted linked lists into one sorted linked list.",
    difficulty: "Hard",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Merge+K+Sorted+Lists+Problem"
  },
  {
    id: "6",
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    difficulty: "Easy",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Reverse+Linked+List+Problem"
  },
  {
    id: "7",
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum.",
    difficulty: "Easy",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Maximum+Subarray+Problem"
  },
  {
    id: "8",
    title: "Binary Tree Level Order Traversal",
    description: "Return the level order traversal of a binary tree's values.",
    difficulty: "Medium",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Binary+Tree+Level+Order+Traversal+Problem"
  },
  {
    id: "9",
    title: "Trapping Rain Water",
    description: "Calculate how much water can be trapped after raining.",
    difficulty: "Hard",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Trapping+Rain+Water+Problem"
  },
  {
    id: "10",
    title: "Word Search",
    description: "Determine if a word exists in a grid of letters.",
    difficulty: "Medium",
    status: "Not Started",
    imageUrl: "https://placehold.co/800x400/e2e8f0/1e293b?text=Word+Search+Problem"
  }
];

export const programmingLanguages = [
  { label: "JavaScript", value: "javascript", defaultCode: "function solution() {\n  // Write your code here\n}\n" },
  { label: "Python", value: "python", defaultCode: "def solution():\n    # Write your code here\n    pass\n" },
  { label: "Java", value: "java", defaultCode: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}" },
  { label: "C++", value: "cpp", defaultCode: "#include <iostream>\n\nint main() {\n    // Write your code here\n    return 0;\n}" }
];
