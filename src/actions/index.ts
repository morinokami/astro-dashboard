import { defineAction, z } from "astro:actions";
import { Invoices, db, eq } from "astro:db";
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

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true });

export const server = {
  createInvoice: defineAction({
    accept: "form",
    handler: async (formData) => {
      const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
      });

      if (!validatedFields.success) {
        return {
          success: false,
          errors: validatedFields.error.flatten().fieldErrors,
          message: "Missing Fields. Failed to Create Invoice.",
        };
      }

      const { customerId, amount, status } = validatedFields.data;
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
    handler: async (formData) => {
      const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
      });

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: "Missing Fields. Failed to Update Invoice.",
        };
      }

      const { id, customerId, amount, status } = validatedFields.data;
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
