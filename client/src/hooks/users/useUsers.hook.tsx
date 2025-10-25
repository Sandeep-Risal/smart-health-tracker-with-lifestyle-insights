import { getUsers } from "@/src/features/users/services";
import { IUserDetails } from "@/src/interfaces/users";
import SerialNumberCell from "@/src/shared/components/data-table/column-serial-number";
import { Button } from "@/src/shared/components/ui/button";
import { showToast } from "@/src/shared/lib/toast-utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "iconsax-react";
import { useState } from "react";
import { useQuery } from "react-query";

const useUsers = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryFn: () => getUsers(page, limit),
    queryKey: ["users", page, limit],
  });

  const columns: ColumnDef<IUserDetails>[] = [
    {
      header: "S.N",
      cell: ({ row }) => {
        return <SerialNumberCell row={row} pageNumber={page} perPage={limit} />;
      },
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Designation",
      accessorKey: "designation",
    },
    {
      header: "Emp ID",
      accessorKey: "empId",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const { original: rowData } = row;

        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => console.log(rowData?.id)}
            >
              <Eye size={20} color="#000" />
            </Button>
            <Button size="icon" variant="ghost">
              <Edit size={20} color="#000" />
            </Button>
            <Button size="icon" variant="ghost">
              <Trash size={20} color="#000" />
            </Button>
          </div>
        );
      },
    },
  ];

  return { users, usersLoading, page, setPage, limit, setLimit, columns };
};

export default useUsers;
