import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

type FilterProps = {
  searchText: string;
  setSearchText: (val: string) => void;
};

const FilterOrder = ({ searchText, setSearchText }: FilterProps) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex gap-5 items-center">
        <div className="flex gap-5 items-center flex-1">
          <div className="w-full">
            <Input
              placeholder="Search For An Order"
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Search />
        </div>
      </div>
    </div>
  );
};

export default FilterOrder;
