import { type QuestionType } from "@/types/types.d";

export const questions: QuestionType[] = [
  {
    id: 1,
    question: "¿Cuál es tu siguiente Proyecto?",
    options: ["Aplicación Web", "Aplicación Móvil", "Aplicación de Escritorio", "Otro"],
  },
  {
    id: 2,
    question: "¿Cuál es tu nivel de experiencia en desarrollo de software?",
    options: ["Principiante", "Intermedio", "Avanzado", "Experto"],
  },
  {
    id: 3,
    question: "¿Qué tipo de plataforma prefieres para alojar tu proyecto?",
    options: ["Nube Pública", "Servidores Propios", "Nube Privada", "Ninguna preferencia"],
  },
  {
    id: 4,
    question: "¿Qué tan importante es la escalabilidad para tu proyecto?",
    options: ["Crucial", "Importante", "No es prioritario", "No lo sé"],
  },
  {
    id: 5,
    question: "¿Qué lenguaje de programación prefieres utilizar?",
    options: ["JavaScript", "Python", "Java", "Otro"],
  },
  {
    id: 6,
    question: "¿Qué modelo de monetización prefieres para tu proyecto?",
    options: ["Suscripción", "Publicidad", "Venta de licencias", "Freemium"],
  },
  {
    id: 7,
    question: "¿Cuál es tu presupuesto para el desarrollo inicial del proyecto?",
    options: ["Menos de $1000", "$1000 - $5000", "$5000 - $10000", "Más de $10000"],
  },
  {
    id: 8,
    question: "¿Qué nivel de seguridad necesitas para tu proyecto?",
    options: ["Básico", "Medio", "Alto", "Muy alto"],
  },
  {
    id: 9,
    question: "¿Qué integraciones externas necesitará tu proyecto?",
    options: ["APIs de redes sociales", "Pasarelas de pago", "Servicios de almacenamiento en la nube", "Otras"],
  },
  {
    id: 10,
    question: "¿Qué tan importante es la usabilidad de la interfaz de usuario para tu proyecto?",
    options: ["Muy importante", "Importante", "No es prioritario", "No lo sé"],
  }
];