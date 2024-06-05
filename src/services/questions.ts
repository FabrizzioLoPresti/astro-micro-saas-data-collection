import { type QuestionType } from "@/types/types.d";

export const getAllQuestions = async () => {
  const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/data.json`);
  const {questions}: {questions: QuestionType[]} = await res.json();
  return questions;
}

export const sendAnswers = async (data: {email: string, answers: {question_id: number, option_id?: number, otherAnswer?: string}[]}) => {
  const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/send.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}