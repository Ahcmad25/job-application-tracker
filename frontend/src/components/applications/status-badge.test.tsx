import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("displays the applied label", () => {
    render(<StatusBadge status="APPLIED" />);

    expect(screen.getByText("Applied")).toBeInTheDocument();
  });

  it("displays the interview label", () => {
    render(<StatusBadge status="INTERVIEW" />);

    expect(
      screen.getByText("Interview"),
    ).toBeInTheDocument();
  });

  it("displays the rejected label", () => {
    render(<StatusBadge status="REJECTED" />);

    expect(
      screen.getByText("Rejected"),
    ).toBeInTheDocument();
  });
});