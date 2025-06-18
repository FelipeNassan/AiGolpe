import jsonData from './questions.json';

export interface QuestionType {
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  correct: string;
  tip: string;
}

export const questions: QuestionType[] = jsonData as QuestionType[];

export function getAllQuestions(): QuestionType[] {
  return questions;
}

export function getRandomQuestion(): QuestionType | null {
  if (!questions || questions.length === 0) {
    console.warn("Nenhuma pergunta encontrada no arquivo JSON ou o arquivo está vazio.");
    return null;
  }
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

export function getRandomQuestions(count: number): QuestionType[] {
  if (!questions || questions.length === 0) {
    return [];
  }
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
}