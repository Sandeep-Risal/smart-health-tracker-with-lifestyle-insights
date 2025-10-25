"use client";
import { Home } from "iconsax-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/shared/components/ui/breadcrumb";

const PageBreadCrumbs = () => {
  const segments = useSelectedLayoutSegments();
  const params = useParams();

  const breadcrumbs = segments.filter((segment) => segment !== params?.id);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/"} className="flex items-center gap-2">
              <Home size={16} color="currentColor" />
              <span>Dashboard</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs?.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbs?.map((item, index) => {
          const href = `/${breadcrumbs.slice(0, index + 1).join("/")}`;
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem key={index}>
                {isLast ? (
                  <BreadcrumbPage className="capitalize text-accent-foreground">
                    {item}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link
                        href={href}
                        className="flex items-center gap-2 capitalize"
                      >
                        <span>{item}</span>
                      </Link>
                    </BreadcrumbLink>
                  </>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadCrumbs;
