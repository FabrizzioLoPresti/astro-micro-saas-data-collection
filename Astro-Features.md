# Astro Features -> TO DO

## Courses

- [Aprende Astro 3 desde cero: Curso para principiantes + aplicacion con Astro [SpaceX Launches]](https://www.youtube.com/watch?v=RB5tR_nqUEw)
  - [Repositorio de SpaceX Launches](https://github.com/FabrizzioLoPresti/astro-curso-midudev)
- [Clon de Spotify DESDE CERO con Astro 3, React JS, Svelte y TailwindCSS](https://www.youtube.com/watch?v=WRc8lz-bp78)
  - [Repositorio de Spotify Clone](https://github.com/midudev/spotify-twitch-clone)
- [Chat para Hablar con PDF's usando Astro, Svelte, TailwindCSS y Cloudinary](https://www.youtube.com/watch?v=GEfPFLbCXPc)
  - [Repositiorio de Chat con PDF's](https://github.com/midudev/chat-with-pdf)
- [Desarrollo y Deploy de la Pre-landing web de LA VELADA del año IV](https://www.youtube.com/watch?v=BVnhDlbhPvs&list=PLUofhDIg_38rXS6QJDOQky5sYU-hQKwRv)
  - [Repositiorio de Web de La Velada](https://github.com/midudev/la-velada-web-oficial)

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

## Clon de Spotify DESDE CERO con Astro 3, React JS, Svelte y TailwindCSS -> Astro Features

- Dentro del `Layout.astro` podemos definir el Layout de Spotify mediante **Grid Areas**, haciendo uso de la etiqueta `<style>` para definir los estilos del Layout dentro del Scope del archivo y la directiva `is:global` para que esos estilos afecten a todo el proyecto. Luego asignamos el nombre de cada area a cada elemento mediante directivas de TailwindCSS:

```css
  <style>
    #app {
      display: grid;
      grid-template-areas:
        "aside main main"
        "player player player";
      grid-template-columns: 350px 1fr;
      grid-template-rows: 1fr auto;
    }
  </style>

  <style is:global>
    html {
      font-family: "CircularStd", system-ui, sans-serif;
      background: #010101;
      color: white;
    }

    @font-face {
      font-family: "CircularStd";
      src: url("/fonts/CircularStd-Medium.woff2") format("woff2");
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
  </style>
```

```astro
  <div id="app" class="relative h-screen p-2 gap-2">
    <aside class="[grid-area:aside] flex-col flex overflow-y-auto">
      <AsideMenu />
    </aside>

    <main
      class="[grid-area:main] rounded-lg bg-zinc-900 overflow-y-auto w-full"
    >
      <slot />
    </main>

    <footer class="[grid-area:player] h-[80px]">
      <Player client:load transition:name="media-player" transition:persist />
    </footer>
  </div>
```

- Crear un Componente de Astro para cada enlace del AsideMenu y evitar asi la repeticion de codigo:

```astro
  ---
  interface Props {
    href?: string
  }

  const { href } = Astro.props
  ---

  <li>
    <a
      class="flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition duration-300"
      href={href}
    >
      <slot />
    </a>
  </li>
```

- Modificar el archivo de `tsconfig.json` para poder hacer uso de los Alias y evitar las rutas relativas:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components": ["src/components/*"],
      "@/icons": ["src/icons/*"],
      "@/lib": ["src/lib/*"]
    }
  }
}
```

- Para mejoras de SEO utilizar la etiqueta `<picture>` para envolver imagenes y poder definir diferentes tamaños de imagenes para diferentes dispositivos, ademas de la etiqueta `<source>` para definir diferentes formatos de imagenes. Utilizar la clase `truncate` de TailwindCSS para que si el texto no entra completo agregue puntos suspensivos:

```astro
  ---
  import type { Playlist } from "@/lib/data"

  interface Props {
    playlist: Playlist
  }

  const { playlist } = Astro.props
  const { id, cover, title, artists, color } = playlist

  const artistsString = artists.join(", ")
  ---
  <picture>
    <source
      srcset="/images/spotify/spotify-logo.webp"
      type="image/webp"
    />
    <img
      src="/images/spotify/spotify-logo.png"
      alt="Spotify Logo"
      class="w-12 h-12"
    />
  </picture>

  <a
    href={`/playlist/${id}`}
    class="playlist-item flex relative p-2 overflow-hidden items-center gap-5 rounded-md hover:bg-zinc-800"
  >
    <picture class="h-12 w-12 flex-none">
      <img
        src={cover}
        alt={`Cover of ${title} by ${artistsString}`}
        class="object-cover w-full h-full rounded-md"
      />
    </picture>

    <div class="flex flex-auto flex-col truncate">
      <h4 class="text-white text-sm">
        {title}
      </h4>

      <span class="text-xs text-gray-400">
        {artistsString}
      </span>
    </div>
  </a>
```

- Gradiente de fondo para tener un efecto de transicion en el fondo de la aplicacion:

```astro
  ---
  import Layout from "../layouts/Layout.astro"
  import PlayListItemCard from "@/components/PlayListItemCard.astro"
  import { playlists } from "@/lib/data"
  import Greeting from "@/components/Greeting.svelte"
  ---

  <Layout title="Spotify Clone">
    <div
      id="playlist-container"
      class="relative transition-all duration-1000 bg-green-600"
    >
      <!-- <PageHeader /> -->

      <div class="relative z-10 px-6 pt-10">
        <Greeting />
        <div class="flex flex-wrap mt-6 gap-4">
          {playlists.map((playlist) => <PlayListItemCard playlist={playlist} />)}
        </div>

        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 -z-[1]"
        >
        </div>
      </div>

      <style></style>
    </div>
  </Layout>
```

- Para utilizar las View Transitions de Astro y definir que imagen vamos a transicionar a la siguiente pagina, utilizamos la directiva de Astro de `transition:name=`, ademas debemos establecer el mismo enlace dentro de las paginas para que cada elemento sepa donde ubicarse:

```astro
  ---
  import type { Playlist } from "@/lib/data"
  import { CardPlayButton } from "./CardPlayButton"

  interface Props {
    playlist: Playlist
  }

  const { playlist } = Astro.props
  const { id, cover, title, artists, color } = playlist

  const artistsString = artists.join(", ")
  ---

  <article
    class="group relative hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 rounded-md ransi transition-all duration-300"
  >
    <div
      class=`absolute right-4 bottom-20 translate-y-4
      transition-all duration-500 opacity-0
      group-hover:translate-y-0 group-hover:opacity-100
      z-10
    `
    >
      <CardPlayButton id={id} client:visible />
    </div>

    <a
      href={`/playlist/${id}`}
      class="playlist-item transition-all duration-300 flex relative p-2 overflow-hidden gap-2 pb-6 rounded-md w-44 flex-col"
      transition:name=`playlist ${id} box`
    >
      <picture class="aspect-square w-full h-auto flex-none">
        <img
          src={cover}
          alt={`Cover of ${title} by ${artistsString}`}
          class="object-cover w-full h-full rounded-md"
          transition:name=`playlist ${id} image`
        />
      </picture>

      <div class="flex flex-auto flex-col px-2">
        <h4 class="text-white text-sm" transition:name=`playlist ${id} title`>
          {title}
        </h4>

        <span
          class="text-xs text-gray-400"
          transition:name=`playlist ${id} artists`
        >
          {artistsString}
        </span>
      </div>
    </a>
  </article>
```

```astro
---
  import MusicsTable from "@/components/MusicsTable.astro"
  import Layout from "../../layouts/Layout.astro"
  import { CardPlayButton } from "@/components/CardPlayButton"
  import { allPlaylists, songs } from "@/lib/data"

  const { id } = Astro.params

  const playlist = allPlaylists.find((playlist) => playlist.id === id)
  const playListSongs = songs.filter((song) => song.albumId === playlist?.albumId)
  ---

  <Layout title="Spotify Clone">
    <div
      id="playlist-container"
      class="relative flex flex-col h-full bg-zinc-900 overflow-x-hidden"
      transition:name=`playlist ${id} box`
    >
      <!-- <PageHeader /> -->

      <header class="flex flex-row gap-8 px-6 mt-12">
        <picture class="aspect-square w-52 h-52 flex-none">
          <img
            src={playlist?.cover}
            alt={`Cover of ${playlist?.title}`}
            class="object-cover w-full h-full shadow-lg"
            transition:name=`playlist ${playlist?.id} image`
          />
        </picture>

        <div class="flex flex-col justify-between">
          <h2 class="flex flex-1 items-end">Playlist</h2>
          <div>
            <h1 class="text-5xl font-bold block text-white">
              {playlist?.title}
              <span transition:name=`playlist ${playlist?.id} title`></span>
            </h1>
          </div>

          <div class="flex-1 flex items-end">
            <div class="text-sm text-gray-300 font-normal">
              <div transition:name=`playlist ${playlist?.id} artists`>
                <span>{playlist?.artists.join(", ")}</span>
              </div>
              <p class="mt-1">
                <span class="text-white">{playListSongs.length} canciones</span>,
                3 h aproximadamente
              </p>
            </div>
          </div>
        </div>
      </header>

      <div class="pl-6 pt-6">
        <CardPlayButton client:load id={id} size="large" />
      </div>

      <div class="relative z-10 px-6 pt-10"></div>

      <div
        class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 -z-[1]"
      >
      </div>

      <section class="p-6">
        <MusicsTable songs={playListSongs} />
      </section>
    </div>
  </Layout>
```

- Para Compenentes Interactivos al estar utilizando el Modo Server de Astro para SSR, debemos utilizar la directiva `client:load` para que el componente se ejecute en el cliente y no en el servidor, ademas de la directiva `transition:persist` para que el estado del componente persista al cambiar de pagina. Podria utilizarse la directiva `client:visible` para que el componente se ejecute solo cuando sea visible en la pantalla haciendo uso del Lazy Loading, pero siempre esta visible por lo cual no es necesario:

```astro
  ---
  import { Player } from "@/components/Player"
  import AsideMenu from "../components/AsideMenu.astro"
  import { ViewTransitions } from "astro:transitions"

  interface Props {
    title: string
  }

  const { title } = Astro.props
  ---

  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="description" content="Astro description" />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="generator" content={Astro.generator} />
      <title>{title}</title>
      <ViewTransitions fallback="none" />
    </head>
    <body>
      <div id="app" class="relative h-screen p-2 gap-2">
        <aside class="[grid-area:aside] flex-col flex overflow-y-auto">
          <AsideMenu />
        </aside>

        <main
          class="[grid-area:main] rounded-lg bg-zinc-900 overflow-y-auto w-full"
        >
          <slot />
        </main>

        <footer class="[grid-area:player] h-[80px]">
          <Player client:load transition:name="media-player" transition:persist />
        </footer>
      </div>
      <style>
        #app {
          display: grid;
          grid-template-areas:
            "aside main main"
            "player player player";
          grid-template-columns: 350px 1fr;
          grid-template-rows: 1fr auto;
        }
      </style>

      <style is:global>
        html {
          font-family: "CircularStd", system-ui, sans-serif;
          background: #010101;
          color: white;
        }
      </style>
    </body>
  </html>
```

- Agregar estilos por Grupos con TailwindCSS para que al hacer hover aparezca desde abajo el icono de Play o Pause:

```astro
  ---
  import type { Playlist } from "@/lib/data"
  import { CardPlayButton } from "./CardPlayButton"

  interface Props {
    playlist: Playlist
  }

  const { playlist } = Astro.props
  const { id, cover, title, artists, color } = playlist

  const artistsString = artists.join(", ")
  ---

  <article
    class="group relative hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 rounded-md ransi transition-all duration-300"
  >
    <div
      class=`absolute right-4 bottom-20 translate-y-4
      transition-all duration-500 opacity-0
      group-hover:translate-y-0 group-hover:opacity-100
      z-10
    `
    >
      <CardPlayButton id={id} client:visible />
    </div>

    <a
      href={`/playlist/${id}`}
      class="playlist-item transition-all duration-300 flex relative p-2 overflow-hidden gap-2 pb-6 rounded-md w-44 flex-col"
      transition:name=`playlist ${id} box`
    >
      <picture class="aspect-square w-full h-auto flex-none">
        <img
          src={cover}
          alt={`Cover of ${title} by ${artistsString}`}
          class="object-cover w-full h-full rounded-md"
          transition:name=`playlist ${id} image`
        />
      </picture>

      <div class="flex flex-auto flex-col px-2">
        <h4 class="text-white text-sm" transition:name=`playlist ${id} title`>
          {title}
        </h4>

        <span
          class="text-xs text-gray-400"
          transition:name=`playlist ${id} artists`
        >
          {artistsString}
        </span>
      </div>
    </a>
  </article>
```

- Crear un Estado Global con Zustand para almacenar el ID de la playlist que se encuentra en reproduccion y utilizarla en el componente de PlayButton para saber si la playlist esta en reproduccion o no:

```ts
import { create } from "zustand";

export const usePlayerStore = create((set) => ({
  isPlaying: false,
  currentMusic: { playlist: null, song: null, songs: [] },
  volume: 1,
  setVolume: (volume) => set({ volume }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentMusic: (currentMusic) => set({ currentMusic }),
}));
```

```tsx
import { Pause, Play } from "./Player";
import { usePlayerStore } from "@/store/playerStore";

export function CardPlayButton({ id, size = "small" }) {
  const { currentMusic, isPlaying, setIsPlaying, setCurrentMusic } =
    usePlayerStore((state) => state);

  const isPlayingPlaylist = isPlaying && currentMusic?.playlist.id === id;

  const handleClick = () => {
    if (isPlayingPlaylist) {
      setIsPlaying(false);
      return;
    }

    fetch(`/api/get-info-playlist.json?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const { songs, playlist } = data;

        setIsPlaying(true);
        setCurrentMusic({ songs, playlist, song: songs[0] });
      });
  };

  const iconClassName = size === "small" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={handleClick}
      className="card-play-button rounded-full bg-green-500 p-4 hover:scale-105 transition hover:bg-green-400"
    >
      {isPlayingPlaylist ? (
        <Pause className={iconClassName} />
      ) : (
        <Play className={iconClassName} />
      )}
    </button>
  );
}
```

- Creacion de un Endpoint en la carpeta `api/get-info-playlist.json.ts` para obtener las playlists:

```ts
import { allPlaylists, songs as allSongs } from "@/lib/data";

export async function GET({ params, request }) {
  // get the id from the url search params
  const { url } = request;
  const urlObject = new URL(url);
  const id = urlObject.searchParams.get("id");

  const playlist = allPlaylists.find((playlist) => playlist.id === id);
  const songs = allSongs.filter((song) => song.albumId === playlist?.albumId);

  return new Response(JSON.stringify({ playlist, songs }), {
    headers: { "content-type": "application/json" },
  });
}
```

## Chat para Hablar con PDF's usando Astro, Svelte, TailwindCSS y Cloudinary -> Astro Features

- Utilizacion como AI Service de Llama3 con Ollama en Servidor propio o Servicio de Cloudflare AI
- Backgrounds de TailwindCSS por ibelik: [Backgrounds](https://bg.ibelick.com/)
- Tener un Store para almacenar el estado global de la Aplicacion y en base a los valores almacenados en el Store, mostrar la seccion del formulario correspondiente

```ts
import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.INIT);
export const appStatusInfo = writable({
  id: "c1a098ffcb49079c8180b18c7b15229a",
  url: "https://res.cloudinary.com/midudev/image/upload/v1706810969/pdf/khiice5vqnr1gcn1pmtq.pdf",
  pages: 4,
});

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR);
};

export const setAppStatusChatMode = ({
  id,
  url,
  pages,
}: {
  id: string;
  url: string;
  pages: number;
}) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
  appStatusInfo.set({ id, url, pages });
};
```

- Instalar libreria de Drag and Drop para subir un archivo posteriormente a la API de Cloudinary

```ts
  <script>
    import {
      setAppStatusLoading,
      setAppStatusError,
      setAppStatusChatMode,
    } from "../store.ts"
    import Dropzone from "svelte-file-dropzone"

    let files = {
      accepted: [],
      rejected: [],
    }

    async function handleFilesSelect(e) {
      const { acceptedFiles, fileRejections } = e.detail

      files.accepted = [...files.accepted, ...acceptedFiles]
      files.rejected = [...files.rejected, ...fileRejections]

      if (acceptedFiles.length > 0) {
        setAppStatusLoading()

        const formData = new FormData()
        formData.append("file", acceptedFiles[0])

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          setAppStatusError()
          return
        }

        const { id, url, pages } = await res.json()
        setAppStatusChatMode({ id, url, pages })
      }
    }
  </script>

  {#if files.accepted.length === 0}
    <Dropzone
      accept="application/pdf"
      multiple={false}
      on:drop={handleFilesSelect}>Arrastra y suelta aquí tu PDF</Dropzone
    >
  {/if}

  <ol>
    {#each files.accepted as item}
      <li>{item.name}</li>
    {/each}
  </ol>
```

- Crear un Endpoint en la carpeta `api/upload.ts` para subir el archivo a Cloudinary desde el Componente de Upload mediante un FormData (colocar previamente Astro en modo `server`):

```ts
<script>
  import {
    setAppStatusLoading,
    setAppStatusError,
    setAppStatusChatMode,
  } from "../store.ts"
  import Dropzone from "svelte-file-dropzone"

  let files = {
    accepted: [],
    rejected: [],
  }

  async function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail

    files.accepted = [...files.accepted, ...acceptedFiles]
    files.rejected = [...files.rejected, ...fileRejections]

    if (acceptedFiles.length > 0) {
      setAppStatusLoading()

      const formData = new FormData()
      formData.append("file", acceptedFiles[0])

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        setAppStatusError()
        return
      }

      const { id, url, pages } = await res.json()
      setAppStatusChatMode({ id, url, pages })
    }
  }
</script>

{#if files.accepted.length === 0}
  <Dropzone
    accept="application/pdf"
    multiple={false}
    on:drop={handleFilesSelect}>Arrastra y suelta aquí tu PDF</Dropzone
  >
{/if}

<ol>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ol>
```

```ts
import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: "midudev",
  api_key: "898535479927365", // es pública
  api_secret: import.meta.env.CLOUDINARY_SECRET,
});

const outputDir = path.join(process.cwd(), "public/text");

const uploadStream = async (
  buffer: Uint8Array,
  options: {
    folder: string;
    ocr?: string;
  }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (file == null) {
    return new Response("No file found", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const unit8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(unit8Array, {
    folder: "pdf",
    ocr: "adv_ocr",
  });

  const { asset_id: id, secure_url: url, pages, info } = result;

  const data = info?.ocr?.adv_ocr?.data;

  const text = data
    .map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks["textAnnotations"] ?? {};
      const first = annotations[0] ?? {};
      const content = first["description"] ?? "";
      return content.trim();
    })
    .filter(Boolean)
    .join("\n");

  // TODO: Meter esta info en una base de datos
  // Mejor todavía en un vector y hacer los embeddings
  // pero no nos da tiempo
  fs.writeFile(`${outputDir}/${id}.txt`, text, "utf-8");

  return new Response(
    JSON.stringify({
      id,
      url,
      pages,
    })
  );
};
```

- Para poder subir el Archivo a Cloudinary y ser transformado en binario, asi extraer el texto luego, se debe utilizar el metodo `.upload_stream()`, agregar los cambios al Store y al Componente de Upload:

```ts
<script>
  import {
    setAppStatusLoading,
    setAppStatusError,
    setAppStatusChatMode,
  } from "../store.ts"
  import Dropzone from "svelte-file-dropzone"

  let files = {
    accepted: [],
    rejected: [],
  }

  async function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail

    files.accepted = [...files.accepted, ...acceptedFiles]
    files.rejected = [...files.rejected, ...fileRejections]

    if (acceptedFiles.length > 0) {
      setAppStatusLoading()

      const formData = new FormData()
      formData.append("file", acceptedFiles[0])

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        setAppStatusError()
        return
      }

      const { id, url, pages } = await res.json()
      setAppStatusChatMode({ id, url, pages })
    }
  }
</script>

{#if files.accepted.length === 0}
  <Dropzone
    accept="application/pdf"
    multiple={false}
    on:drop={handleFilesSelect}>Arrastra y suelta aquí tu PDF</Dropzone
  >
{/if}

<ol>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ol>
```

```ts
import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.INIT);
export const appStatusInfo = writable({
  id: "c1a098ffcb49079c8180b18c7b15229a",
  url: "https://res.cloudinary.com/midudev/image/upload/v1706810969/pdf/khiice5vqnr1gcn1pmtq.pdf",
  pages: 4,
});

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR);
};

export const setAppStatusChatMode = ({
  id,
  url,
  pages,
}: {
  id: string;
  url: string;
  pages: number;
}) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
  appStatusInfo.set({ id, url, pages });
};
```

- Crear el Componente de chat en el cual se van a escribir las preguntas que van a ser enviadas a la API de OpenAI, ademas de mostrar Imagenes de Previsualizacion de los PDF's por medio de la URL de Cloudinary (dar un Aspect Ratio a las imagenes para que no den un salto al cargar):

```ts
<script>
  import { Input, Label, Spinner } from "flowbite-svelte"
  import { appStatusInfo, setAppStatusError } from "../store"
  const { url, pages, id } = $appStatusInfo

  let answer = ""
  let loading = false

  const numOfImagesToShow = Math.min(pages, 4)
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1
    return url
      .replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg")
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    loading = true
    answer = ""
    const question = event.target.question.value

    const searchParams = new URLSearchParams()
    searchParams.append("id", id)
    searchParams.append("question", question)

    try {
      const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`)

      eventSource.onmessage = (event) => {
        loading = false
        const incomingData = JSON.parse(event.data)

        if (incomingData === "__END__") {
          eventSource.close()
          return
        }

        answer += incomingData
      }
    } catch (e) {
      setAppStatusError()
    } finally {
      loading = false
    }
  }
</script>

<div class="grid grid-cols-4 gap-2">
  {#each images as image}
    <img
      class="rounded w-full h-auto aspect-[400/540]"
      src={image}
      alt="PDF page"
    />
  {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
  <Label for="question" class="block mb-2">Deja aquí tu pregunta</Label>
  <Input id="question" required placeholder="¿De qué trata este documento?"
  ></Input>
</form>

{#if loading}
  <div class="mt-10 flex justify-center items-center flex-col gap-y-2">
    <Spinner />
    <p class="opacity-75">Esperando respuesta...</p>
  </div>
{/if}

{#if answer}
  <div class="mt-8">
    <p class="font-medium">Respuesta:</p>
    <p>{answer}</p>
  </div>
{/if}
```

- Para poder obtener el texto del PDF desde Clodinary se debe activar el `ocr` en la subida del archivo a Cloudinary en el metodo de `upload_stream()`, ademas de agregar el texto del PDF en un archivo de texto en la carpeta `public/text` para poder ser leido por la API de OpenAI. Dentro del endpoint `/api/upload.ts` se retorna el contenido del PDF en un archivo de texto. Creamos un propio directorio donde poder acceder al archivo por medio de un ID, aunque lo ideal seria subir el archivo a un S3 o a una base de datos vectorizada para hacer embeddings de texto (**OpenAI Blog de como realizarlo u otros mecanismos con opciones mas baratas**) y poder hacer busquedas de texto en el futuro como **Cloudflare (Langchain and Cloudflare AI)**, Supabase o Google Cloud Storage:

```ts
import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: "midudev",
  api_key: "898535479927365", // es pública
  api_secret: import.meta.env.CLOUDINARY_SECRET,
});

const outputDir = path.join(process.cwd(), "public/text");

const uploadStream = async (
  buffer: Uint8Array,
  options: {
    folder: string;
    ocr?: string;
  }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (file == null) {
    return new Response("No file found", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const unit8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(unit8Array, {
    folder: "pdf",
    ocr: "adv_ocr",
  });

  const { asset_id: id, secure_url: url, pages, info } = result;

  const data = info?.ocr?.adv_ocr?.data;

  const text = data
    .map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks["textAnnotations"] ?? {};
      const first = annotations[0] ?? {};
      const content = first["description"] ?? "";
      return content.trim();
    })
    .filter(Boolean)
    .join("\n");

  // TODO: Meter esta info en una base de datos
  // Mejor todavía en un vector y hacer los embeddings
  // pero no nos da tiempo
  fs.writeFile(`${outputDir}/${id}.txt`, text, "utf-8");

  return new Response(
    JSON.stringify({
      id,
      url,
      pages,
    })
  );
};
```

- Crear el endpoint `/api/ask?${searchParams.toString()}` al cual se envia la pregunta y va a responder con la respuesta de la API de OpenAI (haciendo uso del Stream de Datos en el Componente de Chat), ademas de enviar la pregunta a la API de OpenAI y recibir la respuesta:

```ts
import { type APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { responseSSE } from "../../utils/sse";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_KEY,
});

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const question = url.searchParams.get("question");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  if (!question) {
    return new Response("Missing question", { status: 400 });
  }

  const txt = await readFile(`public/text/${id}.txt`, "utf-8");

  return responseSSE({ request }, async (sendEvent) => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            'Eres un investigador español experimentado, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context>, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar únicamente información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No intentes inventar una respuesta. Cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario.',
        },
        {
          role: "user",
          content: `<context>${txt}</context><question>${question}</question>`,
        },
      ],
    });

    for await (const part of response) {
      sendEvent(part.choices[0].delta.content);
    }

    sendEvent("__END__");
  });
};
```

```ts
export const responseSSE = (
  { request }: { request: Request },
  callback: (sendEvent: (data: any) => void) => Promise<void>
) => {
  const body = new ReadableStream({
    async start(controller) {
      // Text encoder for converting strings to Uint8Array
      const encoder = new TextEncoder();

      // Send event to client
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      callback(sendEvent);

      // Handle the connection closing
      request.signal.addEventListener("abort", () => {
        controller.close();
      });
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
```

- En el Componente de Chat hacemos el llamado hacia nuestro Endpoint el cual va a responder con la respuesta de la API de OpenAI, ademas de mostrar las imagenes de las paginas del PDF y el formulario para enviar la pregunta:

```ts
<script>
  import { Input, Label, Spinner } from "flowbite-svelte"
  import { appStatusInfo, setAppStatusError } from "../store"
  const { url, pages, id } = $appStatusInfo

  let answer = ""
  let loading = false

  const numOfImagesToShow = Math.min(pages, 4)
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1
    return url
      .replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg")
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    loading = true
    answer = ""
    const question = event.target.question.value

    const searchParams = new URLSearchParams()
    searchParams.append("id", id)
    searchParams.append("question", question)

    try {
      const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`)

      eventSource.onmessage = (event) => {
        loading = false
        const incomingData = JSON.parse(event.data)

        if (incomingData === "__END__") {
          eventSource.close()
          return
        }

        answer += incomingData
      }
    } catch (e) {
      setAppStatusError()
    } finally {
      loading = false
    }
  }
</script>

<div class="grid grid-cols-4 gap-2">
  {#each images as image}
    <img
      class="rounded w-full h-auto aspect-[400/540]"
      src={image}
      alt="PDF page"
    />
  {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
  <Label for="question" class="block mb-2">Deja aquí tu pregunta</Label>
  <Input id="question" required placeholder="¿De qué trata este documento?"
  ></Input>
</form>

{#if loading}
  <div class="mt-10 flex justify-center items-center flex-col gap-y-2">
    <Spinner />
    <p class="opacity-75">Esperando respuesta...</p>
  </div>
{/if}

{#if answer}
  <div class="mt-8">
    <p class="font-medium">Respuesta:</p>
    <p>{answer}</p>
  </div>
{/if}
```
