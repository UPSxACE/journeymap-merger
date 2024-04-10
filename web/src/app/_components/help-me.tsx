import { Affix, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { ReactNode } from "react";
import { IoMdHelpCircleOutline } from "react-icons/io";

export default function HelpMe() {
  const [opened, { open, close }] = useDisclosure(false);

  function Mark({ children }: { children: ReactNode }) {
    return (
      <mark className="bg-gray-200 px-[0.25rem] py-[0.0.75rem]">
        {children}
      </mark>
    );
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="How to use"
        size="lg"
        classNames={{
          title: "font-semibold text-2xl",
          body: "flex flex-col gap-4",
        }}
        closeButtonProps={{ size: "lg" }}
      >
        <p className="m-0">
          To merge the map you need to drag the map pieces from the mod&apos;s
          folder to the dropzone(or left click the dropzone instead). Follow the
          instructions to find the mod folder.
        </p>
        <ol className="m-0 break-words">
          <li>
            Press <Mark>Win+R</Mark>
          </li>
          <li>
            Paste <Mark>%appdata%/.minecraft/journeymap/data</Mark> and press{" "}
            <Mark>Enter</Mark>
          </li>
          <Image
            className="my-2 max-w-full object-contain"
            width={416 * 0.8}
            height={228 * 0.8}
            alt="Screenshot"
            src="/ss1.PNG"
          />
          <li>
            Enter inside <Mark>sm</Mark> folder if you&apos;re looking for a map
            from a singleplayer world or <Mark>mp</Mark> if you&apos;re looking
            for a map from a multiplayer world
          </li>
          <Image
            className="my-2 max-w-full object-contain"
            width={188}
            height={51}
            alt="Screenshot"
            src="/ss2.PNG"
          />
          <li>
            Find the folder that corresponds to your world. Usually it&apos;s
            the one that is a combination of the world name and some randomized
            string.
          </li>
          <Image
            className="my-2 max-w-full object-contain"
            width={262}
            height={108}
            alt="Screenshot"
            src="/ss3.PNG"
          />
          <li>
            Enter the <Mark>overworld</Mark> folder
          </li>
          <Image
            className="my-2 max-w-full object-contain"
            width={201}
            height={51}
            alt="Screenshot"
            src="/ss4.PNG"
          />
          <li>
            Enter the folder that curresponds the map you want to merge (if
            it&apos;s your first time just enter the <Mark>day</Mark> folder)
          </li>
          <Image
            className="my-2 max-w-full object-contain"
            width={205}
            height={158}
            alt="Screenshot"
            src="/ss5.PNG"
          />
          <li>
            There you have all the map pieces that you need to drag into the
            website&apos;s dropzone!
          </li>
          <Image
            className="my-2 max-w-full object-contain"
            width={456}
            height={361}
            alt="Screenshot"
            src="/ss6.PNG"
          />
        </ol>

        <div className="flex">
          <Button className="ml-auto" onClick={close}>
            OK
          </Button>
        </div>
      </Modal>
      <Affix position={{ bottom: 40, right: 40 }} className="z-0">
        <Button
          classNames={{ label: "flex", root: "group px-2" }}
          size="md"
          onClick={open}
        >
          <IoMdHelpCircleOutline size={30} />
          <div className="w-0 transition-all duration-200 group-hover:w-[5.25rem] max-sm:w-[5.25rem]">
            <span className="text-lg">HELP ME</span>
          </div>
        </Button>
      </Affix>
    </>
  );
}
