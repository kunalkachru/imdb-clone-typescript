import { describe, expect, it } from "vitest";
import { loginUser, registerUser } from "../../services/auth";

describe("auth service", () => {
  it("logs in seeded users", async () => {
    const response = await loginUser({
      email: "john@example.com",
      password: "password123",
    });

    expect(response.user.email).toBe("john@example.com");
    expect(response.token).toBeTruthy();
  });

  it("rejects invalid credentials", async () => {
    await expect(
      loginUser({ email: "john@example.com", password: "wrong" }),
    ).rejects.toThrow("Invalid email or password");
  });

  it("registers a new user and rejects duplicate email", async () => {
    const response = await registerUser({
      name: "New User",
      email: "new@example.com",
      password: "password123",
    });

    expect(response.user.email).toBe("new@example.com");

    await expect(
      registerUser({
        name: "New User",
        email: "new@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("Email already registered");
  });
});
