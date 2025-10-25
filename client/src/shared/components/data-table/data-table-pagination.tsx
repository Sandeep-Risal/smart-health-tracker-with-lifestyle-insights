import React from "react";
import {
  PaginationEllipsis,
  PaginationNext,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
} from "@/src/shared/components/ui/pagination";

const DataTablePagination = ({
  currentPage,
  totalPages,
  setPage,
  setLimit,
}: {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}) => {
  const handlePrevious = () => {
    if (currentPage === 1) return;
    setPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage === totalPages) return;
    setPage(currentPage + 1);
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(index + 1)}
              isActive={currentPage === index + 1}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DataTablePagination;
