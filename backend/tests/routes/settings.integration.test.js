const request = require("supertest");
const express = require("express");

jest.mock("../../db/db", () => ({ get: jest.fn(), run: jest.fn() }));
jest.mock("../../db/init", () => {});

const db = require("../../db/db");

const app = express();
app.use(express.json());
app.use("/settings", require("../../routes/settings"));

const defaultSettings = {
  id: 1,
  salary_weight: 1,
  bonus_weight: 1,
  stock_weight: 1,
  wellness_weight: 1,
  life_insurance_weight: 1,
  pdf_weight: 1,
  col_weight: 1,
};

beforeEach(() => jest.clearAllMocks());

// GET /settings 
describe("GET /settings", () => {
  test("returns settings row with all weight fields", async () => {
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, defaultSettings));

    const res = await request(app).get("/settings");

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      salary_weight: 1,
      bonus_weight: 1,
      col_weight: 1,
    });
  });

  test("response is application/json", async () => {
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, defaultSettings));

    const res = await request(app).get("/settings");

    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  test("returns 500 on DB error", async () => {
    db.get.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("connection lost"), null)
    );

    const res = await request(app).get("/settings");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});

// PUT /settings 
describe("PUT /settings", () => {
  test("updates settings and returns changes count", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const res = await request(app).put("/settings").send(defaultSettings);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("updated", 1);
  });

  test("accepts decimal weight values", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const res = await request(app)
      .put("/settings")
      .send({ ...defaultSettings, salary_weight: 1.5, col_weight: 0.75 });

    expect(res.statusCode).toBe(200);
    const [, params] = db.run.mock.calls[0];
    expect(params[0]).toBe(1.5);
    expect(params[6]).toBe(0.75);
  });

  test("accepts all-zero weights", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const allZero = Object.fromEntries(
      Object.keys(defaultSettings).map(k => [k, 0])
    );

    const res = await request(app).put("/settings").send(allZero);

    expect(res.statusCode).toBe(200);
  });

  test("returns 500 on DB error", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("write failed"));
    });

    const res = await request(app).put("/settings").send(defaultSettings);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
