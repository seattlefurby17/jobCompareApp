const { getSettings, updateSettings } = require("../../controllers/settingsController");

jest.mock("../../db/db", () => ({ get: jest.fn(), run: jest.fn() }));
jest.mock("../../db/init", () => {});

const db = require("../../db/db");

function makeRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn() };
}

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

// ─── getSettings ──────────────────────────────────────────────────────────────
describe("getSettings", () => {
  test("returns the settings row", () => {
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, defaultSettings));

    const res = makeRes();
    getSettings({}, res);

    expect(res.json).toHaveBeenCalledWith(defaultSettings);
  });

  test("returns 500 on DB error", () => {
    db.get.mockImplementationOnce((sql, params, cb) =>
      cb(new Error("db error"), null)
    );

    const res = makeRes();
    getSettings({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "db error" });
  });

  test("only fetches one row (LIMIT 1)", () => {
    db.get.mockImplementationOnce((sql, params, cb) => cb(null, defaultSettings));

    getSettings({}, makeRes());

    const [sql] = db.get.mock.calls[0];
    expect(sql).toMatch(/LIMIT 1/i);
  });
});

// ─── updateSettings ───────────────────────────────────────────────────────────
describe("updateSettings", () => {
  test("updates settings and returns changes count", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const req = { body: { ...defaultSettings } };
    const res = makeRes();
    updateSettings(req, res);

    expect(res.json).toHaveBeenCalledWith({ updated: 1 });
  });

  test("always targets id = 1 (single settings row)", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    updateSettings({ body: { ...defaultSettings } }, makeRes());

    const [sql] = db.run.mock.calls[0];
    expect(sql).toMatch(/WHERE id = 1/i);
  });

  test("sends all 7 weight fields as params", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const weights = {
      salary_weight: 2,
      bonus_weight: 3,
      stock_weight: 1.5,
      wellness_weight: 0.5,
      life_insurance_weight: 1,
      pdf_weight: 0,
      col_weight: 2,
    };

    updateSettings({ body: weights }, makeRes());

    const [, params] = db.run.mock.calls[0];
    expect(params).toEqual([2, 3, 1.5, 0.5, 1, 0, 2]);
  });

  test("returns 500 on DB error", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({}, new Error("update failed"));
    });

    const res = makeRes();
    updateSettings({ body: { ...defaultSettings } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "update failed" });
  });

  test("weight of 0 is valid and passed correctly", () => {
    db.run.mockImplementationOnce(function (sql, params, cb) {
      cb.call({ changes: 1 }, null);
    });

    const allZero = {
      salary_weight: 0,
      bonus_weight: 0,
      stock_weight: 0,
      wellness_weight: 0,
      life_insurance_weight: 0,
      pdf_weight: 0,
      col_weight: 0,
    };

    updateSettings({ body: allZero }, makeRes());

    const [, params] = db.run.mock.calls[0];
    expect(params).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });
});
