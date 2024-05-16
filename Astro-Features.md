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
