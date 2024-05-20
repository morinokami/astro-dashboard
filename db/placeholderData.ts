import * as crypto from "node:crypto";
import { Argon2id } from "oslo/password";

// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
export const users = [
  {
    id: crypto.randomUUID(),
    name: "User",
    email: "user@nextmail.com",
    password: await new Argon2id().hash("123456"),
  },
];

export const customers = [
  {
    id: crypto.randomUUID(),
    name: "Delba de Oliveira",
    email: "delba@oliveira.com",
    imageUrl: "/customers/delba-de-oliveira.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Lee Robinson",
    email: "lee@robinson.com",
    imageUrl: "/customers/lee-robinson.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Hector Simpson",
    email: "hector@simpson.com",
    imageUrl: "/customers/hector-simpson.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Steven Tey",
    email: "steven@tey.com",
    imageUrl: "/customers/steven-tey.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Steph Dietz",
    email: "steph@dietz.com",
    imageUrl: "/customers/steph-dietz.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Michael Novotny",
    email: "michael@novotny.com",
    imageUrl: "/customers/michael-novotny.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Evil Rabbit",
    email: "evil@rabbit.com",
    imageUrl: "/customers/evil-rabbit.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Emil Kowalski",
    email: "emil@kowalski.com",
    imageUrl: "/customers/emil-kowalski.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Amy Burns",
    email: "amy@burns.com",
    imageUrl: "/customers/amy-burns.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Balazs Orban",
    email: "balazs@orban.com",
    imageUrl: "/customers/balazs-orban.png",
  },
];

export const invoices = [
  {
    id: crypto.randomUUID(),
    customerId: customers[0].id,
    amount: 15795,
    status: "pending",
    date: new Date("2022-12-06"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[1].id,
    amount: 20348,
    status: "pending",
    date: new Date("2022-11-14"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[4].id,
    amount: 3040,
    status: "paid",
    date: new Date("2022-10-29"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[3].id,
    amount: 44800,
    status: "paid",
    date: new Date("2023-09-10"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[5].id,
    amount: 34577,
    status: "pending",
    date: new Date("2023-08-05"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[7].id,
    amount: 54246,
    status: "pending",
    date: new Date("2023-07-16"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[6].id,
    amount: 666,
    status: "pending",
    date: new Date("2023-06-27"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[3].id,
    amount: 32545,
    status: "paid",
    date: new Date("2023-06-09"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[4].id,
    amount: 1250,
    status: "paid",
    date: new Date("2023-06-17"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[5].id,
    amount: 8546,
    status: "paid",
    date: new Date("2023-06-07"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[1].id,
    amount: 500,
    status: "paid",
    date: new Date("2023-08-19"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[5].id,
    amount: 8945,
    status: "paid",
    date: new Date("2023-06-03"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[2].id,
    amount: 8945,
    status: "paid",
    date: new Date("2023-06-18"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[0].id,
    amount: 8945,
    status: "paid",
    date: new Date("2023-10-04"),
  },
  {
    id: crypto.randomUUID(),
    customerId: customers[2].id,
    amount: 1000,
    status: "paid",
    date: new Date("2022-06-05"),
  },
];

export const revenue = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 2300 },
  { month: "Jun", revenue: 3200 },
  { month: "Jul", revenue: 3500 },
  { month: "Aug", revenue: 3700 },
  { month: "Sep", revenue: 2500 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3000 },
  { month: "Dec", revenue: 4800 },
];
