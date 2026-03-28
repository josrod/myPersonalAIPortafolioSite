import { useState } from "react";
import { Brain, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "react-i18next";

type ProblemType = "math" | "coding" | "logic" | "general" | "optimization";

interface Solution {
  problem: string;
  type: ProblemType;
  solution: string;
  steps: string[];
  timestamp: Date;
}

export function AIApp() {
  const { t } = useTranslation();
  const [problem, setProblem] = useState("");
  const [problemType, setProblemType] = useState<ProblemType>("general");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Solution[]>([]);

  const solveProblem = async () => {
    if (!problem.trim()) return;

    setIsLoading(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newSolution = generateSolution(problem, problemType);
    setSolution(newSolution);
    setHistory([newSolution, ...history]);
    setIsLoading(false);
  };

  const generateSolution = (problemText: string, type: ProblemType): Solution => {
    const solutions: Record<ProblemType, { solution: string; steps: string[] }> = {
      math: {
        solution:
          "Based on the mathematical problem provided, here's a structured solution approach. The problem can be solved using fundamental mathematical principles and step-by-step calculations.",
        steps: [
          "Identify the key variables and constants in the problem",
          "Determine the appropriate mathematical formula or theorem to apply",
          "Substitute the known values into the equation",
          "Perform the calculations systematically",
          "Verify the result by checking units and reasonableness",
          "Present the final answer with proper notation",
        ],
      },
      coding: {
        solution:
          "For this coding challenge, we'll use an efficient algorithm that balances time complexity and code readability. The solution leverages modern programming patterns and best practices.",
        steps: [
          "Analyze the problem requirements and constraints",
          "Design the data structures needed",
          "Outline the algorithm with pseudocode",
          "Implement the core logic with proper error handling",
          "Add test cases to verify correctness",
          "Optimize for performance and clean code principles",
        ],
      },
      logic: {
        solution:
          "This logical problem can be approached through systematic reasoning and deductive analysis. Let's break down the premises and work toward a logical conclusion.",
        steps: [
          "List all given premises and facts",
          "Identify the logical relationships between statements",
          "Apply deductive reasoning rules",
          "Eliminate contradictions and impossibilities",
          "Test the hypothesis against all conditions",
          "Arrive at the logical conclusion",
        ],
      },
      optimization: {
        solution:
          "To optimize this problem, we'll analyze the constraints and objectives to find the most efficient solution. This involves balancing multiple factors and trade-offs.",
        steps: [
          "Define the objective function to maximize or minimize",
          "Identify all constraints and boundaries",
          "Analyze potential solution approaches",
          "Calculate trade-offs between different options",
          "Apply optimization techniques (linear programming, heuristics, etc.)",
          "Validate the optimized solution meets all requirements",
        ],
      },
      general: {
        solution:
          "Let's approach this problem with a structured problem-solving methodology. By breaking it down into manageable components, we can develop a comprehensive solution.",
        steps: [
          "Clearly define the problem and desired outcome",
          "Gather all relevant information and context",
          "Brainstorm potential solutions and approaches",
          "Evaluate pros and cons of each approach",
          "Select the best solution based on criteria",
          "Create an action plan with specific steps",
          "Implement and monitor the results",
        ],
      },
    };

    const solutionData = solutions[type];

    return {
      problem: problemText,
      type,
      solution: solutionData.solution,
      steps: solutionData.steps,
      timestamp: new Date(),
    };
  };

  const problemTypes: { value: ProblemType; label: string; description: string }[] = [
    { value: "general", label: "General Problem", description: "Any general question or challenge" },
    { value: "math", label: "Mathematics", description: "Math equations and calculations" },
    { value: "coding", label: "Programming", description: "Code logic and algorithms" },
    { value: "logic", label: "Logic Puzzle", description: "Logical reasoning problems" },
    { value: "optimization", label: "Optimization", description: "Efficiency and resource optimization" },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full mb-6">
            <Brain className="w-5 h-5" />
            <span>AI-Powered Solution Engine</span>
          </div>
          <h1 className="text-5xl text-slate-900 mb-4">AI Problem Solver</h1>
          <p className="text-xl text-slate-600">
            Describe your problem and get intelligent, step-by-step solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="problemType" className="text-lg mb-2 block">
                    Problem Type
                  </Label>
                  <Select value={problemType} onValueChange={(value) => setProblemType(value as ProblemType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select problem type" />
                    </SelectTrigger>
                    <SelectContent>
                      {problemTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div>{type.label}</div>
                            <div className="text-xs text-slate-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="problem" className="text-lg mb-2 block">
                    Describe Your Problem
                  </Label>
                  <Textarea
                    id="problem"
                    placeholder="Enter your problem in detail... The more context you provide, the better the solution will be."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="min-h-[200px] text-base"
                  />
                </div>

                <Button
                  onClick={solveProblem}
                  disabled={!problem.trim() || isLoading}
                  size="lg"
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Problem...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Solve Problem
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Solution Display */}
            {solution && (
              <Card className="p-8 mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl text-slate-900">AI Solution</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-slate-700 mb-2">Problem Summary</h3>
                    <p className="text-slate-600 bg-white p-4 rounded-lg">{solution.problem}</p>
                  </div>

                  <div>
                    <h3 className="text-lg text-slate-700 mb-2">Solution Approach</h3>
                    <p className="text-slate-600 bg-white p-4 rounded-lg leading-relaxed">
                      {solution.solution}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg text-slate-700 mb-3">Step-by-Step Guide</h3>
                    <div className="space-y-3">
                      {solution.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex gap-4 items-start bg-white p-4 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                          <p className="text-slate-700 pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl text-slate-900 mb-4">How It Works</h3>
              <ol className="space-y-3 text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 text-blue-600">1.</span>
                  <span>Select your problem type from the dropdown</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 text-blue-600">2.</span>
                  <span>Describe your problem in detail</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 text-blue-600">3.</span>
                  <span>Click "Solve Problem" to get AI-powered solutions</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 text-blue-600">4.</span>
                  <span>Follow the step-by-step guide to implement the solution</span>
                </li>
              </ol>
            </Card>

            {history.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl text-slate-900 mb-4">Recent Solutions</h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSolution(item)}
                      className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
                    >
                      <div className="text-sm text-slate-600 mb-1">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </div>
                      <div className="text-sm text-slate-900 truncate">
                        {item.problem}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <h3 className="text-xl mb-2">Pro Tip</h3>
              <p className="text-blue-50">
                For best results, provide as much context and detail as possible when
                describing your problem. Include any constraints, requirements, or
                specific goals.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}