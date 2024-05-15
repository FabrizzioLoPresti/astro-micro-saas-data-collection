# Astro Features -> TO DO

## Courses

- [Aprende Astro 3 desde cero: Curso para principiantes + aplicacion con Astro [SpaceX Launches]](https://www.youtube.com/watch?v=RB5tR_nqUEw)
  - [Repositorio de SpaceX Launches](https://github.com/FabrizzioLoPresti/astro-curso-midudev)
- [Clon de Spotify DESDE CERO con Astro 3, React JS, Svelte y TailwindCSS](https://www.youtube.com/watch?v=WRc8lz-bp78)
  - [Repositorio de Spotify Clone](https://github.com/midudev/spotify-twitch-clone)

## Aprende Astro 3 desde cero: Curso para principiantes + aplicacion con Astro [SpaceX Launches] -> Astro Features

- Crear endpoints de APIs con src/api
- Utilizar React 19 para la creacion de Islas (Islands) que son componentes interactivos que necesitan de JS
- Utilizar TailwindCSS 4
- Server Side Rendering configurando Astro como solo Server o Hybrid para definir que paginas o secciones sean SSR -> React Server Components (Next.js)
- Hay estilos tanto dentro del scope de la pagina o compoenente, como globales, talwindcss, ademas del uso de directivas
- El comando npm run build genera un directorio dist con los archivos estaticos y el archivo index.html, es decir que si tenemos paginas dinamicas (se generan consultando una API), estas se generan autamaticamente para transformarse en paginas estaticas utilizando el metodo de getStaticPaths, NO se generan si Astro esta configurado como Server Side Rendering, y el metodo getStaticPaths no se ejecuta, en cambio si Astro esta configurado como Hybrid, se generan las paginas estaticas y lo que asignemos como `export const prerender = false` se ejecuta en el servidor de modo que tenemos paginas o componentes dinamicos que se actualizan en tiempo real
- Dentro de un Componente de Astro tenemos la posibilidad de leer props, cookies, headers, query params, redirecciones, etc
- Dentro de `<slot>` se va a insertar el contenido como si fuera un Children de React, nos permite asignarle un nombre para poder insertar contenido en un lugar especifico. Ademas dentro de cada Slot se le puede colocar un texto o valor por defecto de modo que si no se le pasa nada muestra el valor por defecto. Funciona tanto para el `Layout.astro` como para `src/components/HeaderButton.astro`:

```astro
  ---
  interface Props {
    href: string;
  }

  const { href } = Astro.props;
  ---
  <!-- Componente -->
  <a
    href={href}
    class="flex-row justify-center text-white cursor-pointer hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2 hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-110 scale-90 gap-x-2 opacity-70 hover:opacity-100"
  >
    <slot name="before" />
    <slot>Texto por defecto</slot>
    <slot name="after" />
  </a>

  <!-- Uso -->
  <HeaderButton href="/about">
    <svg
      slot="before"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
      <path d="M12 9h.01"></path>
      <path d="M11 12h1v4h1"></path>
    </svg>
    Sobre el Proyecto
  </HeaderButton>
```

- Se pueden creer paginas utilizando Markdown, incluso agregando nuestro Layout creado previamente:

```markdown
---

      title: 'Contenido de la pagina'
      layout: '../src/layouts/Layout.astro'

---

# Contenido de la pagina

Este es el contenido de la pagina

- Lista 1
- Lista 2
- Lista 3
```

- Utilizar el servicio de QuickType para generar un modelo de datos a partir de una respuesta de una API, de modo que se puede utilizar para tipar los datos que se reciben en la consulta utilizando TypeScript. Crear una carpeta **types** dentro de src y dentro crear un archivo **types.d.ts** con el modelo de datos generado por QuickType

```typescript
export interface Launch {
  name: string;
  details: string;
  date_local: string;
  links: Links;
}

export interface Links {
  webcast: string;
}
```

- Podemos realizar un Fetching de Datos dentro de Componentes Astro, se puede realizar tanto la consulta de forma directa como crear una carpeta **libs** o **services** donde podemos crear un archivo encargado de realizar las llamadas a la API

```astro
  ---
  import { Launch } from '../types/types';

  interface Props {
    title: string;
    description: string;
    image: string;
  }

  const { title, description, image } = Astro.props;

  const { data, error } = useSWR<Launch>(
    'https://api.spacexdata.com/v4/launches/next',
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  );

  if (error) return <div>Error al cargar los datos</div>;

  if (!data) return <div>Cargando...</div>;

  const { name, details, date_local, links } = data; // -> si fuera un Array de datos, recorrerlo con un map
  ---

  <article class="flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold">{title}</h1>
    <p class="text-lg">{description}</p>
    <img src={image} alt={title} class="w-96 h-96 rounded-lg shadow-lg my-4" />
    <h2 class="text-2xl font-bold">{name}</h2>
    <p class="text-lg">{details}</p>
    <p class="text-lg">{
      new Date(date_local).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }</p>
    <a href={links.webcast} class="text-blue-500 underline">Ver lanzamiento</a>
  </article>
```

- Astro permite el Renderizado Condicional de Clases CSS medinete la directiva `class:list` la cual adminte un Arreglo en el cual le podemos pasar las clases que necesita y luego las clases condicionales:

```astro
  ---
  interface Props {
    id: string;
    name: string;
    img: string;
    success: boolean;
    flightNumber: number;
    details: string;
  }

  const { id, name, img, success, flightNumber, details } = Astro.props;
  const successText = success ? "Éxito" : "Fracaso";
  ---

  <a
    href={`/launches/${id}`}
    class="rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:scale-105 hover:bg-gray-400 hover:border-gray-500 transition flex flex-col"
  >
    <picture class="flex justify-center p-4">
      <img src={img} alt={`Patch for launch ${id}`} class="mb-5 rounded-lg" />
    </picture>

    <header class="p-4 flex-grow">
      <span
        class:list={[
          "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded",
          {
            "bg-green-400 text-green-900": success,
            "bg-red-400 text-red-900": !success,
          },
        ]}
      >
        {successText}
      </span>
      <h2 class="my-2 text-2xl font-bold tracking-tight text-white">
        Vuelo #{flightNumber}
      </h2>
      <p class="mb-4 font-light text-gray-400">
        {details?.length > 100 ? details.slice(0, 100) + "..." : details}
      </p>
    </header>
  </a>
```

- Podemos crear nuestra propia pagina de Error 404 con `404.astro`
- Podemos crear una pagina de Carga con `loading.astro`
- Podemos crear paginas dinamicas haciendo uso de [id] para obtener el id de la URL y realizar una consulta a la API para obtener los datos de la pagina dinamica

```astro
  ---
  import Layout from "../../layouts/Layout.astro";
  import { getLaunchById, getLaunches } from "../../libs/spacex";

  // export const prerender = false; // server side rendering

  const { id } = Astro.params;
  const launch = await getLaunchById(id ?? "");

  export const getStaticPaths = async () => {
    const launches = await getLaunches();
    return launches.map((launch) => ({ params: { id: launch.id } }));
  };
  ---

  <Layout title={`Lanzamiento ${launch?.id}`}>
    <article class="flex gap-y-4 flex-col">
      <img
        src={launch.links.patch.small ?? launch.rocket.flickr_images[0] ?? ""}
        alt={launch?.name}
        class="w-52 h-auto"
      />
      <h2 class="text-4xl text-white font-bold">
        Lanzamiento #{launch.flight_number}
      </h2>
      <p class="text-lg">{launch.details}</p>
    </article>
  </Layout>
```

- Utilizando getStaticPaths() genera todas las paginas estaticas de la aplicacion por lo que si queremos actualizar los datos de la pagina dinamica, debemos volver a generar las paginas estaticas con el comando `npm run build` para ver los cambios. Si activamos en la configuracion de Astro el modo Hybrid, podemos tener paginas estaticas y dinamicas, de modo que las paginas estaticas se generan automaticamente y las dinamicas se actualizan en tiempo real, para lo cual en las paginas o componentes deseemos que se actualicen en tiempo real debemos asignar `export const prerender = false;` de modo que se ejecute en el servidor

```mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: "hybrid",
  adapter: vercel(),
});
```

- Aplicacion de View Transitions de Astro

```astro
  ---
  import { ViewTransitions } from "astro:transitions";
  import Header from "../components/Header.astro";

  interface Props {
    title: string;
  }

  const { title } = Astro.props;
  ---

  <!doctype html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="description" content="Astro description" />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="generator" content={Astro.generator} />
      <title>{title}</title>
      <ViewTransitions />
    </head>
    <body class="bg-gray-900 min-h-screen pb-32">
      <Header />
      <main class="container px-4 mx-auto">
        <slot />
      </main>
    </body><style is:global>
      html {
        font-family: system-ui, sans-serif;
        background: #13151a;
        background-size: 224px;
        color-scheme: dark light;
      }
    </style>
  </html>
```

- Astro permite la creacion de Componentes Dinamicos utilizando librerias como React, los cuales se conocen como **Islands**, donde ademas podemos persistir el estado de los componentes, de modo que si cambiamos de pagina y volvemos al componente, este mantendra el estado en el que se encontraba. Con directivas podemos definir que el Compoenente (Island) sea visible solo en el cliente, ademas de definir la persistencia del estado del componente

```tsx
import { useState } from "react";

type Props = {};

const Counter = (props: Props) => {
  const [count, setCount] = useState(0);
  return (
    <>
      <span className="text-yellow-300 text-xl mr-4">{count}</span>
      <button
        className="border px-4 py-2 text-xl"
        onClick={() => setCount((count) => count + 1)}
      >
        +
      </button>
      <button
        className="border px-4 py-2 text-xl"
        onClick={() => setCount((count) => count - 1)}
      >
        -
      </button>
    </>
  );
};

export default Counter;
```

```astro
  ---
  import HeaderButton from "./HeaderButton.astro";
  import Counter from "./Counter";
  ---

  <header class="py-8 px-4 mx-auto container lg:py-16 lg:px-6">
    <div class="mx-auto text-center mb-8 lg:mb-16">
      <h1 class="mb-4 text-5xl tracking-tight font-extrabold text-white">
        SpaceX Launches 🚀
      </h1>
      <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">
        All the information about SpaceX Leaunches
      </p>
    </div>

    <nav
      class="flex flex-col items-center justify-between w-full text-center md:flex-row"
    >
      <!-- Demas codigo -->
    </nav>

    <Counter client:visible transition:persist />
  </header>
```
