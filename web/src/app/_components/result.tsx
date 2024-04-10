"use client";
import { Button } from "@mantine/core";
import Image from "next/image";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default function Result({
  handleReset,
  compressedFile,
  finalFile,
}: {
  handleReset: () => void;
  compressedFile: string;
  finalFile: string;
}) {
  function handleDownload() {
    if (finalFile) {
      const link = document.createElement("a");
      link.href = finalFile;
      link.download = "result.png";
      link.click();
    }
  }

  return (
    <>
      <TransformWrapper wheel={{ step: 10, smoothStep: 0.01 }} maxScale={64}>
        <TransformComponent contentClass="!w-full" wrapperClass="!w-full">
          <div className="relative aspect-square w-full overflow-hidden rounded-[0.25rem] bg-gray-200">
            <Image
              className=" object-contain"
              fill
              alt="resulting image compressed"
              src={compressedFile}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleDownload}>
          Download
        </Button>
        <Button className="flex-1" variant="outline" onClick={handleReset}>
          Go Back
        </Button>
      </div>
    </>
  );
}
