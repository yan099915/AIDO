const request = require("supertest");
const app = require("./app");

describe("POST /todos", () => {
  //   beforeEach(() => {
  //     app.resetTodos(); // reset
  //   });

  it("buat todo", async () => {
    const res = await request(app).post("/todos").send({
      title: "Belajar testing",
      status: "pending",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Belajar testing");
    expect(res.body.data.status).toBe("pending");
  });

  it("gagal title missing", async () => {
    const res = await request(app).post("/todos").send({
      status: "pending",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Title is required");
  });

  it("gagal todo status invalid", async () => {
    const res = await request(app).post("/todos").send({
      title: "Belajar testing",
      status: "donee",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid status");
  });
});
