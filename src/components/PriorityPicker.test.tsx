import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RelayEnvironmentProvider } from "react-relay";
import { createMockEnvironment } from "relay-test-utils";
import { describe, expect, it } from "vitest";
import { PriorityPicker } from "./PriorityPicker";

// Invariant: selecting a priority commits PriorityPickerUpdateMutation with
// { number, priority: <chosen> } matching the clicked option. Pins the contract
// between PriorityPicker and the GraphQL mutation so the two can't drift silently.

describe("PriorityPicker", () => {
  it("commits the mutation with the chosen priority", async () => {
    const environment = createMockEnvironment();
    const user = userEvent.setup();

    render(
      <RelayEnvironmentProvider environment={environment}>
        <PriorityPicker nodeId="issues:1" number={7} priority="medium" />
      </RelayEnvironmentProvider>,
    );

    await user.click(screen.getByRole("button", { name: /priority: medium/i }));
    await user.click(screen.getByRole("menuitem", { name: /high/i }));

    const op = environment.mock.getMostRecentOperation();
    expect(op.fragment.node.name).toBe("PriorityPickerUpdateMutation");
    expect(op.request.variables).toEqual({ number: 7, priority: "high" });
  });

  it("does not commit when the selected priority equals the current one", async () => {
    const environment = createMockEnvironment();
    const user = userEvent.setup();

    render(
      <RelayEnvironmentProvider environment={environment}>
        <PriorityPicker nodeId="issues:1" number={7} priority="medium" />
      </RelayEnvironmentProvider>,
    );

    await user.click(screen.getByRole("button", { name: /priority: medium/i }));
    await user.click(screen.getByRole("menuitem", { name: /^medium$/i }));

    expect(environment.mock.getAllOperations()).toHaveLength(0);
  });
});
