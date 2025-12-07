"use client";
import React from "react";

import AddLogsForm from "@/src/features/logs/components/add-logs-form";

const AddLogs = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Add Logs</h1>
        <p className="text-sm text-gray-500">Add your daily log.</p>
      </div>
      <AddLogsForm />
    </div>
  );
};

export default AddLogs;
