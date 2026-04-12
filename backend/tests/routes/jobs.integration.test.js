const request = require("supertest");
const express = require("express");

jest.mock("../../db/db", () => ({
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn(),
}));
jest.mock("../../db/init", () => {});

const db = require("../../db/db");

const app = express();
app.use(express.json());
app.use("/jobs", require("../../routes/jobs"));

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const baseJob = {
  title: "Software Engineer",
  company: "Acme",
  city: "Seattle",
  state: "WA",
  cost_of_living_index: 110,
  salary: 130000,
  bonus: 10000,
  stock_options: 5000,
  wellness_stipend: 1000,
  life_insurance: 500,
  personal_dev_fund: 500,
  is_current_job: 0,
};

beforeEach(() => jest.clearAllMocks());

// ─── POST /jobs ───────────────────────────────────────────────────────────────
describe("POST /jobs", () => {
  test("201-ish: creates a job and returns jobId", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ lastID: 1 }, null);
    });

    const res = await request(app).post("/jobs").send(baseJob);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("jobId");
    expect(typeof res.body.jobId).toBe("number");
  });

  test("clears current jobs before insert when is_current_job = 1", async () => {
    db.run
      .mockImplementationOnce((sql, params, cb) => cb(null))
      .mockImplementationOnce(function (sql, params, cb) {
        cb.call({ lastID: 2 }, null);
      });

    const res = await request(app)
      .post("/jobs")
      .send({ ...baseJob, is_current_job: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("jobId", 2);

    const firstSql = db.run.mock.calls[0][0];
    expect(firstSql).toMatch(/UPDATE jobs SET is_current_job = 0/i);
  });

  test("returns 500 when INSERT fails", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("constraint violation"));
    });

    const res = await request(app).post("/jobs").send(baseJob);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});

// ─── GET /jobs ────────────────────────────────────────────────────────────────
describe("GET /jobs", () => {
  test("returns array of jobs", async () => {
    const rows = [{ id: 1, ...baseJob }, { id: 2, ...baseJob, title: "PM" }];
    db.all.mockImplementationOnce((sql, params, cb) => cb(null, rows));

    const res = await request(app).get("/jobs");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  test("returns empty array when no jobs exist", async () => {
    db.all.mockImplementationOnce((sql, params, cb) => cb(null, []));

    const res = await request(app).get("/jobs");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("returns 500 on DB error", async () => {
    db.all.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("table missing"), null)
    );

    const res = await request(app).get("/jobs");

    expect(res.statusCode).toBe(500);
  });
});

// ─── GET /jobs/:id ────────────────────────────────────────────────────────────
describe("GET /jobs/:id", () => {
  test("returns job when found", async () => {
    const row = { id: 5, ...baseJob };
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, row));

    const res = await request(app).get("/jobs/5");

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: 5, title: "Software Engineer" });
  });

  test("returns 404 when job does not exist", async () => {
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, null));

    const res = await request(app).get("/jobs/999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test("returns 500 on DB error", async () => {
    db.get.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("db error"), null)
    );

    const res = await request(app).get("/jobs/1");

    expect(res.statusCode).toBe(500);
  });
});

// ─── PUT /jobs/:id ────────────────────────────────────────────────────────────
describe("PUT /jobs/:id", () => {
  test("updates and returns changes count", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const res = await request(app)
      .put("/jobs/1")
      .send({ ...baseJob, salary: 150000 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("updated", 1);
  });

  test("clears current jobs first when is_current_job = 1", async () => {
    db.run
      .mockImplementationOnce((sql, params, cb) => cb(null))
      .mockImplementationOnce(function (sql, params, cb) {
        cb.call({ changes: 1 }, null);
      });

    const res = await request(app)
      .put("/jobs/1")
      .send({ ...baseJob, is_current_job: 1 });

    expect(res.statusCode).toBe(200);
    const firstSql = db.run.mock.calls[0][0];
    expect(firstSql).toMatch(/UPDATE jobs SET is_current_job = 0/i);
  });

  test("returns 404 when job does not exist", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 0 }, null);
    });

    const res = await request(app).put("/jobs/999").send(baseJob);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test("returns 500 on DB error", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("update failed"));
    });

    const res = await request(app).put("/jobs/1").send(baseJob);

    expect(res.statusCode).toBe(500);
  });
});

// ─── PUT /jobs/clear-current ──────────────────────────────────────────────────
describe("PUT /jobs/clear-current", () => {
  test("clears all current jobs and returns message", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 2 }, null);
    });

    const res = await request(app).put("/jobs/clear-current");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("returns 500 on DB error", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("lock error"));
    });

    const res = await request(app).put("/jobs/clear-current");

    expect(res.statusCode).toBe(500);
  });
});

// ─── DELETE /jobs/:id ─────────────────────────────────────────────────────────
describe("DELETE /jobs/:id", () => {
  test("deletes job and returns deleted count", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const res = await request(app).delete("/jobs/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("deleted", 1);
  });

  test("returns 404 when job does not exist", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 0 }, null);
    });

    const res = await request(app).delete("/jobs/999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test("returns 500 on DB error", async () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("delete failed"));
    });

    const res = await request(app).delete("/jobs/1");

    expect(res.statusCode).toBe(500);
  });
});
