import { CompilationResult, ExampleProgram, Lesson, QuizQuestion } from "../types/compiler";

const API_BASE = "http://127.0.0.1:8000/api";

export const compilerApi = {
  async compile(sourceCode: string, stopAfterStage?: string, optimizationsEnabled = true): Promise<CompilationResult> {
    const res = await fetch(`${API_BASE}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: sourceCode,
        stop_after_stage: stopAfterStage || null,
        optimizations_enabled: optimizationsEnabled
      })
    });
    if (!res.ok) {
      throw new Error(`Compile failed with HTTP status ${res.status}`);
    }
    return res.json();
  },

  async getExamples(): Promise<ExampleProgram[]> {
    const res = await fetch(`${API_BASE}/examples`);
    if (!res.ok) throw new Error("Failed to load examples");
    const data = await res.json();
    return data.examples;
  },

  async getLessons(): Promise<Lesson[]> {
    const res = await fetch(`${API_BASE}/learning-lab/lessons`);
    if (!res.ok) throw new Error("Failed to load lessons");
    const data = await res.json();
    return data.lessons;
  },

  async getQuizzes(): Promise<QuizQuestion[]> {
    const res = await fetch(`${API_BASE}/learning-lab/quizzes`);
    if (!res.ok) throw new Error("Failed to load quizzes");
    const data = await res.json();
    return data.quizzes;
  },

  async getTypeMatrix(): Promise<any> {
    const res = await fetch(`${API_BASE}/type-explorer/matrix`);
    if (!res.ok) throw new Error("Failed to load type matrix");
    return res.json();
  },

  async getLanguageSpec(): Promise<any> {
    const res = await fetch(`${API_BASE}/language/spec`);
    if (!res.ok) throw new Error("Failed to load language spec");
    return res.json();
  },

  async simulateParserLab(parserType: string, expression: string): Promise<any> {
    const res = await fetch(`${API_BASE}/parser-lab/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parser_type: parserType,
        expression: expression
      })
    });
    if (!res.ok) throw new Error("Parser simulation failed");
    return res.json();
  }
};
