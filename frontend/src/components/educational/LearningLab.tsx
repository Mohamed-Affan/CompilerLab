import React, { useState, useEffect } from "react";
import { compilerApi } from "../../api/compilerApi";
import { Lesson } from "../../types/compiler";
import { BookOpen, CheckCircle, ChevronRight, Bookmark } from "lucide-react";

export const LearningLab: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");

  useEffect(() => {
    compilerApi.getLessons().then((data) => {
      setLessons(data);
      if (data.length > 0) setSelectedLessonId(data[0].id);
    }).catch(console.error);
  }, []);

  const activeLesson = lessons.find((l) => l.id === selectedLessonId) || lessons[0];

  return (
    <div className="flex h-full bg-[#0b0f19] overflow-hidden select-none">
      {/* Sidebar: Lesson List */}
      <div className="w-80 border-r border-[#1e293b] bg-[#090d16] p-3 flex flex-col space-y-2 overflow-y-auto">
        <div className="flex items-center space-x-2 pb-2 mb-1 border-b border-slate-800 text-slate-400 text-xs font-semibold">
          <Bookmark className="w-4 h-4 text-sky-400" />
          <span>CSA1405 Syllabus Modules</span>
        </div>

        {lessons.map((lesson) => {
          const isSelected = lesson.id === selectedLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                isSelected
                  ? "bg-sky-950/40 border-sky-500/60 text-white shadow-sm font-semibold"
                  : "bg-[#0f172a] border-[#1e293b] text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {lesson.unit}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <h4 className="font-bold text-slate-200 mt-1">{lesson.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{lesson.concept}</p>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {activeLesson ? (
          <div className="space-y-4 max-w-4xl">
            {/* Unit Tag & Title */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">
                  {activeLesson.unit}
                </span>
                <span className="text-xs text-slate-500 font-mono">{activeLesson.concept}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">{activeLesson.title}</h2>
            </div>

            {/* Summary */}
            <div className="bg-[#090d16] border border-[#1e293b] p-4 rounded-xl text-slate-300 text-xs leading-relaxed">
              {activeLesson.summary}
            </div>

            {/* Key Points */}
            <div className="bg-[#090d16] border border-[#1e293b] p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Key Academic Principles
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeLesson.key_points.map((pt, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example Code Snippet */}
            <div className="bg-[#090d16] border border-[#1e293b] p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block font-mono">
                Syllabus Code Example
              </span>
              <pre className="bg-[#0f172a] p-3 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                {activeLesson.example_code}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-xs">Select a lesson to begin.</div>
        )}
      </div>
    </div>
  );
};
