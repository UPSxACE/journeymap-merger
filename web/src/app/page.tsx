"use client";
import merge from "@/actions/merge";
import { Button, Paper } from "@mantine/core";
import {
  Dropzone,
  DropzoneAccept,
  DropzoneIdle,
  DropzoneReject,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import Image from "next/image";
import { useState } from "react";
import { IoMdImage } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export default function Home() {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  function handleMerge() {
    const form = new FormData();

    files.map((file) => {
      form.append("file", file);
    });

    merge(form);
  }

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div
        key={index}
        className="relative aspect-square overflow-hidden rounded-[0.25rem] bg-gray-200"
      >
        <Image
          className=" object-cover"
          fill
          alt="uploaded image preview"
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      </div>
    );
  });

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="m-0 font-medium">Minecraft JourneyMap Merger</h1>
      <Paper className="flex flex-col gap-4 rounded-xl p-4" withBorder>
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          onDrop={setFiles}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
          className="!px-10"
        >
          <DropzoneAccept>
            <div className="pointer-events-none flex min-h-24 items-center justify-center gap-2">
              <div className="text-8xl">
                <MdOutlineFileUpload className="text-mantine-blue-6" />
              </div>
              <div>
                <h1 className="m-0 mb-1 text-2xl font-normal text-mantine-blue-6">
                  Drag images here or click to select files
                </h1>
                <p className="m-0 mb-2 text-lg text-mantine-dimmed">
                  Attach as many files as you like, each file should not exceed
                  5mb
                </p>
              </div>
            </div>
          </DropzoneAccept>
          <DropzoneReject>
            <div className="pointer-events-none flex min-h-24 items-center justify-center gap-2">
              <div className="text-8xl">
                <RxCross2 className="text-mantine-red-6" />
              </div>
              <div>
                <h1 className="m-0 mb-1 text-2xl font-normal text-mantine-red-6">
                  Drag images here or click to select files
                </h1>
                <p className="m-0 mb-2 text-lg text-mantine-dimmed">
                  Attach as many files as you like, each file should not exceed
                  5mb
                </p>
              </div>
            </div>
          </DropzoneReject>
          <DropzoneIdle>
            <div className="pointer-events-none flex min-h-24 items-center justify-center gap-2">
              <div className="text-8xl">
                <IoMdImage className="text-mantine-dimmed" />
              </div>
              <div>
                <h1 className="m-0 mb-1 text-2xl font-normal text-mantine-text">
                  Drag images here or click to select files
                </h1>
                <p className="m-0 mb-2 text-lg text-mantine-dimmed">
                  Attach as many files as you like, each file should not exceed
                  5mb
                </p>
              </div>
            </div>
          </DropzoneIdle>
        </Dropzone>
        {previews.length > 0 && (
          <>
            <div className="grid w-full grid-cols-4 gap-4">{previews}</div>
            <Button onClick={handleMerge}>Merge</Button>
          </>
        )}
      </Paper>
    </main>
  );
}
