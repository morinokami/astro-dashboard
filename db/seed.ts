import { Customers, Invoices, Revenue, Users, db } from "astro:db";

import { customers, invoices, revenue, users } from "./placeholderData";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Users).values(users);
  await db.insert(Customers).values(customers);
  await db.insert(Invoices).values(invoices);
  await db.insert(Revenue).values(revenue);
}
