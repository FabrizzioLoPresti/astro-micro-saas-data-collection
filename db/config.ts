import { defineDb, defineTable, column } from "astro:db";

// https://astro.build/db/config

const Answers = defineTable({
  columns: {
    email: column.text({ primaryKey: true }),
    answers: column.json(),
  },
});

export default defineDb({
  tables: {
    Answers,
  },
});
