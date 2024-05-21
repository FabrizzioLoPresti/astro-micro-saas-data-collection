import { type QuestionType } from "@/types/types.d";

export const getAllQuestions = async () => {
  const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/data.json`);
  const {questions}: {questions: QuestionType[]} = await res.json();
  return questions;
}