import { Eye } from "iconsax-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { ILogDetails } from "@/src/features/logs/interfaces/logs-interface";
import { getInsights, getLogs } from "@/src/features/logs/services";
import SerialNumberCell from "@/src/shared/components/data-table/column-serial-number";
import { Button } from "@/src/shared/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams, useRouter } from "next/navigation";

const useLog = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openAfterAddModal, setOpenAfterAddModal] = useState<boolean>(false);
  const [logDayData, setLogDayData] = useState<ILogDetails>();
  const [insDate, setInsDate] = useState<string>("");

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
              onClick={() => {
                setOpenViewModal(true);
                triggerIns(rowData);
                setInsDate(rowData?.date);
              }}
            >
              <Eye size={20} color="#000" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Insight api
  const closeAfterAddModal = () => {
    setOpenAfterAddModal(false);
    router.replace("/logs");
  };
  const { data: insightData, isLoading: insightLoading } = useQuery<any>({
    queryFn: () => {
      return insDate && getInsights(insDate);
    },
    queryKey: ["getInsights", insDate],
  });

  const onModalChange = () => {
    setOpenViewModal(false);
    setLogDayData(undefined);
  };
  const triggerIns = (data: ILogDetails) => {
    setLogDayData(data);
  };

  useEffect(() => {
    if (params && params.get("date")) {
      setInsDate(params.get("date")!);
      setOpenAfterAddModal(true);
    } else if (logDayData) {
      setInsDate(logDayData?.date);
    }
  }, [params, logDayData]);

  return {
    logData: data?.data?.data,
    isLoading,
    columns,
    openViewModal,
    onModalChange,
    logDayData,
    triggerIns,
    insightData: insightData?.data?.data[0],
    insightLoading,
    openAfterAddModal,
    closeAfterAddModal,
  };
};

export default useLog;
