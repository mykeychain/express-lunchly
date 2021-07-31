"use strict";

const request = require("supertest");

const app = require("./app");
const db = require("./db");

describe("GET /", function () {
  let testCustomer1;
  let testCustomer2;

  beforeEach(function () {
    await db.query(`DELETE FROM reservations`);
    await db.query(`DELETE FROM customers`);

    const cP1 = db.query(
      `INSERT INTO customers (first_name, last_name, phone, notes)
           VALUES ('Zach', 'Thomas', '573-544-8494', 'super smart and nice')
           RETURNING id`
    );

    const cP2 = db.query(
      `INSERT INTO customers (first_name, last_name, phone, notes)
      VALUES ('Mike', 'Chang', '555-5555', 'found a screen reader bug in navbar' )
      RETURNING id`
    );

    const results = await Promise.all([cP1, cP2]);

    testCustomer1 = Customer.get(results[0].id);
    testCustomer2 = Customer.get(results[1].id);

    const rP1 = db.query(
      `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
       VALUES (${testCustomer1.id}, 5, 2021-05-30 06:30 am, 'Need extra table')
       RETURNING id`
    );

    const rP2 = db.query(
      `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
       VALUES (${testCustomer2.id}, 5, 2021-05-30 08:30 am, 'Need extra table')
      RETURNING id`
    );

    const rP3 = db.query(
      `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
       VALUES (${testCustomer2.id}, 5, 2021-05-30 10:30 am, 'Need extra table')
      RETURNING id`
    );

    await Promise.all([rP1, rP2, rP3]);
  });

  afterEach(function () {
    console.log("after each");
  });

  
  it("Gets a list of customers", async function () {
    const resp = await request(app).get("/");
    expect(resp.body).toEqual("random");
  });

  it("Gets a list of customers", async function () {
    const resp = await request(app).get("/");
    expect(resp.status).toEqual(200);
  });
});
