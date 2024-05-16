import { column, defineDb, defineTable } from "astro:db";
import * as crypto from "node:crypto";

const Users = defineTable({
  columns: {
    id: column.text({ default: crypto.randomUUID(), primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),
  },
});

const Invoices = defineTable({
  columns: {
    id: column.text({ default: crypto.randomUUID(), primaryKey: true }),
    customerId: column.text({ name: "customer_id" }),
    amount: column.number(),
    status: column.text(),
    date: column.date(),
  },
});

const Customers = defineTable({
  columns: {
    id: column.text({ default: crypto.randomUUID(), primaryKey: true }),
    name: column.text(),
    email: column.text(),
    imageUrl: column.text({ name: "image_url" }),
  },
});

const Revenue = defineTable({
  columns: {
    month: column.text({ unique: true }),
    revenue: column.number(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Users,
    Invoices,
    Customers,
    Revenue,
  },
});
