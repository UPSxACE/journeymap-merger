"use client";
import { Loader, Paper } from "@mantine/core";
import {
  Dropzone,
  DropzoneAccept,
  DropzoneIdle,
  DropzoneReject,
  FileRejection,
  FileWithPath,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import DropzoneLayout from "./_components/dropzone-layout";
import FakeProgress from "./_components/fake-progress";
import HelpMe from "./_components/help-me";
import Previews from "./_components/previews";
import Result from "./_components/result";

let id = 0;

export default function Home() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalFile, setFinalFile] = useState<null | string>(null);
  const [compressedFile, setCompressedFile] = useState<null | string>(null);

  function handleMerge() {
    const notificationId = "merging-" + ++id;
    console.log(notificationId);
    notifications.show({
      id: notificationId,
      title: "Merging...",
      message: <FakeProgress initial={0} final={66} />,
      classNames: {
        icon: "bg-transparent mr-3 mt-1",
      },
      icon: <Loader size={30} />,
      withCloseButton: false,
      autoClose: false,
    });

    setLoading(true);
    const form = new FormData();

    files.map((file) => {
      form.append("file", file);
    });

    axios
      .post("http://localhost:1323/api/merge", form, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "image/png",
        });
        const urlObject = URL.createObjectURL(blob);

        setFinalFile(urlObject);

        const fileObj = new File([blob], "compressed.png", { type: blob.type });

        imageCompression(fileObj, {
          maxWidthOrHeight: 4000,
          initialQuality: 1.0,
          alwaysKeepResolution: true,
        })
          .then((compressed) => {
            const urlObject = URL.createObjectURL(compressed);
            setCompressedFile(urlObject);

            notifications.update({
              id: notificationId,
              title: "Done!",
              message: <FakeProgress initial={100} final={100} />,
              icon: <FaCheckCircle size={30} color="green" />,
              // autoClose: 5000,
              classNames: {
                root: "max-sm:hidden",
                icon: "bg-white mt-1 mr-3",
              },
              autoClose: 5000,
            });
          })
          .catch((err) => {
            notifications.update({
              id: notificationId,
              title: "Unexpected error",
              message: "The resulting file is probably too big",
              icon: <FaTimesCircle size={30} color="red" />,
              classNames: {
                icon: "bg-white mt-1 mr-3",
              },
              autoClose: 7500,
            });
          });
      })
      .catch((error) => {
        const errorTitle =
          error?.response?.status === 400 ? "Invalid file" : "Unexpected error";
        const errorMessage =
          error?.response?.status === 400
            ? "Check if the files have the correct name"
            : "Please try again later";

        notifications.update({
          id: notificationId,
          title: errorTitle,
          message: errorMessage,
          icon: <FaTimesCircle size={30} color="red" />,
          classNames: {
            icon: "bg-white mt-1 mr-3",
          },
          autoClose: 7500,
        });
        setLoading(false);
      });
  }

  function handleReset() {
    finalFile && URL.revokeObjectURL(finalFile);
    compressedFile && URL.revokeObjectURL(compressedFile);
    setFinalFile(null);
    setCompressedFile(null);
    setLoading(false);
  }

  function handleFileReject(files: FileRejection[]) {
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
        icon: <FaTimesCircle size={30} color="red" />,
        classNames: {
          icon: "bg-white mt-1 mr-3",
        },
        autoClose: 7500,
      });
    });
  }

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-4 bg-mantine-gray-1">
      <HelpMe />

      <Paper
        className="flex max-w-[625px] flex-col gap-4 rounded-xl p-12 pt-8 max-[625px]:max-w-full"
        withBorder
      >
        <h1 className="m-0 text-center text-2xl font-medium">
          Minecraft JourneyMap Merger
        </h1>
        <p className="m-0 text-center">
          Go to the mod folder, and drag the split map images into the square
          below.
        </p>
        {compressedFile && finalFile ? (
          <Result
            compressedFile={compressedFile}
            handleReset={handleReset}
            finalFile={finalFile}
          />
        ) : (
          <>
            <Dropzone
              accept={["image/png"]}
              onDrop={setFiles}
              onReject={handleFileReject}
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
            <Previews
              files={files}
              loading={loading}
              handleMerge={handleMerge}
            />
          </>
        )}
      </Paper>
    </main>
  );
}
