import { customers, invoices, revenue, users } from "@/lib/placeholderData";
import { Customers, Invoices, Revenue, Users, db } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Users).values(users);
  await db.insert(Invoices).values(invoices);
  await db.insert(Customers).values(customers);
  await db.insert(Revenue).values(revenue);
}
