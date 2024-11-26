import { ActionError, defineAction } from "astro:actions";
import { Invoices, db, eq } from "astro:db";
import { z } from "astro:schema";
import * as crypto from "node:crypto";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateSchema = FormSchema.omit({ id: true, date: true });
const UpdateSchema = FormSchema.omit({ date: true });

export const invoice = {
  create: defineAction({
    accept: "form",
    input: CreateSchema,
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
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database Error: Failed to Create Invoice.",
        });
      }
    },
  }),
  update: defineAction({
    accept: "form",
    input: UpdateSchema,
    handler: async ({ id, customerId, amount, status }) => {
      const amountInCents = amount * 100;

      try {
        await db
          .update(Invoices)
          .set({ customerId, amount: amountInCents, status })
          .where(eq(Invoices.id, id));
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database Error: Failed to Update Invoice.",
        });
      }
    },
  }),
  delete: defineAction({
    accept: "form",
    input: z.object({
      id: z.string(),
    }),
    handler: async ({ id }) => {
      try {
        await db.delete(Invoices).where(eq(Invoices.id, id));
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database Error: Failed to Delete Invoice.",
        });
      }
    },
  }),
};
