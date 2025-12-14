import {
  Terminal,
  Code,
  Cpu,
  Globe,
  Brain,
  BookOpen,
  Calculator,
  PenTool,
} from "lucide-react";

export const DOMAINS = [
  {
    id: "cs",
    title: "Computer Science",
    icon: <Terminal className="w-8 h-8" />,
    color: "blue",
    description: "Technical skills for software development and engineering.",
    subDomains: [
      { id: "prog", title: "Programming (Python/Java/C++)", icon: <Code /> },
      { id: "cs_fund", title: "CS Fundamentals (OS/DBMS)", icon: <Cpu /> },
      { id: "web", title: "Web Development", icon: <Globe /> },
      { id: "dsa", title: "Data Structures & Algo", icon: <Brain /> },
    ],
  },
  {
    id: "ssc",
    title: "SSC & Govt Exams",
    icon: <BookOpen className="w-8 h-8" />,
    color: "emerald",
    description: "General aptitude and knowledge for competitive exams.",
    subDomains: [
      { id: "gs", title: "General Studies", icon: <Globe /> },
      { id: "apt", title: "Quantitative Aptitude", icon: <Calculator /> },
      { id: "reasoning", title: "Logical Reasoning", icon: <Brain /> },
      { id: "english", title: "English Language", icon: <PenTool /> },
    ],
  },
];
