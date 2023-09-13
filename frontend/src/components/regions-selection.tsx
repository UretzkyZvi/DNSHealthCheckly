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
}

const RegionSelection: FC<RegionSelectionProps> = ({ currentRegion }) => {
  const [selected, setSelected] = useState<string>(currentRegion ?? "Global");
  return (
    <Select
      value={selected}
      onValueChange={setSelected}
      >
      {REGIONAL_DNS_SERVERS.map((region) => (
        <SelectItem key={region.split(" ").join("-")} value={region}>
          {region}
        </SelectItem>
      ))}
    </Select>
  );
};

export default RegionSelection;
