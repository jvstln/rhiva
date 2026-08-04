"use client";

import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";

type TableClassNames = Partial<
  Record<
    | "root"
    | "table"
    | "thead"
    | "tbody"
    | "tfoot"
    | "caption"
    | "trh"
    | "tr"
    | "th"
    | "td",
    string
  >
>;

interface DataTableProps<TData> {
  table: ReturnType<typeof useDataTable<TData>>;
  classNames?: TableClassNames;
  variant?: keyof typeof variants;
  caption?: string;
  colgroup?: React.ReactNode;
}

const variants = {
  default: {
    table: cn("w-full border-collapse text-left"),
    th: cn(
      "relative h-10 align-middle font-semibold text-muted-foreground text-xs capitalize tracking-wider",
      "border-border/40 border-b bg-transparent px-4 text-left",
    ),
    tr: cn(
      "h-14 border-border/20 border-b transition-colors last:border-0 hover:bg-muted",
    ),
    td: cn("px-4 py-3 align-middle text-sm text-white"),
  },
  compact: {
    table: cn("w-full border-collapse text-left"),
    th: cn(
      "relative h-8 align-middle font-semibold text-muted-foreground text-xs capitalize tracking-wider",
      "border-border/40 border-b bg-transparent px-2 text-left",
    ),
    tr: cn(
      "h-10 border-border/20 border-b transition-colors last:border-0 hover:bg-muted/5",
    ),
    td: cn("px-2 py-2 align-middle text-white text-xs"),
  },
} satisfies Record<string, TableClassNames>;

export function useDataTable<TData>(
  options: Omit<TableOptions<TData>, "getCoreRowModel">,
) {
  const table = useReactTable({
    columnResizeMode: "onChange",
    enableColumnResizing: false,
    defaultColumn: {
      size: 9999,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...options,
  });

  return table;
}

export function DataTable<TData>({
  table,
  classNames: _classNames = {},
  variant = "default",
  caption,
  colgroup,
}: DataTableProps<TData>) {
  const tableRef = React.useRef<HTMLTableElement>(null);

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: table sizing state triggers calculation
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: string } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (!header) continue;
      if (header.getSize() === 9999) continue;
      colSizes[`--header-${header.id}-size`] = `${header.getSize()}px`;
      colSizes[`--col-${header.column.id}-size`] =
        `${header.column.getSize()}px`;
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  // Function to calculate the maximum content width for a column
  const autoSizeColumn = (columnId: string) => {
    if (!tableRef.current) return;

    const column = table.getColumn(columnId);
    if (!column) return;

    // Get all cells for this column (including header)
    const cells = tableRef.current.querySelectorAll(
      `[data-column-id="${columnId}"]`,
    );

    let maxWidth = 0;

    cells.forEach((cell) => {
      // Create a temporary element to measure content
      const tempEl = document.createElement("span");
      tempEl.style.visibility = "hidden";
      tempEl.style.position = "absolute";
      tempEl.style.whiteSpace = "nowrap";
      tempEl.textContent = cell.textContent || "";

      // Copy relevant styles
      const styles = window.getComputedStyle(cell);
      tempEl.style.font = styles.font;
      tempEl.style.fontSize = styles.fontSize;
      tempEl.style.fontWeight = styles.fontWeight;
      tempEl.style.padding = styles.padding;

      document.body.appendChild(tempEl);
      const width = tempEl.offsetWidth;
      document.body.removeChild(tempEl);

      maxWidth = Math.max(maxWidth, width);
    });

    // Add some padding
    const finalWidth = maxWidth + 32; // Add extra padding

    // Set the column size
    column.resetSize();
    table.setColumnSizing((old) => ({
      ...old,
      [columnId]: finalWidth,
    }));
  };

  // Merge classNames with specified variant
  const classNames = Object.entries(variants[variant]).reduce(
    (acc, [key, value]) => {
      acc[key as keyof typeof _classNames] = cn(
        value,
        _classNames?.[key as keyof typeof _classNames],
      );
      return acc;
    },
    {} as typeof _classNames,
  );

  return (
    <ScrollArea className={cn("w-full min-w-0 space-y-4", classNames.root)}>
      <Table
        ref={tableRef}
        className={cn(classNames.table)}
        style={{
          ...columnSizeVars,
        }}
      >
        {caption && (
          <caption className={cn(classNames.caption)}>{caption}</caption>
        )}
        {colgroup}
        <TableHeader className={cn(classNames.thead)}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn(
                classNames.trh,
                "border-border/40 border-b hover:bg-transparent",
              )}
              data-header-id={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort();
                return (
                  <TableHead
                    key={header.id}
                    data-header-id={header.id}
                    data-column-id={header.column.id}
                    className={cn(
                      isSortable && "cursor-pointer select-none",
                      classNames.th,
                    )}
                    style={{
                      width: `var(--header-${header?.id}-size)`,
                    }}
                    onClick={() => {
                      if (!isSortable || header.column.getIsResizing()) return;
                      if (header.column.getIsSorted() === "desc") {
                        header.column.clearSorting();
                      } else {
                        header.column.toggleSorting();
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {/* Sortable indicator */}
                      {isSortable &&
                        (header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="inline size-3.5 shrink-0 text-primary" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="inline size-3.5 shrink-0 text-primary" />
                        ) : (
                          <ArrowUpDown className="inline size-3.5 shrink-0 text-muted-foreground/60" />
                        ))}
                      {/* Resize handle */}
                      {header.column.getCanResize() && (
                        // biome-ignore lint/a11y/noStaticElementInteractions: Resize handle is a standard React Table mouse-drag wrapper
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => autoSizeColumn(header.column.id)}
                          className={cn(
                            "absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none bg-gray-300 opacity-0 hover:opacity-100",
                            header.column.getIsResizing() &&
                              "bg-primary opacity-100",
                          )}
                          data-slot="resize-handle"
                        />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.map((row) => (
            <TableRow
              key={row.id}
              className={cn(classNames.tr)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(classNames.td)}
                  style={{
                    width: `var(--col-${cell.column.id}-size)`,
                  }}
                  data-column-id={cell.column.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {table.getRowModel().rows?.length === 0 && (
        <div
          className={cn(
            "flex h-32 items-center justify-center rounded-lg border border-border/20 bg-muted/20",
          )}
        >
          <div className="text-muted-foreground text-sm">No data available</div>
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
