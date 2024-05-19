import { defineAction, z } from "astro:actions";
import { Invoices, db, eq } from "astro:db";
import * as crypto from "node:crypto";

export const server = {
  createInvoice: defineAction({
    accept: "form",
    input: z.object({
      customerId: z.string(),
      amount: z.coerce.number(),
      status: z.enum(["pending", "paid"]),
    }),
    handler: async ({ customerId, amount, status }) => {
      const amountInCents = amount * 100;
      const date = new Date();
      const id = crypto.randomUUID();

      try {
        await db.insert(Invoices).values({
          id,
          customerId,
          amount: amountInCents,
          status,
          date,
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: "Database Error: Failed to Create Invoice.",
        };
      }
    },
  }),
  updateInvoice: defineAction({
    accept: "form",
    input: z.object({
      id: z.string(),
      customerId: z.string(),
      amount: z.coerce.number(),
      status: z.enum(["pending", "paid"]),
    }),
    handler: async ({ id, customerId, amount, status }) => {
      const amountInCents = amount * 100;

      try {
        await db
          .update(Invoices)
          .set({ customerId, amount: amountInCents, status })
          .where(eq(Invoices.id, id));
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: "Database Error: Failed to Update Invoice.",
        };
      }
    },
  }),
  deleteInvoice: defineAction({
    accept: "form",
    input: z.object({
      id: z.string(),
    }),
    handler: async ({ id }) => {
      try {
        await db.delete(Invoices).where(eq(Invoices.id, id));
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: "Database Error: Failed to Delete Invoice.",
        };
      }
    },
  }),
};
