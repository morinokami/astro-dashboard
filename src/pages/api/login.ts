import type { APIContext } from "astro";
import { Users, db, eq } from "astro:db";
import { Argon2id } from "oslo/password";

import { lucia } from "@/lib/auth";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = (
    await db.select().from(Users).where(eq(Users.email, email))
  ).at(0);
  if (!existingUser) {
    return new Response(
      JSON.stringify({
        error: "Incorrect username or password",
      }),
      {
        status: 400,
      },
    );
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password,
  );
  if (!validPassword) {
    return new Response(
      JSON.stringify({
        error: "Incorrect username or password",
      }),
      {
        status: 400,
      },
    );
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response();
}
