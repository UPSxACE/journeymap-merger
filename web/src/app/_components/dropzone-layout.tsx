"use client";
import { IoMdImage } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export default function DropzoneLayout({
  state,
}: {
  state: "accept" | "reject" | "idle";
}) {
  function getTextColor() {
    if (state === "accept") return "text-mantine-blue-6";
    if (state === "reject") return "text-mantine-red-6";
    return "text-mantine-text";
  }

  return (
    <div className="pointer-events-none flex min-h-24 items-center justify-center gap-2">
      <div className="text-8xl">
        {state === "accept" && (
          <MdOutlineFileUpload className="text-mantine-blue-6" />
        )}

        {state === "reject" && <RxCross2 className="text-mantine-red-6" />}

        {state === "idle" && <IoMdImage className="text-mantine-dimmed" />}
      </div>
      <div className="max-sm:hidden">
        <h1 className={"m-0 mb-1 text-lg font-normal " + getTextColor()}>
          Drag images here or click to select files
        </h1>
        <p className="text-md m-0 mb-2 text-mantine-dimmed">
          Attach as many files as you like, each file should not exceed 5mb
        </p>
      </div>
    </div>
  );
}
