import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Plus, Search } from "lucide-react";

type FilterProps = {
  searchText: string;
  setSearchText: (val: string) => void;
};

const Filter = ({ searchText, setSearchText }: FilterProps) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex gap-5 items-center">
        <div className="flex gap-5 items-center flex-1">
          <div className="w-full">
            <Input
              placeholder="Search For A Product"
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

export default Filter;
