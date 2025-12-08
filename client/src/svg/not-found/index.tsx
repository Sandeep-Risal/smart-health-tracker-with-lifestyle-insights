import Image from "next/image";
import React from "react";

// import { noResult } from "@/shared/lib/image-config";
import noResult from "@/public/no-result.svg";

interface IProps {
  height?: number;
  width?: number;
}

const NotFoundLottie = ({ height, width }: IProps) => {
  return (
    <div className="my-20">
      <Image
        src={noResult}
        width={width ? width : 160}
        height={height ? height : 150}
        alt="No Result"
        className="m-auto"
        quality={100}
        priority
        style={{
          objectFit: "contain",
          height: `${width ? width : 160}px`,
          width: `${height ? height : 160}px`,
        }}
      />
      <p className="text-base font-medium text-zinc-500">No Results Found</p>
    </div>
  );
};

export default NotFoundLottie;
