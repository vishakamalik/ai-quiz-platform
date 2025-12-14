// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Brain, 
//   Code, 
//   BookOpen, 
//   Terminal, 
//   Cpu, 
//   Globe, 
//   Calculator, 
//   PenTool, 
//   Scale,
//   CheckCircle, 
//   XCircle, 
//   RefreshCw, 
//   BarChart2, 
//   ChevronRight,
//   Loader2,
//   AlertCircle,
//   Trophy
// } from 'lucide-react';

// /* -------------------------------------------------------------------------- */
// /* CONFIG & DATA                               */
// /* -------------------------------------------------------------------------- */

// const DOMAINS = [
//   {
//     id: 'cs',
//     title: 'Computer Science',
//     icon: <Terminal className="w-8 h-8" />,
//     color: 'blue',
//     description: 'Technical skills for software development and engineering.',
//     subDomains: [
//       { id: 'prog', title: 'Programming (Python/Java/C++)', icon: <Code /> },
//       { id: 'cs_fund', title: 'CS Fundamentals (OS/DBMS)', icon: <Cpu /> },
//       { id: 'web', title: 'Web Development', icon: <Globe /> },
//       { id: 'dsa', title: 'Data Structures & Algo', icon: <Brain /> }
//     ]
//   },
//   {
//     id: 'ssc',
//     title: 'SSC & Govt Exams',
//     icon: <BookOpen className="w-8 h-8" />,
//     color: 'emerald',
//     description: 'General aptitude and knowledge for competitive exams.',
//     subDomains: [
//       { id: 'gs', title: 'General Studies', icon: <Globe /> },
//       { id: 'apt', title: 'Quantitative Aptitude', icon: <Calculator /> },
//       { id: 'reasoning', title: 'Logical Reasoning', icon: <Brain /> },
//       { id: 'english', title: 'English Language', icon: <PenTool /> }
//     ]
//   }
// ];

// /* -------------------------------------------------------------------------- */
// /* API UTILITIES                                */
// /* -------------------------------------------------------------------------- */

// const API_KEY = "AIzaSyB1mjEL-rWrssN1wxTSDyeaifHS6fwuRNk"; // Injected by environment

// async function generateQuizQuestions(subDomainTitle) {
//   const prompt = `
//     Generate a strictly valid JSON array of 20 multiple-choice questions (MCQs) for the topic: "${subDomainTitle}".
    
//     The difficulty should be mixed (Easy, Medium, Hard).
    
//     The Output MUST be a raw JSON array. Do not include markdown formatting like \`\`\`json.
    
//     Each object in the array must have this exact structure:
//     {
//       "id": 1,
//       "question": "The question text here?",
//       "options": ["Option A", "Option B", "Option C", "Option D"],
//       "correctAnswer": "The exact string content of the correct option",
//       "explanation": "A short 1-sentence explanation of why it is correct."
//     }
//   `;

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }]
//         })
//       }
//     );

//     if (!response.ok) throw new Error('API request failed');

//     const data = await response.json();
//     const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
//     // Clean string to ensure it's valid JSON (remove markdown if model adds it)
//     const jsonStr = text.replace(/```json|```/g, '').trim();
//     return JSON.parse(jsonStr);

//   } catch (error) {
//     console.error("Gemini Generation Error:", error);
//     throw error;
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* CUSTOM COMPONENTS                               */
// /* -------------------------------------------------------------------------- */

// // Simple SVG Pie Chart for Dashboard
// const PerformanceChart = ({ correct, total }) => {
//   const percentage = Math.round((correct / total) * 100);
//   const radius = 40;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
//   let color = 'text-red-500';
//   if (percentage >= 70) color = 'text-green-500';
//   else if (percentage >= 40) color = 'text-yellow-500';

//   return (
//     <div className="relative w-40 h-40 flex items-center justify-center">
//       <svg className="transform -rotate-90 w-full h-full">
//         <circle
//           cx="80" cy="80" r={radius}
//           stroke="currentColor" strokeWidth="10" fill="transparent"
//           className="text-slate-200"
//         />
//         <circle
//           cx="80" cy="80" r={radius}
//           stroke="currentColor" strokeWidth="10" fill="transparent"
//           strokeDasharray={circumference}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           className={`${color} transition-all duration-1000 ease-out`}
//         />
//       </svg>
//       <div className="absolute flex flex-col items-center">
//         <span className={`text-3xl font-bold ${color}`}>{percentage}%</span>
//         <span className="text-xs text-slate-500 font-medium">Accuracy</span>
//       </div>
//     </div>
//   );
// };

// /* -------------------------------------------------------------------------- */
// /* MAIN APPLICATION                              */
// /* -------------------------------------------------------------------------- */

// export default function App() {
//   // State Machine: 'SELECTION' | 'LOADING' | 'QUIZ' | 'RESULTS' | 'ERROR'
//   const [appState, setAppState] = useState('SELECTION');
  
//   // Data State
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [selectedSubDomain, setSelectedSubDomain] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOptionString }
//   const [errorMsg, setErrorMsg] = useState('');

//   // Handlers
//   const handleStartQuiz = async (subDomain) => {
//     setSelectedSubDomain(subDomain);
//     setAppState('LOADING');
//     setErrorMsg('');
    
//     try {
//       const generatedQuestions = await generateQuizQuestions(subDomain.title);
//       // Ensure we limit to 20 just in case model hallucinates more/less
//       setQuestions(generatedQuestions.slice(0, 20));
//       setAppState('QUIZ');
//     } catch (err) {
//       setErrorMsg("Failed to generate quiz. Please check your connection or try again.");
//       setAppState('ERROR');
//     }
//   };

//   const handleSubmitQuiz = () => {
//     setAppState('RESULTS');
//   };

//   const handleRestart = () => {
//     setQuestions([]);
//     setUserAnswers({});
//     setSelectedDomain(null);
//     setSelectedSubDomain(null);
//     setAppState('SELECTION');
//   };

//   // Render Logic
//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      
//       {/* Header */}
//       <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
//         <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2 text-indigo-600">
//             <Brain className="w-8 h-8" />
//             <span className="text-xl font-bold tracking-tight">Quiz<span className="text-slate-400">.ai</span></span>
//           </div>
//           {appState !== 'SELECTION' && (
//              <button onClick={handleRestart} className="text-sm font-medium text-slate-500 hover:text-indigo-600">
//                Exit Quiz
//              </button>
//           )}
//         </div>
//       </nav>

//       <main className="max-w-4xl mx-auto px-4 py-8">
        
//         {/* VIEW: SELECTION */}
//         {appState === 'SELECTION' && (
//           <div className="animate-fade-in space-y-8">
//             <div className="text-center space-y-4 mb-12">
//               <h1 className="text-4xl font-extrabold text-slate-900">
//                 Master any domain with AI
//               </h1>
//               <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//                 Select your field of interest. It will generate a unique, 20-question challenge tailored just for you.
//               </p>
//             </div>

//             {/* Step 1: Domain Selection */}
//             {!selectedDomain ? (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {DOMAINS.map((domain) => (
//                   <button
//                     key={domain.id}
//                     onClick={() => setSelectedDomain(domain)}
//                     className={`group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-${domain.color}-500 transition-all duration-300 text-left`}
//                   >
//                     <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${domain.color}-600`}>
//                       {domain.icon}
//                     </div>
//                     <div className={`inline-flex p-3 rounded-lg bg-${domain.color}-50 text-${domain.color}-600 mb-4`}>
//                       {domain.icon}
//                     </div>
//                     <h3 className="text-2xl font-bold mb-2">{domain.title}</h3>
//                     <p className="text-slate-500">{domain.description}</p>
//                     <div className="mt-6 flex items-center font-semibold text-sm text-slate-900 group-hover:translate-x-1 transition-transform">
//                       Select Domain <ChevronRight className="w-4 h-4 ml-1" />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               // Step 2: Sub-domain Selection
//               <div className="animate-slide-up">
//                 <button 
//                   onClick={() => setSelectedDomain(null)}
//                   className="mb-6 flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
//                 >
//                   &larr; Back to Domains
//                 </button>
                
//                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//                   <span className="text-indigo-600">{selectedDomain.title}</span> 
//                   <span className="text-slate-300">/</span> 
//                   Choose Topic
//                 </h2>

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {selectedDomain.subDomains.map((sub) => (
//                     <button
//                       key={sub.id}
//                       onClick={() => handleStartQuiz(sub)}
//                       className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
//                     >
//                       <div className="p-3 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
//                         {sub.icon}
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-slate-900">{sub.title}</h4>
//                         <p className="text-xs text-slate-500 mt-1">Generate 20 Questions</p>
//                       </div>
//                       <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* VIEW: LOADING */}
//         {appState === 'LOADING' && (
//           <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Brain className="w-6 h-6 text-indigo-600 animate-pulse" />
//               </div>
//             </div>
//             <h3 className="mt-6 text-xl font-bold text-slate-800">Constructing your Exam</h3>
//             <p className="text-slate-500 mt-2 max-w-sm">
//               Generating 20 unique MCQs for <span className="font-semibold text-indigo-600">{selectedSubDomain?.title}</span>...
//             </p>
//           </div>
//         )}

//         {/* VIEW: ERROR */}
//         {appState === 'ERROR' && (
//           <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
//             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-bold text-red-700">Generation Failed</h3>
//             <p className="text-red-600 mb-6">{errorMsg}</p>
//             <button 
//               onClick={() => setAppState('SELECTION')}
//               className="px-6 py-2 bg-white border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-50"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* VIEW: QUIZ INTERFACE */}
//         {appState === 'QUIZ' && (
//           <QuizRunner 
//             questions={questions} 
//             userAnswers={userAnswers}
//             setUserAnswers={setUserAnswers}
//             onComplete={handleSubmitQuiz}
//             topic={selectedSubDomain?.title}
//           />
//         )}

//         {/* VIEW: RESULTS DASHBOARD */}
//         {appState === 'RESULTS' && (
//           <ResultDashboard 
//             questions={questions}
//             userAnswers={userAnswers}
//             topic={selectedSubDomain?.title}
//             onRestart={handleRestart}
//           />
//         )}

//       </main>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* SUB COMPONENTS                                */
// /* -------------------------------------------------------------------------- */

// // Handles the active test taking process
// function QuizRunner({ questions, userAnswers, setUserAnswers, onComplete, topic }) {
//   const [currentIdx, setCurrentIdx] = useState(0);
  
//   const currentQ = questions[currentIdx];
//   const progress = ((Object.keys(userAnswers).length) / questions.length) * 100;
//   const isLastQuestion = currentIdx === questions.length - 1;

//   const handleOptionSelect = (option) => {
//     setUserAnswers(prev => ({
//       ...prev,
//       [currentQ.id]: option
//     }));
//   };

//   return (
//     <div className="animate-fade-in max-w-3xl mx-auto">
//       {/* Header Info */}
//       <div className="mb-6 flex items-end justify-between">
//         <div>
//           <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-1">{topic} TEST</h2>
//           <p className="text-slate-500 text-sm">Question {currentIdx + 1} of {questions.length}</p>
//         </div>
//         <div className="text-right">
//           <span className="text-xs font-semibold text-slate-400">Progress</span>
//           <div className="w-32 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
//             <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
//           </div>
//         </div>
//       </div>

//       {/* Question Card */}
//       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//         <div className="p-8 border-b border-slate-100">
//           <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
//             {currentQ.question}
//           </h3>
//         </div>
        
//         <div className="p-8 space-y-3 bg-slate-50/50">
//           {currentQ.options.map((option, idx) => {
//             const isSelected = userAnswers[currentQ.id] === option;
//             return (
//               <button
//                 key={idx}
//                 onClick={() => handleOptionSelect(option)}
//                 className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ${
//                   isSelected 
//                     ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
//                     : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
//                 }`}
//               >
//                 <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${
//                   isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'
//                 }`}>
//                   {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
//                 </div>
//                 <span className={`text-lg ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>
//                   {option}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
        
//         {/* Navigation */}
//         <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center">
//           <button 
//             disabled={currentIdx === 0}
//             onClick={() => setCurrentIdx(prev => prev - 1)}
//             className="px-4 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-30 font-medium"
//           >
//             Previous
//           </button>
          
//           {isLastQuestion ? (
//             <button 
//               onClick={onComplete}
//               className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
//             >
//               Submit Test
//             </button>
//           ) : (
//              <button 
//               onClick={() => setCurrentIdx(prev => prev + 1)}
//               className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors flex items-center"
//             >
//               Next <ChevronRight className="w-4 h-4 ml-1" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Handles the analytics and review
// function ResultDashboard({ questions, userAnswers, topic, onRestart }) {
//   // Calculate Stats
//   const stats = useMemo(() => {
//     let correct = 0;
//     let skipped = 0;
//     questions.forEach(q => {
//       const userAns = userAnswers[q.id];
//       if (!userAns) skipped++;
//       else if (userAns === q.correctAnswer) correct++;
//     });
//     return { correct, skipped, total: questions.length, incorrect: questions.length - correct - skipped };
//   }, [questions, userAnswers]);

//   return (
//     <div className="animate-fade-in space-y-8 pb-12">
      
//       {/* Top Summary Section */}
//       <div className="grid md:grid-cols-3 gap-6">
//         {/* Score Card */}
//         <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8">
//           <div className="shrink-0">
//              <PerformanceChart correct={stats.correct} total={stats.total} />
//           </div>
//           <div className="flex-1 text-center md:text-left space-y-2">
//             <h2 className="text-2xl font-bold text-slate-900">Quiz Analysis</h2>
//             <p className="text-slate-500">
//               You completed the <strong className="text-slate-700">{topic}</strong> assessment. 
//               {stats.correct > 15 ? " Outstanding performance!" : " Keep practicing to improve your score."}
//             </p>
//             <div className="flex gap-4 justify-center md:justify-start mt-4">
//               <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100">
//                 <span className="block text-xl font-bold text-green-700">{stats.correct}</span>
//                 <span className="text-xs font-semibold text-green-600 uppercase">Correct</span>
//               </div>
//               <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-100">
//                 <span className="block text-xl font-bold text-red-700">{stats.incorrect}</span>
//                 <span className="text-xs font-semibold text-red-600 uppercase">Wrong</span>
//               </div>
//               <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
//                 <span className="block text-xl font-bold text-slate-700">{stats.skipped}</span>
//                 <span className="text-xs font-semibold text-slate-500 uppercase">Skipped</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Card */}
//         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-center items-center text-center">
//            <Trophy className="w-12 h-12 mb-4 text-yellow-300" />
//            <h3 className="text-xl font-bold mb-2">Keep Learning</h3>
//            <p className="text-indigo-100 text-sm mb-6">Take another test to improve your percentile.</p>
//            <button 
//             onClick={onRestart}
//             className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
//            >
//              <RefreshCw className="w-4 h-4" /> Start New Test
//            </button>
//         </div>
//       </div>

//       {/* Detailed Review Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         <div className="p-6 border-b border-slate-100 bg-slate-50">
//           <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
//             <BarChart2 className="w-5 h-5 text-indigo-500" /> Detailed Insight
//           </h3>
//         </div>
        
//         <div className="divide-y divide-slate-100">
//           {questions.map((q, idx) => {
//             const userAns = userAnswers[q.id];
//             const isCorrect = userAns === q.correctAnswer;
//             const isSkipped = !userAns;

//             return (
//               <div key={q.id} className="p-6 hover:bg-slate-50 transition-colors">
//                 <div className="flex gap-4">
//                   <div className="shrink-0 mt-1">
//                     {isCorrect ? (
//                       <CheckCircle className="w-6 h-6 text-green-500" />
//                     ) : isSkipped ? (
//                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-400">?</div>
//                     ) : (
//                       <XCircle className="w-6 h-6 text-red-500" />
//                     )}
//                   </div>
//                   <div className="space-y-3 flex-1">
//                     <div className="flex justify-between items-start gap-4">
//                       <h4 className="font-medium text-slate-900">
//                         <span className="text-slate-400 mr-2">#{idx + 1}</span>
//                         {q.question}
//                       </h4>
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-4 text-sm">
//                       <div className={`p-3 rounded-lg border ${
//                         isCorrect 
//                           ? 'bg-green-50 border-green-200 text-green-800'
//                           : 'bg-red-50 border-red-200 text-red-800'
//                       }`}>
//                         <span className="font-semibold block text-xs uppercase opacity-70 mb-1">Your Answer</span>
//                         {userAns || "Skipped"}
//                       </div>
//                       <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
//                         <span className="font-semibold block text-xs uppercase opacity-70 mb-1 text-slate-500">Correct Answer</span>
//                         {q.correctAnswer}
//                       </div>
//                     </div>

//                     <div className="mt-2 text-sm text-slate-600 bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
//                       <span className="font-bold text-indigo-600 mr-1">Explanation:</span>
//                       {q.explanation}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, 
  Code, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Globe, 
  Calculator, 
  PenTool, 
  Scale, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  BarChart2, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Trophy,
  Printer
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* DATA CONFIGURATION                                                         */
/* -------------------------------------------------------------------------- */

const DOMAINS = [
  {
    id: 'cs',
    title: 'Computer Science',
    icon: <Terminal className="w-8 h-8" />,
    color: 'blue',
    description: 'Technical skills for software development and engineering.',
    subDomains: [
      { id: 'prog', title: 'Programming (Python/Java/C++)', icon: <Code /> },
      { id: 'cs_fund', title: 'CS Fundamentals (OS/DBMS)', icon: <Cpu /> },
      { id: 'web', title: 'Web Development', icon: <Globe /> },
      { id: 'dsa', title: 'Data Structures & Algo', icon: <Brain /> }
    ]
  },
  {
    id: 'ssc',
    title: 'SSC & Govt Exams',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'emerald',
    description: 'General aptitude and knowledge for competitive exams.',
    subDomains: [
      { id: 'gs', title: 'General Studies', icon: <Globe /> },
      { id: 'apt', title: 'Quantitative Aptitude', icon: <Calculator /> },
      { id: 'reasoning', title: 'Logical Reasoning', icon: <Brain /> },
      { id: 'english', title: 'English Language', icon: <PenTool /> }
    ]
  }
];

/* -------------------------------------------------------------------------- */
/* API LOGIC                                                                  */
/* -------------------------------------------------------------------------- */

const API_KEY = "AIzaSyB1mjEL-rWrssN1wxTSDyeaifHS6fwuRNk"; // Provided by environment

async function generateQuizQuestions(subDomainTitle) {
  const prompt = `
    Generate a strictly valid JSON array of 20 multiple-choice questions (MCQs) for the topic: "${subDomainTitle}".
    
    The difficulty should be mixed (Easy, Medium, Hard).
    
    The Output MUST be a raw JSON array. Do not include markdown formatting like \`\`\`json.
    
    Each object in the array must have this exact structure:
    {
      "id": 1,
      "question": "The question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact string content of the correct option",
      "explanation": "A short 1-sentence explanation of why it is correct."
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

const PerformanceChart = ({ correct, total }) => {
  const percentage = Math.round((correct / total) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  let color = 'text-red-500';
  if (percentage >= 70) color = 'text-green-500';
  else if (percentage >= 40) color = 'text-yellow-500';

  return (
    <div className="relative w-40 h-40 flex items-center justify-center print:hidden">
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200" />
        <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`${color} transition-all duration-1000 ease-out`} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${color}`}>{percentage}%</span>
        <span className="text-xs text-slate-500 font-medium">Accuracy</span>
      </div>
    </div>
  );
};

/* Quiz Runner Component */
function QuizRunner({ questions, userAnswers, setUserAnswers, onComplete, topic }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const currentQ = questions[currentIdx];
  const progress = ((Object.keys(userAnswers).length) / questions.length) * 100;
  const isLastQuestion = currentIdx === questions.length - 1;

  const handleOptionSelect = (option) => {
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: option }));
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto print:hidden">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-1">{topic} TEST</h2>
          <p className="text-slate-500 text-sm">Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400">Progress</span>
          <div className="w-32 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">{currentQ.question}</h3>
        </div>
        
        <div className="p-8 space-y-3 bg-slate-50/50">
          {currentQ.options.map((option, idx) => {
            const isSelected = userAnswers[currentQ.id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ${
                  isSelected ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={`text-lg ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>{option}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center">
          <button 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-30 font-medium"
          >
            Previous
          </button>
          
          {isLastQuestion ? (
            <button 
              onClick={onComplete}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
            >
              Submit Test
            </button>
          ) : (
             <button 
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Result Dashboard with Print Functionality */
function ResultDashboard({ questions, userAnswers, topic, onRestart }) {
  const stats = useMemo(() => {
    let correct = 0;
    let skipped = 0;
    questions.forEach(q => {
      const userAns = userAnswers[q.id];
      if (!userAns) skipped++;
      else if (userAns === q.correctAnswer) correct++;
    });
    return { correct, skipped, total: questions.length, incorrect: questions.length - correct - skipped };
  }, [questions, userAnswers]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      
      {/* Top Summary Section (Hidden in Print) */}
      <div className="grid md:grid-cols-3 gap-6 print:hidden">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0"><PerformanceChart correct={stats.correct} total={stats.total} /></div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Quiz Analysis</h2>
            <p className="text-slate-500">You completed the <strong className="text-slate-700">{topic}</strong> assessment.</p>
            <div className="flex gap-4 justify-center md:justify-start mt-4">
              <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100 text-green-700 font-bold">{stats.correct} Correct</div>
              <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-100 text-red-700 font-bold">{stats.incorrect} Wrong</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-center items-center text-center">
           <Trophy className="w-12 h-12 mb-4 text-yellow-300" />
           <button onClick={onRestart} className="w-full py-2 mb-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
             <RefreshCw className="w-4 h-4" /> New Test
           </button>
           <button onClick={handlePrint} className="w-full py-2 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2">
             <Printer className="w-4 h-4" /> Save Report (PDF)
           </button>
        </div>
      </div>

      {/* Print Header (Visible only in Print) */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-300 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">GeminiQuiz.ai Report</h1>
        <div className="flex justify-between mt-2 text-slate-600">
            <span>Domain: {topic}</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
        <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-200">
            <p className="font-bold">Score: {stats.correct} / {stats.total} ({Math.round((stats.correct/stats.total)*100)}%)</p>
        </div>
      </div>

      {/* Detailed Review Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50 print:bg-white print:px-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" /> Detailed Insight
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100 print:divide-slate-300">
          {questions.map((q, idx) => {
            const userAns = userAnswers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const isSkipped = !userAns;

            return (
              <div key={q.id} className="p-6 hover:bg-slate-50 transition-colors print:px-0 print:hover:bg-white print:break-inside-avoid">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1 print:hidden">
                    {isCorrect ? <CheckCircle className="w-6 h-6 text-green-500" /> : isSkipped ? <div className="w-6 h-6 font-bold text-slate-400">?</div> : <XCircle className="w-6 h-6 text-red-500" />}
                  </div>
                  <div className="space-y-3 flex-1">
                    <h4 className="font-medium text-slate-900">
                      <span className="text-slate-400 mr-2">#{idx + 1}</span>
                      {q.question}
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4 text-sm print:grid-cols-1 print:gap-2">
                      <div className={`p-3 rounded-lg border print:border-0 print:p-0 ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <span className="font-semibold block text-xs uppercase opacity-70 mb-1 print:inline print:mr-2">Your Answer:</span>
                        <span className="print:font-bold">{userAns || "Skipped"}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 print:bg-white print:border-0 print:p-0">
                        <span className="font-semibold block text-xs uppercase opacity-70 mb-1 text-slate-500 print:inline print:mr-2">Correct Answer:</span>
                        <span className="print:font-bold">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-600 bg-indigo-50/50 p-3 rounded-lg border border-indigo-50 print:bg-white print:border-l-4 print:border-indigo-200 print:italic">
                      <span className="font-bold text-indigo-600 mr-1">Explanation:</span>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN APP                                                                   */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [appState, setAppState] = useState('SELECTION');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedSubDomain, setSelectedSubDomain] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleStartQuiz = async (subDomain) => {
    setSelectedSubDomain(subDomain);
    setAppState('LOADING');
    setErrorMsg('');
    
    try {
      const generatedQuestions = await generateQuizQuestions(subDomain.title);
      setQuestions(generatedQuestions.slice(0, 20));
      setAppState('QUIZ');
    } catch (err) {
      setErrorMsg("Failed to generate quiz. Please check your connection or try again.");
      setAppState('ERROR');
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setUserAnswers({});
    setSelectedDomain(null);
    setSelectedSubDomain(null);
    setAppState('SELECTION');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* Header (Hidden when Printing) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Brain className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Quiz<span className="text-slate-400">.ai</span></span>
          </div>
          {appState !== 'SELECTION' && (
             <button onClick={handleRestart} className="text-sm font-medium text-slate-500 hover:text-indigo-600">
               Exit Quiz
             </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* VIEW: SELECTION */}
        {appState === 'SELECTION' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-extrabold text-slate-900">
                Master any domain with AI
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Select your field of interest. It will generate a unique, 20-question challenge tailored just for you.
              </p>
            </div>

            {/* Domain Selection */}
            {!selectedDomain ? (
              <div className="grid md:grid-cols-2 gap-6">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain)}
                    className={`group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-${domain.color}-500 transition-all duration-300 text-left`}
                  >
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${domain.color}-600`}>
                      {domain.icon}
                    </div>
                    <div className={`inline-flex p-3 rounded-lg bg-${domain.color}-50 text-${domain.color}-600 mb-4`}>
                      {domain.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{domain.title}</h3>
                    <p className="text-slate-500">{domain.description}</p>
                    <div className="mt-6 flex items-center font-semibold text-sm text-slate-900 group-hover:translate-x-1 transition-transform">
                      Select Domain <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Sub-domain Selection
              <div className="animate-slide-up">
                <button 
                  onClick={() => setSelectedDomain(null)}
                  className="mb-6 flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  &larr; Back to Domains
                </button>
                
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-indigo-600">{selectedDomain.title}</span> 
                  <span className="text-slate-300">/</span> 
                  Choose Topic
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedDomain.subDomains.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleStartQuiz(sub)}
                      className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
                    >
                      <div className="p-3 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {sub.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{sub.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Generate 20 Questions</p>
                      </div>
                      <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: LOADING */}
        {appState === 'LOADING' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-800">Constructing your Exam</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
              Gemini is generating 20 unique MCQs for <span className="font-semibold text-indigo-600">{selectedSubDomain?.title}</span>...
            </p>
          </div>
        )}

        {/* VIEW: ERROR */}
        {appState === 'ERROR' && (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-700">Generation Failed</h3>
            <p className="text-red-600 mb-6">{errorMsg}</p>
            <button 
              onClick={() => setAppState('SELECTION')}
              className="px-6 py-2 bg-white border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-50"
            >
              Try Again
            </button>
          </div>
        )}

        {/* VIEW: QUIZ INTERFACE */}
        {appState === 'QUIZ' && (
          <QuizRunner 
            questions={questions} 
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            onComplete={() => setAppState('RESULTS')}
            topic={selectedSubDomain?.title}
          />
        )}

        {/* VIEW: RESULTS DASHBOARD */}
        {appState === 'RESULTS' && (
          <ResultDashboard 
            questions={questions}
            userAnswers={userAnswers}
            topic={selectedSubDomain?.title}
            onRestart={handleRestart}
          />
        )}

      </main>
    </div>
  );
}





// import React, { useState } from 'react';
// import { Brain, ChevronRight, AlertCircle } from 'lucide-react';

// // Import our new separated files
// import { DOMAINS } from '../data.js';
// import { generateQuizQuestions } from '../api.js';
// import QuizRunner from './components/QuizRunner.jsx';
// import ResultDashboard from './components/ResultDashboard.jsx';

// export default function App() {
//   const [appState, setAppState] = useState('SELECTION'); // 'SELECTION' | 'LOADING' | 'QUIZ' | 'RESULTS' | 'ERROR'
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [selectedSubDomain, setSelectedSubDomain] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [errorMsg, setErrorMsg] = useState('');

//   const handleStartQuiz = async (subDomain) => {
//     setSelectedSubDomain(subDomain);
//     setAppState('LOADING');
//     setErrorMsg('');
//     try {
//       const generatedQuestions = await generateQuizQuestions(subDomain.title);
//       setQuestions(generatedQuestions.slice(0, 20));
//       setAppState('QUIZ');
//     } catch (err) {
//       setErrorMsg("Failed to generate quiz. Check connection.");
//       setAppState('ERROR');
//     }
//   };

//   const handleRestart = () => {
//     setQuestions([]);
//     setUserAnswers({});
//     setSelectedDomain(null);
//     setSelectedSubDomain(null);
//     setAppState('SELECTION');
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
//       <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
//         <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2 text-indigo-600">
//             <Brain className="w-8 h-8" />
//             <span className="text-xl font-bold tracking-tight">GeminiQuiz.ai</span>
//           </div>
//           {appState !== 'SELECTION' && (
//              <button onClick={handleRestart} className="text-sm font-medium text-slate-500 hover:text-indigo-600">Exit Quiz</button>
//           )}
//         </div>
//       </nav>

//       <main className="max-w-4xl mx-auto px-4 py-8">
        
//         {/* VIEW: SELECTION */}
//         {appState === 'SELECTION' && (
//           <div className="animate-fade-in space-y-8">
//             <div className="text-center space-y-4 mb-12">
//               <h1 className="text-4xl font-extrabold text-slate-900">Master any domain with AI</h1>
//               <p className="text-lg text-slate-600 max-w-2xl mx-auto">Select your field. Gemini will generate a unique challenge.</p>
//             </div>

//             {!selectedDomain ? (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {DOMAINS.map((domain) => (
//                   <button key={domain.id} onClick={() => setSelectedDomain(domain)} className={`group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-${domain.color}-500 transition-all text-left`}>
//                     <div className={`inline-flex p-3 rounded-lg bg-${domain.color}-50 text-${domain.color}-600 mb-4`}>{domain.icon}</div>
//                     <h3 className="text-2xl font-bold mb-2">{domain.title}</h3>
//                     <p className="text-slate-500">{domain.description}</p>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <div className="animate-slide-up">
//                 <button onClick={() => setSelectedDomain(null)} className="mb-6 text-sm text-slate-500 hover:text-indigo-600">&larr; Back to Domains</button>
//                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><span className="text-indigo-600">{selectedDomain.title}</span> <span className="text-slate-300">/</span> Choose Topic</h2>
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {selectedDomain.subDomains.map((sub) => (
//                     <button key={sub.id} onClick={() => handleStartQuiz(sub)} className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left group">
//                       <div className="p-3 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{sub.icon}</div>
//                       <div><h4 className="font-semibold text-slate-900">{sub.title}</h4></div>
//                       <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* VIEW: LOADING */}
//         {appState === 'LOADING' && (
//           <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
//             <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
//             <h3 className="mt-6 text-xl font-bold text-slate-800">Constructing your Exam</h3>
//             <p className="text-slate-500 mt-2">Gemini is writing unique questions...</p>
//           </div>
//         )}

//         {/* VIEW: ERROR */}
//         {appState === 'ERROR' && (
//           <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
//             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-bold text-red-700">Generation Failed</h3>
//             <button onClick={() => setAppState('SELECTION')} className="mt-4 px-6 py-2 bg-white border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-50">Try Again</button>
//           </div>
//         )}

//         {/* VIEW: QUIZ */}
//         {appState === 'QUIZ' && (
//           <QuizRunner questions={questions} userAnswers={userAnswers} setUserAnswers={setUserAnswers} onComplete={() => setAppState('RESULTS')} topic={selectedSubDomain?.title} />
//         )}

//         {/* VIEW: RESULTS */}
//         {appState === 'RESULTS' && (
//           <ResultDashboard questions={questions} userAnswers={userAnswers} topic={selectedSubDomain?.title} onRestart={handleRestart} />
//         )}

//       </main>
//     </div>
//   );
// }