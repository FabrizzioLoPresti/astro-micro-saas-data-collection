import { create } from "zustand";
import { type QuestionType } from "@/types/types.d";
import { questions as questionData } from "@/lib/data";
import { persist } from "zustand/middleware";
import { getAllQuestions } from "@/services/questions";

type Store = {
  questions: QuestionType[];
  currentQuestion: number;
  fetchQuestions: () => Promise<void>;
  setQuestions: (questions: QuestionType[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  selectAnswer: (questionId: number, indexAnswer: number, otherAnswer?: string) => void;
}

export const useQuestionsStore = create<Store>()(persist((set, get) => ({
  questions: [],
  currentQuestion: 0,

  fetchQuestions: async () => {
    // Fetch de preguntas
    if(get().questions.length === 0) {
      const questions = await getAllQuestions();
      set({ questions });
    }
  },

  setQuestions: (questions) => {
    set({ questions });
  },
  nextQuestion: () => {
    // Logica para ir a la siguiente pregunta
    if (get().currentQuestion <= get().questions.length - 1) {
      set({
        currentQuestion: get().currentQuestion + 1
      })
    }
  },
  prevQuestion: () => {
    // Logica para ir a la pregunta anterior
    if (get().currentQuestion > 0) {
      set({
        currentQuestion: get().currentQuestion - 1
      })
    }
  },
  selectAnswer: (questionId, indexAnswer, otherAnswer) => {
    // Logica para seleccionar una respuesta -> StructuredClone para clonar objetos de forma profunda

    // Usar el StructuredClone para clonar el array de preguntas
    const newQuestions = structuredClone(get().questions);

    // Encontramos el indice de la pregunta que queremos modificar
    const questionIndex = newQuestions.findIndex((question) => question.id === questionId);

    // Obtenemos la informacion del pregunta que queremos modificar
    const questionInfo = newQuestions[questionIndex];

    // Verificar si la respuesta seleccionada es "Otro"
    if (questionInfo.options[indexAnswer] === "Otro") {
      // Cambiar informacion en la copia de la pregunta
      newQuestions[questionIndex] = {
        ...questionInfo,
        answerSelected: indexAnswer,
        otherAnswer: otherAnswer?.trim().replace(/\s+/g, ' ') || ""
      };
    } else {
      // Cambiar informacion en la copia de la pregunta
      newQuestions[questionIndex] = {
        ...questionInfo,
        answerSelected: indexAnswer,
        otherAnswer: ""
      };
    }

    // Actualizar el estado con las preguntas modificadas -> 1:02:04
    set({ questions: newQuestions });
  }
}), {
  name: "questions-store"
}));