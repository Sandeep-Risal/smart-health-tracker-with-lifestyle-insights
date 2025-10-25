"use client";
import useUsers from "@/src/hooks/users/useUsers.hook";
import { DataTable } from "@/src/shared/components/data-table";
import DataTablePagination from "@/src/shared/components/data-table/data-table-pagination";
import React from "react";

const UsersComponent = () => {
  const { users, usersLoading, columns, page, setPage, limit, setLimit } =
    useUsers();
  return usersLoading ? (
    // <TableSkeleton />
    <p>Loading...</p>
  ) : (
    <>
      <DataTable data={users?.data?.data || []} columns={columns} />
      <DataTablePagination
        currentPage={page}
        totalPages={users?.data?.pagination?.totalPages || 0}
        setPage={setPage}
        setLimit={setLimit}
      />
    </>
  );
};

export default UsersComponent;
