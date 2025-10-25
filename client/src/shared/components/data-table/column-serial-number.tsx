import React from "react";

//   For serial Number
const SerialNumberCell = ({ row, pageNumber, perPage }: any) => {
  const rowIndex = row.index;
  const serialNumber = (pageNumber - 1) * perPage + rowIndex + 1;
  return <div className="text-accent-foreground">{serialNumber}.</div>;
};

export default SerialNumberCell;
