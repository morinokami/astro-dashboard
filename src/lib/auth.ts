import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Session, Users, db } from "astro:db";
import { Lucia } from "lucia";

// eslint-disable-next-line
// @ts-expect-error
const adapter = new DrizzleSQLiteAdapter(db, Session, Users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
