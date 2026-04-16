const request = require("supertest");
const express = require("express");

// Mock the db module before requiring any routes
jest.mock("../../db/db", () => ({ get: jest.fn(), run: jest.fn() }));
jest.mock("../../db/init", () => {}); // skip table creation

const db = require("../../db/db");

// Build a minimal Express app (mirrors server.js) 
const app = express();
app.use(express.json());
app.use("/compare", require("../../routes/compare"));

// Shared settings
const settings = {
  salary_weight: 1,
  bonus_weight: 1,
  stock_weight: 1,
  wellness_weight: 1,
  life_insurance_weight: 1,
  pdf_weight: 1,
  col_weight: 1,
};

const jobA = {
  id: 1,
  title: "Senior Engineer",
  salary: 140000,
  bonus: 15000,
  stock_options: 10000,
  wellness_stipend: 1200,
  life_insurance: 800,
  personal_dev_fund: 1000,
  cost_of_living_index: 110,
};

const jobB = {
  id: 2,
  title: "Staff Engineer",
  salary: 120000,
  bonus: 20000,
  stock_options: 8000,
  wellness_stipend: 1500,
  life_insurance: 600,
  personal_dev_fund: 800,
  cost_of_living_index: 90,
};

function mockDbSequence(s, j1, j2) {
  db.get
    .mockImplementationOnce((sql, params, cb) => cb(null, s))
    .mockImplementationOnce((sql, params, cb) => cb(null, j1))
    .mockImplementationOnce((sql, params, cb) => cb(null, j2));
}

// Tests
describe("POST /compare — integration", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns winner and job data for valid IDs", async () => {
    mockDbSequence(settings, jobA, jobB);

    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 1, job2_id: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("winner");
    expect(res.body).toHaveProperty("job1");
    expect(res.body).toHaveProperty("job2");
  });

  test("returns a numeric score for the winner", async () => {
    mockDbSequence(settings, jobA, jobB);

    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 1, job2_id: 2 });

    expect(typeof res.body.winner.score).toBe("number");
  });

  test("winner.id matches the higher-scoring job", async () => {
    mockDbSequence(settings, jobA, jobB);

    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 1, job2_id: 2 });

    const { job1, job2, winner } = res.body;
    const expectedWinnerId = job1.score >= job2.score ? job1.id : job2.id;
    expect(winner.id).toBe(expectedWinnerId);
  });

  test("400 when body is empty", async () => {
    const res = await request(app).post("/compare").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("400 when only job1_id is provided", async () => {
    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 1 });

    expect(res.statusCode).toBe(400);
  });

  test("400 when only job2_id is provided", async () => {
    const res = await request(app)
      .post("/compare")
      .send({ job2_id: 2 });

    expect(res.statusCode).toBe(400);
  });

  test("404 when job1_id does not exist", async () => {
    db.get
      .mockImplementationOnce((sql, params, cb) => cb(null, settings))
      .mockImplementationOnce((sql, params, cb) => cb(null, null)); // not found

    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 999, job2_id: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/job 1 not found/i);
  });

  test("404 when job2_id does not exist", async () => {
    db.get
      .mockImplementationOnce((sql, params, cb) => cb(null, settings))
      .mockImplementationOnce((sql, params, cb) => cb(null, jobA))
      .mockImplementationOnce((sql, params, cb) => cb(null, null));

    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 1, job2_id: 999 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/job 2 not found/i);
  });

  test("500 when db.get throws on settings query", async () => {
    db.get.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("connection lost"), null)
    );

    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 1, job2_id: 2 });

    expect(res.statusCode).toBe(500);
  });

  test("response Content-Type is application/json", async () => {
    mockDbSequence(settings, jobA, jobB);

    const res = await request(app)
      .post("/compare")
      .send({ job1_id: 1, job2_id: 2 });

    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
