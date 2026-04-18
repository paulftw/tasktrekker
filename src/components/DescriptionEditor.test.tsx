import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RelayEnvironmentProvider } from "react-relay";
import { createMockEnvironment } from "relay-test-utils";
import { describe, expect, it } from "vitest";
import { DescriptionEditor } from "./DescriptionEditor";

// Invariant: saving commits DescriptionEditorUpdateMutation with
// { number, description }. Cmd+Enter is the save key (plain Enter is a newline
// in a textarea). Empty description is valid; over-long is not.

function renderEditor(props: {
  nodeId?: string;
  number?: number;
  description?: string;
}) {
  const environment = createMockEnvironment();
  render(
    <RelayEnvironmentProvider environment={environment}>
      <DescriptionEditor
        nodeId={props.nodeId ?? "issues:1"}
        number={props.number ?? 7}
        description={props.description ?? "Original body"}
      />
    </RelayEnvironmentProvider>,
  );
  return environment;
}

describe("DescriptionEditor", () => {
  it("commits the mutation with the new description on Cmd+Enter", async () => {
    const environment = renderEditor({});
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit description/i }));
    const textarea = screen.getByRole("textbox", { name: /description/i });
    await user.clear(textarea);
    await user.type(textarea, "Updated body");
    await user.keyboard("{Meta>}{Enter}{/Meta}");

    const op = environment.mock.getMostRecentOperation();
    expect(op.fragment.node.name).toBe("DescriptionEditorUpdateMutation");
    expect(op.request.variables).toEqual({
      number: 7,
      description: "Updated body",
    });
  });

  it("allows clearing to an empty description", async () => {
    const environment = renderEditor({ description: "had content" });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit description/i }));
    const textarea = screen.getByRole("textbox", { name: /description/i });
    await user.clear(textarea);
    await user.keyboard("{Meta>}{Enter}{/Meta}");

    const op = environment.mock.getMostRecentOperation();
    expect(op.request.variables).toEqual({ number: 7, description: "" });
  });

  it("does not commit when the description is unchanged", async () => {
    const environment = renderEditor({ description: "Same" });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit description/i }));
    await user.keyboard("{Meta>}{Enter}{/Meta}");

    expect(environment.mock.getAllOperations()).toHaveLength(0);
  });

  it("cancels edit on Escape without committing", async () => {
    const environment = renderEditor({ description: "Original" });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit description/i }));
    const textarea = screen.getByRole("textbox", { name: /description/i });
    await user.clear(textarea);
    await user.type(textarea, "Abandoned");
    await user.keyboard("{Escape}");

    expect(environment.mock.getAllOperations()).toHaveLength(0);
  });
});
