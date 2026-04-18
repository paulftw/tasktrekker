import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RelayEnvironmentProvider } from "react-relay";
import { createMockEnvironment } from "relay-test-utils";
import { describe, expect, it } from "vitest";
import { TitleEditor } from "./TitleEditor";

// Invariant: saving commits TitleEditorUpdateMutation with { number, title: <trimmed> }.
// Also pins the two "don't commit" branches the UI relies on: no mutation when
// the title is unchanged, and no mutation when the Zod schema rejects the input.

function renderEditor(props: {
  nodeId?: string;
  number?: number;
  title?: string;
}) {
  const environment = createMockEnvironment();
  render(
    <RelayEnvironmentProvider environment={environment}>
      <TitleEditor
        nodeId={props.nodeId ?? "issues:1"}
        number={props.number ?? 7}
        title={props.title ?? "Original"}
      />
    </RelayEnvironmentProvider>,
  );
  return environment;
}

describe("TitleEditor", () => {
  it("commits the mutation with the new title on Enter", async () => {
    const environment = renderEditor({});
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit title/i }));
    const input = screen.getByRole("textbox", { name: /title/i });
    await user.clear(input);
    await user.type(input, "Updated title{Enter}");

    const op = environment.mock.getMostRecentOperation();
    expect(op.fragment.node.name).toBe("TitleEditorUpdateMutation");
    expect(op.request.variables).toEqual({
      number: 7,
      title: "Updated title",
    });
  });

  it("trims whitespace before committing", async () => {
    const environment = renderEditor({});
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit title/i }));
    const input = screen.getByRole("textbox", { name: /title/i });
    await user.clear(input);
    await user.type(input, "  padded  {Enter}");

    const op = environment.mock.getMostRecentOperation();
    expect(op.request.variables).toEqual({ number: 7, title: "padded" });
  });

  it("commits the mutation on blur", async () => {
    const environment = renderEditor({});
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit title/i }));
    const input = screen.getByRole("textbox", { name: /title/i });
    await user.clear(input);
    await user.type(input, "Blurred title");
    await user.tab();

    const op = environment.mock.getMostRecentOperation();
    expect(op.request.variables).toEqual({
      number: 7,
      title: "Blurred title",
    });
  });

  it("does not commit when the title is unchanged", async () => {
    const environment = renderEditor({ title: "Same" });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit title/i }));
    await user.keyboard("{Enter}");

    expect(environment.mock.getAllOperations()).toHaveLength(0);
  });

  it("does not commit when the input is empty and shows a validation error", async () => {
    const environment = renderEditor({});
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit title/i }));
    const input = screen.getByRole("textbox", { name: /title/i });
    await user.clear(input);
    await user.keyboard("{Enter}");

    expect(environment.mock.getAllOperations()).toHaveLength(0);
    expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
  });

  it("cancels edit on Escape without committing", async () => {
    const environment = renderEditor({ title: "Original" });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit title/i }));
    const input = screen.getByRole("textbox", { name: /title/i });
    await user.clear(input);
    await user.type(input, "Abandoned");
    await user.keyboard("{Escape}");

    expect(environment.mock.getAllOperations()).toHaveLength(0);
    expect(screen.getByRole("button", { name: /edit title/i })).toHaveTextContent(
      "Original",
    );
  });
});
