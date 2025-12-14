import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function QuizRunner({ questions, userAnswers, setUserAnswers, onComplete, topic }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const currentQ = questions[currentIdx];
  const progress = ((Object.keys(userAnswers).length) / questions.length) * 100;
  const isLastQuestion = currentIdx === questions.length - 1;

  const handleOptionSelect = (option) => {
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: option }));
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
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
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
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