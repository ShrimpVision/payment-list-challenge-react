import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import { DataTable, type DataTableColumn } from "./DataTable";

type User = {
  id: string;
  name: string;
  active: boolean;
};

const users: User[] = [
  { id: "user-1", name: "Ada Lovelace", active: true },
  { id: "user-2", name: "Grace Hopper", active: false },
];

const columns: DataTableColumn<User>[] = [
  {
    id: "name",
    header: "Name",
    cell: (user) => user.name,
  },
  {
    id: "status",
    header: "Status",
    cell: (user) => (user.active ? "Active" : "Inactive"),
  },
];

const renderTable = (overrides: Partial<React.ComponentProps<typeof DataTable<User>>> = {}) =>
  render(
    <DataTable
      columns={columns}
      data={users}
      emptyMessage="No users found"
      getRowKey={(user) => user.id}
      {...overrides}
    />,
  );

describe("DataTable", () => {
  test("renders supplied headers and custom cell content", () => {
    renderTable();

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  test("renders the empty message when no rows are supplied", () => {
    renderTable({ data: [] });

    expect(screen.getByText("No users found")).toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  test("renders a loading state instead of rows or the empty message", () => {
    renderTable({ data: [], isLoading: true });

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(screen.queryByText("No users found")).not.toBeInTheDocument();
  });

  test("renders optional toolbar content above the table", () => {
    renderTable({ toolbar: <button type="button">Filter users</button> });

    expect(screen.getByRole("button", { name: "Filter users" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("keeps rows non-interactive without an onRowClick callback", () => {
    renderTable();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("calls onRowClick with the selected row when clicked", () => {
    const onRowClick = vi.fn();
    renderTable({ onRowClick });

    fireEvent.click(screen.getByRole("button", { name: /Ada Lovelace Active/i }));

    expect(onRowClick).toHaveBeenCalledOnce();
    expect(onRowClick).toHaveBeenCalledWith(users[0]);
  });

  test("supports Enter and Space for clickable rows", () => {
    const onRowClick = vi.fn();
    renderTable({ onRowClick });

    const row = screen.getByRole("button", { name: /Ada Lovelace Active/i });
    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: " " });
    fireEvent.keyDown(row, { key: "Escape" });

    expect(row).toHaveAttribute("tabindex", "0");
    expect(onRowClick).toHaveBeenCalledTimes(2);
    expect(onRowClick).toHaveBeenNthCalledWith(1, users[0]);
    expect(onRowClick).toHaveBeenNthCalledWith(2, users[0]);
  });
});
