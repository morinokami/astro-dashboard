import {
  Customers,
  Invoices,
  Revenue,
  asc,
  count,
  db,
  desc,
  eq,
  like,
  or,
  sql,
  sum,
} from "astro:db";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log("Fetching revenue data...");
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await db.select().from(Revenue);

    // console.log("Data fetch completed after 3 seconds.");

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await db
      .select({
        amount: Invoices.amount,
        name: Customers.name,
        imageUrl: Customers.imageUrl,
        email: Customers.email,
        id: Invoices.id,
      })
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .orderBy(desc(Invoices.date))
      .limit(5);

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = db.select({ count: count() }).from(Invoices);
    const customerCountPromise = db.select({ count: count() }).from(Customers);
    const totalPaidPromise = db
      .select({ paid: sum(Invoices.amount) })
      .from(Invoices)
      .where(eq(Invoices.status, "paid"));
    const totalPendingPromise = db
      .select({ pending: sum(Invoices.amount) })
      .from(Invoices)
      .where(eq(Invoices.status, "pending"));

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      totalPaidPromise,
      totalPendingPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? "0");
    const numberOfCustomers = Number(data[1][0].count ?? "0");
    const totalPaidInvoices = formatCurrency(Number(data[2][0].paid ?? "0"));
    const totalPendingInvoices = formatCurrency(
      Number(data[3][0].pending ?? "0"),
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await db
      .select({
        id: Invoices.id,
        amount: Invoices.amount,
        date: Invoices.date,
        status: Invoices.status,
        name: Customers.name,
        email: Customers.email,
        imageUrl: Customers.imageUrl,
      })
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        or(
          like(Invoices.amount, `%${query}%`),
          like(Invoices.date, `%${query}%`),
          like(Invoices.status, `%${query}%`),
          like(Customers.name, `%${query}%`),
          like(Customers.email, `%${query}%`),
        ),
      )
      .orderBy(desc(Invoices.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const result = await db
      .select({ count: count() })
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        or(
          like(Invoices.amount, `%${query}%`),
          like(Invoices.date, `%${query}%`),
          like(Invoices.status, `%${query}%`),
          like(Customers.name, `%${query}%`),
          like(Customers.email, `%${query}%`),
        ),
      );

    const totalPages = Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await db
      .select({
        id: Invoices.id,
        customerId: Invoices.customerId,
        amount: Invoices.amount,
        status: Invoices.status,
      })
      .from(Invoices)
      .where(eq(Invoices.id, id));

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const customers = await db
      .select({ id: Customers.id, name: Customers.name })
      .from(Customers)
      .orderBy(asc(Customers.name));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await db
      .select({
        id: Customers.id,
        name: Customers.name,
        email: Customers.email,
        imageUrl: Customers.imageUrl,
        totalInvoices: count(),
        totalPending: sql<number>`SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END)`,
        totalPaid: sql<number>`SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END)`,
      })
      .from(Customers)
      .leftJoin(Invoices, eq(Customers.id, Invoices.customerId))
      .where(
        or(
          like(Customers.name, `%${query}%`),
          like(Customers.email, `%${query}%`),
        ),
      )
      .groupBy(
        Customers.id,
        Customers.name,
        Customers.email,
        Customers.imageUrl,
      )
      .orderBy(asc(Customers.name));

    const customers = data.map((customer) => ({
      ...customer,
      totalPending: formatCurrency(customer.totalPending),
      totalPaid: formatCurrency(customer.totalPaid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
