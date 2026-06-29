"use client";

import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";

export function OrderTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
