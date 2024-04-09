"use client";
import merge from "@/actions/merge";
import { convertBytes } from "@/utils/convert-bytes";
import { Button, Paper } from "@mantine/core";
import {
  Dropzone,
  DropzoneAccept,
  DropzoneIdle,
  DropzoneReject,
  FileWithPath,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import { useState } from "react";
import DropzoneLayout from "./_components/dropzone-layout";

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
        <div>
          <h1 className="m-0 line-clamp-1 text-base">{file.name}</h1>
          <span className="m-0 block text-mantine-dimmed">
            {convertBytes(file.size)}
          </span>
        </div>
      </Paper>
    );
  });

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-4 bg-mantine-gray-1">
      <Paper
        className="flex max-w-[625px] flex-col gap-4 rounded-xl p-12 pt-8"
        withBorder
      >
        <h1 className="m-0 text-center text-2xl font-medium">
          Minecraft JourneyMap Merger
        </h1>
        <p className="m-0 text-center">
          Go to the mod folder, and drag the split map images into the square
          below.
        </p>
        <Dropzone
          accept={["image/png"]}
          onDrop={setFiles}
          onReject={(files) => {
            files.forEach((file) => {
              let error;

              if (file.file.type !== "image/png") {
                error = "File is not a .png file";
              }

              if (file.file.size > 5 * 1024 ** 2) {
                error = "File is bigger than 5MB";
              }

              notifications.show({
                title: error || `File rejected`,
                message: `Could not upload ${file.file.name}`,
                color: "red.9",
                autoClose: 7500,
              });
            });
          }}
          maxSize={5 * 1024 ** 2}
          className="!px-10"
        >
          <DropzoneAccept>
            <DropzoneLayout state="accept" />
          </DropzoneAccept>
          <DropzoneReject>
            <DropzoneLayout state="reject" />
          </DropzoneReject>
          <DropzoneIdle>
            <DropzoneLayout state="idle" />
          </DropzoneIdle>
        </Dropzone>
        {previews.length > 0 && (
          <>
            <div className="hidescroll flex max-h-[320px] flex-col gap-2 overflow-y-auto">
              {previews}
            </div>
            <Button onClick={handleMerge}>Merge</Button>
          </>
        )}
      </Paper>
    </main>
  );
}
