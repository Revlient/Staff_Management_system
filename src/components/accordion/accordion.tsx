import { Accordion as AccordionApp, AccordionItem } from '@nextui-org/react';
import React, { useEffect } from 'react';
import Input from '../input';
import useStore from '@/store/store';

export interface AccordionAppProps {
  accOptions: {
    label: string;
    iterables: TOption[];
  }[];
  selectedItems: TOption[];
  isFSearchable?: boolean;
  setSelectedItems: (data: TOption) => void;
}
const Accordion: React.FC<AccordionAppProps> = ({
  accOptions,
  isFSearchable = false,
  selectedItems = [],
  setSelectedItems,
}) => {
  const { filterSearch, setFilterSearch } = useStore((store) => store);

  useEffect(() => {
    return () => setFilterSearch([]);
  }, []);

  const handleSearch = (label: string, key: string) => {
    const existingIndex = filterSearch?.findIndex((i) => i.label === label);
    setFilterSearch(
      existingIndex !== -1
        ? filterSearch.map((i, index) =>
            index === existingIndex ? { label, key } : i
          )
        : [...(filterSearch || []), { label, key }]
    );
  };
  return (
    <AccordionApp
      variant="bordered"
      className="bg-white max-h-72 overflow-auto"
    >
      {accOptions?.map(({ label, iterables }, index: number) => (
        <AccordionItem key={index} aria-label={label} title={label}>
          <div className="flex flex-wrap gap-2">
            {isFSearchable && (
              <Input
                placeholder={'Search Here'}
                className=" w-auto h-10 outline-none"
                value={filterSearch.find((l) => l.label === label)?.key}
                onChange={(e) => handleSearch(label, e.target.value)}
              />
            )}
            {iterables?.map(({ label: _label, value }, _index) => (
              <span
                key={_index}
                onClick={() => setSelectedItems({ label, value })}
                //@ts-ignore
                className={`p-2 text-xs cursor-pointer rounded-full ${selectedItems?.[label]?.includes(value) ? 'bg-gray-400' : 'bg-gray-100'}`}
              >
                {_label}
              </span>
            ))}
          </div>
        </AccordionItem>
      ))}
    </AccordionApp>
  );
};

export default Accordion;
