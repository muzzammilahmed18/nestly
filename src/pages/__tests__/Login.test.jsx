import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Login from "../Login";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../context/ToastContext";

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>
          <Login />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Login", () => {
  it("renders the email field, password field, and submit button", () => {
    renderLogin();
    // UPDATED: Use bulletproof regex queries
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows field-specific errors when submitted empty", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole("button", { name: /log in/i }));
    
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });
});