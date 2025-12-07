"use client";
import React from "react";

import useLog from "@/src/hooks/logs/useLogComponent";
import { DataTable } from "@/src/shared/components/data-table";
import DataTablePagination from "@/src/shared/components/data-table/data-table-pagination";
import { Button } from "@/src/shared/components/ui/button";
import { Add } from "iconsax-react";
import { useRouter } from "next/navigation";

const LogsComponent = () => {
  const router = useRouter();
  const { columns, isLoading, logData } = useLog();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Logs</h1>
          <p className="text-sm text-gray-500">Get your daily logs data.</p>
        </div>
        <Button onClick={() => router.push("/logs/add")}>
          <Add color="white" size={40} />
          Add Logs
        </Button>
      </div>

      <>
        <DataTable
          data={logData || []}
          border
          loading={isLoading}
          loadingDataNum={10}
          columns={columns}
          height="max-h-[calc(100vh-300px)]"
          headerSticky
        />
        <DataTablePagination
          currentPage={1}
          totalPages={1}
          setPage={() => {}}
          setLimit={() => {}}
        />
      </>
    </>
  );
};

export default LogsComponent;
