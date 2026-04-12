const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  clearCurrentJobs,
} = require("../../controllers/jobsController");

jest.mock("../../db/db", () => ({
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn(),
}));
jest.mock("../../db/init", () => {});

const db = require("../../db/db");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRes() {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  return res;
}

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

// ─── createJob ────────────────────────────────────────────────────────────────
describe("createJob", () => {
  test("inserts job and returns lastID when is_current_job = 0", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ lastID: 42 }, null);
    });

    const req = { body: { ...baseJob } };
    const res = makeRes();

    createJob(req, res);

    expect(db.run).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ jobId: 42 });
  });

  test("clears current jobs first when is_current_job = 1", () => {
    // First call: clearCurrentJobs UPDATE, second call: INSERT
    db.run
      .mockImplementationOnce((sql, params, cb) => cb(null))
      .mockImplementationOnce(function (sql, params, cb) {
        cb.call({ lastID: 7 }, null);
      });

    const req = { body: { ...baseJob, is_current_job: 1 } };
    const res = makeRes();

    createJob(req, res);

    expect(db.run).toHaveBeenCalledTimes(2);
    const [firstSql] = db.run.mock.calls[0];
    expect(firstSql).toMatch(/UPDATE jobs SET is_current_job = 0/i);
    expect(res.json).toHaveBeenCalledWith({ jobId: 7 });
  });

  test("returns 500 if clearCurrentJobs fails", () => {
    db.run.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("clear failed"))
    );

    const req = { body: { ...baseJob, is_current_job: 1 } };
    const res = makeRes();

    createJob(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "clear failed" });
  });

  test("returns 500 if INSERT fails", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("insert failed"));
    });

    const req = { body: { ...baseJob } };
    const res = makeRes();

    createJob(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "insert failed" });
  });
});

// ─── getAllJobs ───────────────────────────────────────────────────────────────
describe("getAllJobs", () => {
  test("returns all rows on success", () => {
    const rows = [{ id: 1, ...baseJob }, { id: 2, ...baseJob }];
    db.all.mockImplementationOnce((sql, params, cb) => cb(null, rows));

    const req = {};
    const res = makeRes();

    getAllJobs(req, res);

    expect(res.json).toHaveBeenCalledWith(rows);
  });

  test("returns empty array when no jobs exist", () => {
    db.all.mockImplementationOnce((sql, params, cb) => cb(null, []));

    const req = {};
    const res = makeRes();

    getAllJobs(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  test("returns 500 on DB error", () => {
    db.all.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("query failed"), null)
    );

    const req = {};
    const res = makeRes();

    getAllJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── getJobById ───────────────────────────────────────────────────────────────
describe("getJobById", () => {
  test("returns job when found", () => {
    const row = { id: 1, ...baseJob };
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, row));

    const req = { params: { id: "1" } };
    const res = makeRes();

    getJobById(req, res);

    expect(res.json).toHaveBeenCalledWith(row);
  });

  test("returns 404 when job not found", () => {
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, null));

    const req = { params: { id: "999" } };
    const res = makeRes();

    getJobById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Job not found" });
  });

  test("returns 500 on DB error", () => {
    db.get.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("lookup failed"), null)
    );

    const req = { params: { id: "1" } };
    const res = makeRes();

    getJobById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── updateJob ────────────────────────────────────────────────────────────────
describe("updateJob", () => {
  test("updates job and returns changes count", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const req = { params: { id: "1" }, body: { ...baseJob } };
    const res = makeRes();

    updateJob(req, res);

    expect(res.json).toHaveBeenCalledWith({ updated: 1 });
  });

  test("clears current jobs first when is_current_job = 1", () => {
    db.run
      .mockImplementationOnce((sql, params, cb) => cb(null))
      .mockImplementationOnce(function (sql, params, cb) {
        cb.call({ changes: 1 }, null);
      });

    const req = { params: { id: "1" }, body: { ...baseJob, is_current_job: 1 } };
    const res = makeRes();

    updateJob(req, res);

    expect(db.run).toHaveBeenCalledTimes(2);
    const [firstSql] = db.run.mock.calls[0];
    expect(firstSql).toMatch(/UPDATE jobs SET is_current_job = 0/i);
  });

  test("returns 404 when no rows matched (changes = 0)", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 0 }, null);
    });

    const req = { params: { id: "999" }, body: { ...baseJob } };
    const res = makeRes();

    updateJob(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Job not found" });
  });

  test("returns 500 if clearCurrentJobs fails", () => {
    db.run.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("clear failed"))
    );

    const req = { params: { id: "1" }, body: { ...baseJob, is_current_job: 1 } };
    const res = makeRes();

    updateJob(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("returns 500 if UPDATE fails", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("update failed"));
    });

    const req = { params: { id: "1" }, body: { ...baseJob } };
    const res = makeRes();

    updateJob(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── deleteJob ────────────────────────────────────────────────────────────────
describe("deleteJob", () => {
  test("deletes job and returns changes count", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const req = { params: { id: "1" } };
    const res = makeRes();

    deleteJob(req, res);

    expect(res.json).toHaveBeenCalledWith({ deleted: 1 });
  });

  test("returns 404 when job not found (changes = 0)", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 0 }, null);
    });

    const req = { params: { id: "999" } };
    const res = makeRes();

    deleteJob(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Job not found" });
  });

  test("returns 500 on DB error", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("delete failed"));
    });

    const req = { params: { id: "1" } };
    const res = makeRes();

    deleteJob(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── clearCurrentJobs (route handler) ────────────────────────────────────────
describe("clearCurrentJobs (route handler)", () => {
  test("returns success message on clear", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 3 }, null);
    });

    const req = {};
    const res = makeRes();

    clearCurrentJobs(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "All current jobs cleared",
    });
  });

  test("returns 500 on DB error", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("clear failed"));
    });

    const req = {};
    const res = makeRes();

    clearCurrentJobs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
