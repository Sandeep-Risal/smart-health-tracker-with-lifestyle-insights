import { ILogDetails } from "@/src/features/logs/interfaces/logs-interface";
import { getLogs } from "@/src/features/logs/services";
import SerialNumberCell from "@/src/shared/components/data-table/column-serial-number";
import { Button } from "@/src/shared/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "iconsax-react";
import moment from "moment";
import { useQuery } from "react-query";

const useLog = () => {
  const { data, isLoading } = useQuery({
    queryFn: () => getLogs(),
    queryKey: ["getLogs"],
  });

  const columns: ColumnDef<ILogDetails>[] = [
    {
      header: "S.N",
      cell: ({ row }) => {
        return <SerialNumberCell row={row} pageNumber={1} perPage={50} />;
      },
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }: any) => {
        return <>{moment(row.original.date).format("MMM DD, YYYY")}</>;
      },
    },
    {
      header: "Energy",
      accessorKey: "energy_level",
    },
    {
      header: "Calories",
      accessorKey: "calories",
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
              onClick={() => console.log(rowData?.log_id)}
            >
              <Eye size={20} color="#000" />
            </Button>
          </div>
        );
      },
    },
  ];
  return {
    logData: data?.data?.data,
    isLoading,
    columns,
  };
};

export default useLog;
