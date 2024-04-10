import { Progress } from "@mantine/core";
import { useEffect, useState } from "react";

export default function FakeProgress({
  initial,
  final,
}: {
  initial: number;
  final: number;
}) {
  const [value, setValue] = useState(initial);
  const [interval, setIntervalState] = useState<null | NodeJS.Timeout>(null);

  useEffect(() => {
    let i = null;

    if (value < initial) {
      setValue(initial);
    }

    i = setInterval(() => {
      setValue((value) => (value < final ? Math.min(value + 1, final) : final));

      setIntervalState((interval) => {
        if (value < final) {
          return interval;
        }
        interval && clearInterval(interval);
        return null;
      });
    }, 200);

    setIntervalState(i);

    return () => {
      i && clearInterval(i);
    };
  }, [final, value, initial]);

  return (
    <Progress
      transitionDuration={final === 100 ? 250 : 1000}
      className="mt-1 !ease-linear"
      value={value}
    />
  );
}
