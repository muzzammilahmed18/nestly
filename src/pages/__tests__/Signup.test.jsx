import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Signup from "../Signup";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../context/ToastContext";

function renderSignup() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>
          <Signup />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Signup", () => {
  it("defaults to the Guest role and lets you switch to Host", async () => {
    const user = userEvent.setup();
    renderSignup();
    // Use regex to catch "Host", "Host a place", etc.
    const hostButton = screen.getByRole("button", { name: /host/i });
    await user.click(hostButton);
    
    // Looks for our new Sunset Orange theme!
    expect(hostButton.className).toMatch(/border-orange/);
  });

  it("shows an error when the password is under 8 characters", async () => {
    const user = userEvent.setup();
    renderSignup();
    
    await user.type(screen.getByLabelText(/name/i), "Test User");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "short");
    await user.type(screen.getByLabelText(/confirm/i), "short");
    
    // FIX: Look for the "Agree and continue" button!
    await user.click(screen.getByRole("button", { name: /agree/i }));
    
    expect(
      await screen.findByText(/Password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it("shows an error when the two passwords don't match", async () => {
    const user = userEvent.setup();
    renderSignup();
    
    await user.type(screen.getByLabelText(/name/i), "Test User");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.type(screen.getByLabelText(/confirm/i), "password456");
    
    // FIX: Look for the "Agree and continue" button!
    await user.click(screen.getByRole("button", { name: /agree/i }));
    
    expect(await screen.findByText(/Passwords don't match/i)).toBeInTheDocument();
  });
});