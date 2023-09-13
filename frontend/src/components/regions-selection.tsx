import { FC, Fragment, useState } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Select, SelectItem } from "@tremor/react";
const REGIONAL_DNS_SERVERS = [
  "Global",
  "North America",
  "Europe",
  "Asia",
  "Australia",
  "South America",
  "Africa",
];

interface RegionSelectionProps {
  currentRegion?: string;
  onChange: (region: string) => void;
}

const RegionSelection: FC<RegionSelectionProps> = ({
  currentRegion,
  onChange,
}) => {
  const [selected, setSelected] = useState<string>(currentRegion ?? "Global");
  const handleInputChange = (value: string) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <Select value={selected} onValueChange={handleInputChange}>
      {REGIONAL_DNS_SERVERS.map((region) => (
        <SelectItem key={region.split(" ").join("-")} value={region}>
          {region}
        </SelectItem>
      ))}
    </Select>
  );
};

export default RegionSelection;
