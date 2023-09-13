import { FC, Fragment, useState } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Select, SelectItem } from "@tremor/react";
const INTERVALS_SECONDS = [10, 20, 30, 60, 120, 300];

interface CheckIntervalSelectionProps {
  currentInterval: number;
  onChange: (interval: number) => void;
}

const CheckIntervalSelection: FC<CheckIntervalSelectionProps> = ({
  currentInterval,
  onChange,
}) => {
  const [selected, setSelected] = useState<number>(currentInterval);
  const handleInputChange = (value: string) => {
    const parsedValue = parseInt(value);
    setSelected(parsedValue);
    onChange(parsedValue);
  };
  return (
    <Select
      value={selected.toString()}
      onValueChange={(value) => handleInputChange(value)}
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
