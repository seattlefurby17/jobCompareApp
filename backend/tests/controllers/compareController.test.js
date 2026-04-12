const { compareJobs } = require("../../controllers/compareController");

// ─── Mock the db module ───────────────────────────────────────────────────────
jest.mock("../../db/db", () => ({
  get: jest.fn(),
}));

const db = require("../../db/db");

// ─── Shared fixtures ──────────────────────────────────────────────────────────
const defaultSettings = {
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
  title: "Engineer A",
  salary: 100000,
  bonus: 10000,
  stock_options: 5000,
  wellness_stipend: 1000,
  life_insurance: 500,
  personal_dev_fund: 500,
  cost_of_living_index: 100,
};

const jobB = {
  id: 2,
  title: "Engineer B",
  salary: 80000,
  bonus: 5000,
  stock_options: 2000,
  wellness_stipend: 500,
  life_insurance: 200,
  personal_dev_fund: 200,
  cost_of_living_index: 80,
};

// Helper: set up db.get to respond in order: settings → job1 → job2
function mockDbSequence(settings, job1, job2) {
  db.get
    .mockImplementationOnce((sql, params, cb) => cb(null, settings))  // settings
    .mockImplementationOnce((sql, params, cb) => cb(null, job1))       // job1
    .mockImplementationOnce((sql, params, cb) => cb(null, job2));      // job2
}

// Helper: build a minimal req/res pair
function makeReqRes(body = {}) {
  const req = { body };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
}

// ─── Unit tests: calculateScore (tested indirectly via compareJobs) ───────────
describe("calculateScore (via compareJobs)", () => {
  beforeEach(() => jest.clearAllMocks());

  test("higher salary job wins with equal weights", () => {
    mockDbSequence(defaultSettings, jobA, jobB);
    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });

    compareJobs(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        winner: expect.objectContaining({ id: 1 }),
      })
    );
  });

  test("COL index of 0 or missing results in colScore of 0 (no divide-by-zero)", () => {
    const jobNoCOL = { ...jobA, cost_of_living_index: 0 };
    mockDbSequence(defaultSettings, jobNoCOL, jobB);
    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });

    compareJobs(req, res);

    // Should still resolve without crashing
    expect(res.json).toHaveBeenCalled();
    const result = res.json.mock.calls[0][0];
    expect(result).toHaveProperty("job1");
    expect(result).toHaveProperty("job2");
  });

  test("null/missing compensation fields default to 0", () => {
    const sparseJob = { id: 3, title: "Sparse", salary: 50000 }; // no bonus, stock, etc.
    mockDbSequence(defaultSettings, sparseJob, jobB);
    const { req, res } = makeReqRes({ job1_id: 3, job2_id: 2 });

    compareJobs(req, res);

    expect(res.json).toHaveBeenCalled();
    const { job1 } = res.json.mock.calls[0][0];
    expect(job1.score).toBeDefined();
    expect(typeof job1.score).toBe("number");
  });

  test("scores are attached to both jobs in the response", () => {
    mockDbSequence(defaultSettings, jobA, jobB);
    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });

    compareJobs(req, res);

    const { job1, job2 } = res.json.mock.calls[0][0];
    expect(job1).toHaveProperty("score");
    expect(job2).toHaveProperty("score");
    expect(typeof job1.score).toBe("number");
    expect(typeof job2.score).toBe("number");
  });

  test("winner is job2 when it scores higher", () => {
    const richJobB = { ...jobB, salary: 200000 };
    mockDbSequence(defaultSettings, jobA, richJobB);
    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });

    compareJobs(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        winner: expect.objectContaining({ id: 2 }),
      })
    );
  });

  test("job1 wins on a tie (score1 >= score2)", () => {
    const identicalJob = { ...jobA, id: 2 };
    mockDbSequence(defaultSettings, jobA, identicalJob);
    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });

    compareJobs(req, res);

    const { winner } = res.json.mock.calls[0][0];
    expect(winner.id).toBe(1);
  });

  test("salary_weight of 0 removes salary from score", () => {
    const noSalaryWeight = { ...defaultSettings, salary_weight: 0 };
    // jobA: bonus(10k)+stock(5k)+wellness(1k)+life(500)+pdf(500)+COL(1/110) = 17000.009
    // jobB: bonus(5k)+stock(2k)+wellness(500)+life(200)+pdf(200)+COL(1/80)  =  7900.013
    // jobA still wins without salary — its non-salary benefits are higher
    mockDbSequence(noSalaryWeight, jobA, jobB);
    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });

    compareJobs(req, res);

    const { job1, job2 } = res.json.mock.calls[0][0];
    expect(job1.score).toBeGreaterThan(job2.score);

    // Sanity check: salary is excluded — job1 score should be much less than with salary
    mockDbSequence(defaultSettings, jobA, jobB);
    const { req: req2, res: res2 } = makeReqRes({ job1_id: 1, job2_id: 2 });
    compareJobs(req2, res2);
    const withSalary = res2.json.mock.calls[0][0].job1.score;
    expect(withSalary).toBeGreaterThan(job1.score);
  });
});

// ─── Unit tests: input validation ────────────────────────────────────────────
describe("compareJobs — input validation", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns 400 when both job IDs are missing", () => {
    const { req, res } = makeReqRes({});
    compareJobs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Two job IDs required" });
  });

  test("returns 400 when job1_id is missing", () => {
    const { req, res } = makeReqRes({ job2_id: 2 });
    compareJobs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 when job2_id is missing", () => {
    const { req, res } = makeReqRes({ job1_id: 1 });
    compareJobs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── Unit tests: database error paths ────────────────────────────────────────
describe("compareJobs — database errors", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns 500 on settings DB error", () => {
    db.get.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("DB error"), null)
    );
    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });

    compareJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("returns 404 when job1 is not found", () => {
    db.get
      .mockImplementationOnce((sql, params, cb) => cb(null, defaultSettings))
      .mockImplementationOnce((sql, params, cb) => cb(null, null)); // job1 not found

    const { req, res } = makeReqRes({ job1_id: 999, job2_id: 2 });
    compareJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Job 1 not found" });
  });

  test("returns 404 when job2 is not found", () => {
    db.get
      .mockImplementationOnce((sql, params, cb) => cb(null, defaultSettings))
      .mockImplementationOnce((sql, params, cb) => cb(null, jobA))
      .mockImplementationOnce((sql, params, cb) => cb(null, null)); // job2 not found

    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 999 });
    compareJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Job 2 not found" });
  });

  test("returns 500 on job1 DB error", () => {
    db.get
      .mockImplementationOnce((sql, params, cb) => cb(null, defaultSettings))
      .mockImplementationOnce((sql, params, cb) =>
        cb(new Error("DB error"), null)
      );

    const { req, res } = makeReqRes({ job1_id: 1, job2_id: 2 });
    compareJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
