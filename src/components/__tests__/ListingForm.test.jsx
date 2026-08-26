import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import ListingForm from "../ListingForm";

describe("ListingForm", () => {
  it("shows a validation error when the title is under 3 characters", async () => {
    const user = userEvent.setup();
    render(<ListingForm editingListing={null} onSubmit={() => {}} submitting={false} serverFieldErrors={{}} />);

    await user.type(screen.getByLabelText(/title/i), "Ab");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(
      await screen.findByText(/Title must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it("shows a validation error when the description is too short", async () => {
    const user = userEvent.setup();
    render(<ListingForm editingListing={null} onSubmit={() => {}} submitting={false} serverFieldErrors={{}} />);

    await user.type(screen.getByLabelText(/title/i), "A Real Title");
    await user.type(screen.getByLabelText(/description/i), "too short");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(
      await screen.findByText(/Description must be at least 10 characters/i)
    ).toBeInTheDocument();
  });
});