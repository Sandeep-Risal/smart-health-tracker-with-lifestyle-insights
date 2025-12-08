"use client";
import { Add } from "iconsax-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";

import useLog from "@/src/hooks/logs/useLogComponent";
import { DataTable } from "@/src/shared/components/data-table";
import DataTablePagination from "@/src/shared/components/data-table/data-table-pagination";
import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";

import HappyImg from "@/public/happy.png";
import BadImg from "@/public/bad.png";
import NeutralImg from "@/public/neutral.png";
import Image from "next/image";
import { ILogDetails } from "./interfaces/logs-interface";

const LogsComponent = () => {
  const router = useRouter();
  const {
    columns,
    isLoading,
    logData,
    openViewModal,
    onModalChange,
    logDayData,
    insightData,
    insightLoading,
    openAfterAddModal,
    closeAfterAddModal,
  } = useLog();

  const showStatusImg = (status?: string) => {
    switch (status) {
      case "good":
        return (
          <Image
            src={HappyImg}
            alt="Happy Status"
            width={150}
            height={150}
            quality={100}
            className="m-auto"
          />
        );
      case "neutral":
        return (
          <Image
            src={NeutralImg}
            alt="Neutral Status"
            width={150}
            height={150}
            quality={100}
            className="m-auto"
          />
        );
      case "bad":
        return (
          <Image
            src={BadImg}
            alt="Sad Status"
            width={150}
            height={150}
            quality={100}
            className="m-auto"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Logs</h1>
          <p className="text-sm text-gray-500">Get your daily logs data.</p>
        </div>
        <Button
          onClick={() => router.push("/logs/add")}
          disabled={logData?.some((log: ILogDetails) =>
            moment(log.date).isSame(moment(), "day")
          )}
        >
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
        {logData?.length > 0 && (
          <DataTablePagination
            currentPage={1}
            totalPages={1}
            setPage={() => {}}
            setLimit={() => {}}
          />
        )}

        <Dialog
          open={openViewModal}
          onOpenChange={onModalChange}
          key={logDayData?.log_id}
        >
          <DialogContent aria-description="Daily log modal">
            <DialogTitle className="text-slate-700">
              Daily Log: {moment(logDayData?.date).format("MMM DD, YYYY")}
            </DialogTitle>
            <div className="text-slate-700">
              {insightLoading ? (
                "Data Loading..."
              ) : (
                <>
                  <div className="text-center">
                    {showStatusImg(insightData?.status)}
                  </div>
                  <p
                    className="text-sm mt-4"
                    dangerouslySetInnerHTML={{
                      __html: insightData?.insight_text,
                    }}
                  ></p>
                </>
              )}
            </div>
            <hr />
            <div className="grid grid-cols-2 mt-4 gap-6 text-sm text-slate-700">
              {logDayData && (
                <>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold w-[130px]">Energy Level:</p>
                    <p>{logDayData.energy_level}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold w-[130px]">Steps:</p>
                    <p>{logDayData.steps}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold w-[130px]">Sleep Hours:</p>
                    <p>{logDayData.sleep_hours}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold w-[130px]">Water Intake (L):</p>
                    <p>{logDayData.water_liters}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold w-[130px]">Calories:</p>
                    <p>{logDayData.calories}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold w-[130px]">Avg. Heart Rate:</p>
                    <p>{logDayData.avg_heart_rate}</p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* After adding log show data */}
        <Dialog open={openAfterAddModal} onOpenChange={closeAfterAddModal}>
          <DialogContent aria-description="Description of daily log">
            <DialogTitle className="text-slate-700">
              Insights from today's log
            </DialogTitle>
            <div className="text-slate-700">
              {insightLoading ? (
                "Data Loading..."
              ) : (
                <>
                  <div className="text-center">
                    {showStatusImg(insightData?.status)}
                  </div>
                  <p
                    className="text-sm mt-4"
                    dangerouslySetInnerHTML={{
                      __html: insightData?.insight_text,
                    }}
                  ></p>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};

export default LogsComponent;
