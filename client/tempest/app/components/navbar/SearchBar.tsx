"use client";

import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import type { GetProps } from "antd";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log("Search:", info?.source, value);

const SearchBar: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full sm:w-auto">
      <Search
        placeholder="Search something..."
        onSearch={onSearch}
        enterButton={
          <span className="flex items-center gap-1 text-sm font-medium">
            <SearchOutlined />
            Search
          </span>
        }
        size="large"
        className="!w-[90%] sm:!w-[300px] md:!w-[400px] xl:!w-[600px] !rounded-full overflow-hidden !border-none !shadow-md hover:!shadow-lg transition-all duration-200 [&_.ant-input]:!border-none [&_.ant-input]:!shadow-none [&_.ant-input]:!focus:border-none [&_.ant-input]:!focus:shadow-none"
      />
    </div>
  );
};

export default SearchBar;
