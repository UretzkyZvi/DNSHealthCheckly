import { FC, Fragment, useState } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Select, SelectItem } from "@tremor/react";
const INTERVALS_SECONDS = [10, 20, 30, 60, 120, 300];

interface CheckIntervalSelectionProps {
  currentInterval: number;
}

const CheckIntervalSelection: FC<CheckIntervalSelectionProps> = ({
  currentInterval,
}) => {
  const [selected, setSelected] = useState<number>(currentInterval);
  return (
    <Select
      value={selected.toString()}
      onValueChange={(value) => setSelected(parseInt(value))}
    >
      {INTERVALS_SECONDS.map((interval) => (
        <SelectItem key={interval} value={interval.toString()}>
          {interval} seconds
        </SelectItem>
      ))}
    </Select>
  );
};

export default CheckIntervalSelection;
