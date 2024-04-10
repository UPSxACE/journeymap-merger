"use client"
import { convertBytes } from "@/utils/convert-bytes";
import { Button, Paper } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import Image from "next/image";
import { MouseEventHandler } from "react";

interface PreviewsProps {
  files: FileWithPath[];
  loading: boolean;
  handleMerge: MouseEventHandler<HTMLButtonElement>;
}

export default function Previews({
  files,
  loading,
  handleMerge,
}: PreviewsProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidescroll flex max-h-[320px] flex-col gap-2 overflow-y-auto">
        {files.map((file, index) => {
          const imageUrl = URL.createObjectURL(file);
          return (
            <Paper
              withBorder
              key={index}
              className="grid grid-cols-[3rem_auto] gap-x-3 gap-y-1 p-2"
            >
              <div className="relative aspect-square w-12 overflow-hidden rounded-[0.25rem] bg-gray-200">
                <Image
                  className=" object-cover"
                  fill
                  alt="uploaded image preview"
                  src={imageUrl}
                  onLoad={() => URL.revokeObjectURL(imageUrl)}
                />
              </div>
              <div className="max-[625px]:max-w-[calc(100%-3.75rem)]">
                <h1 className="m-0 line-clamp-1 text-base">{file.name}</h1>
                <span className="m-0 block text-mantine-dimmed">
                  {convertBytes(file.size)}
                </span>
              </div>
            </Paper>
          );
        })}
      </div>
      <Button loading={loading} onClick={handleMerge}>
        Merge
      </Button>
    </>
  );
}
