"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> =
  | {
      key: keyof T; // kolom data asli
      header: string;
      className?: string;
      render?: (item: T, index: number) => React.ReactNode;
    }
  | {
      key: string; // kolom dummy (misal "index")
      header: string;
      className?: string;
      render: (item: T, index: number) => React.ReactNode; // wajib ada render
    };

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  caption,
  className,
}: DataTableProps<T>) {
  return (
    <Table className={className}>
      {caption && (
        <caption className="text-left text-sm text-stone-500 mb-2">
          {caption}
        </caption>
      )}
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center text-stone-400 py-6"
            >
              No data available.
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, idx) => (
            <TableRow key={idx} className="hover:bg-zinc-800 transition-colors">
              {columns.map((col, i) => (
                <TableCell key={i} className={col.className}>
                  {col.render ? col.render(row, idx) : (row as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
