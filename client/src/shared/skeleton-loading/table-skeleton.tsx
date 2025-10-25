import React from "react";

import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { TableCell } from "@/src/shared/components/ui/table";

const TableSkeleton = () => {
  return (
    <TableCell className="border-r-2 border-b-2 border-slate-100 last:border-r-0">
      <Skeleton className="w-[110px] h-3 mb-2" />
    </TableCell>
  );
};

export default TableSkeleton;
