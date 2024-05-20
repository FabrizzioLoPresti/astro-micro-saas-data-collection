import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type Props = {};

const Project = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 100%", "10% 60%"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.main
      className="w-4/5 md:w-2/5 lg:w-3/5 mx-auto grid lg:grid-cols-4 gap-y-8 lg:gap-12 my-24 items-center [&>div]:bg-neutral-50"
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      ref={ref}
    >
      <div className="p-8 border border-zinc-300 rounded-lg lg:col-start-1 lg:col-end-5 h-full shadow-xl space-y-4">
        <Badge variant="outline">Simplifica ideas</Badge>
        <h1 className="text-3xl font-semibold">
          Transforma tus{" "}
          <span className="font-bold text-blue-800">Ideas en Acción</span>
        </h1>
        <p className="font-light">
          Buscamos reunir la información necesaria para{" "}
          <span className="text-blue-800 font-semibold">
            crear soluciones en base a tus necesidades
          </span>{" "}
          con el objetivo de convertir tus ideas en proyectos tangibles.
          Queremos entender tus necesidades y desafíos para poder{" "}
          <span className="text-blue-800 font-semibold">
            ofrecerte soluciones personalizadas
          </span>{" "}
          que impulsen tu visión hacia adelante.
        </p>

        <p className="font-light">
          ¿Tienes una idea que te apasiona pero no sabes por dónde empezar?
          ¡Permítenos ser tu guía! Responde nuestro{" "}
          <span className="text-blue-800 font-semibold">formulario</span> y
          comienza a explorar las posibilidades para convertir tu visión en
          realidad.
        </p>
      </div>

      <div
        className="p-8 border border-zinc-300 rounded-lg lg:col-start-1 lg:col-end-3 h-full space-y-4 shadow-xl"
        ref={ref}
      >
        <Badge variant="outline">Ideas en Acción</Badge>
        <h2 className="text-2xl font-semibold">Características y Beneficios</h2>
        <ol className="[&>li]:font-light [&>li]:border [&>li]:border-zinc-300 [&>li]:rounded-md [&>li]:p-4 [&>li]:shadow-md space-y-4">
          <li>
            <span className="text-blue-800 font-bold">
              Captura de Ideas Efectiva:
            </span>{" "}
            Haz que expresar tus ideas sea simple y rápido respondiendo
            preguntas clave.
          </li>
          <li>
            <span className="text-blue-800 font-bold">
              Soluciones Personalizadas:
            </span>{" "}
            Obtén soluciones adaptadas a tus necesidades específicas.
          </li>
          <li>
            <span className="text-blue-800 font-bold">
              Asesoramiento a Tu Alcance:
            </span>{" "}
            Recibe consejos personalizados para hacer realidad tu idea
          </li>
        </ol>
      </div>

      <div
        className="p-8 border border-zinc-300 rounded-lg lg:col-start-3 lg:col-end-5 h-full space-y-4  shadow-xl"
        ref={ref}
      >
        <Badge variant="outline">Soluciones AI</Badge>
        <h2 className="text-2xl font-semibold">¿Cómo Funciona?</h2>
        <ol className="[&>li]:font-light [&>li]:border [&>li]:border-zinc-300 [&>li]:rounded-md [&>li]:p-4 [&>li]:shadow-md space-y-4">
          <li>
            <span className="text-blue-800 font-bold">Paso 1:</span> Completa
            nuestro formulario
          </li>
          <li>
            <span className="text-blue-800 font-bold">Paso 2:</span> Análisis de
            Datos
          </li>
          <li>
            <span className="text-blue-800 font-bold">Paso 3:</span> Generación
            de Ideas y Reportes
          </li>
          <li>
            <span className="text-blue-800 font-bold">Paso 4:</span> Acción y
            Resultados
          </li>
        </ol>
      </div>
    </motion.main>
  );
};

export default Project;
