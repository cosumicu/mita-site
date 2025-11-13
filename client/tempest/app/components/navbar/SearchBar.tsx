"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Modal, DatePicker, InputNumber, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    null,
    null,
  ]);
  const [guests, setGuests] = useState<number>(1);

  const disabledDate = (current: Dayjs) => {
    // Disable all dates before today
    return current && current.isBefore(dayjs().startOf("day"));
  };

  const onSearch = () => {
    const query = new URLSearchParams();

    if (location) query.set("location", location);
    if (dates[0]) query.set("start_date", dates[0].format("YYYY-MM-DD"));
    if (dates[1]) query.set("end_date", dates[1].format("YYYY-MM-DD"));
    if (guests) query.set("guests", guests.toString());
    console.log(query.toString());
    router.push(query ? `/s?${query}` : "/s"); // 👈 if empty, just list all

    setIsModalOpen(false);
  };

  return (
    <>
      {/* DESKTOP / LARGE SCREENS */}
      <div className="hidden sm:flex justify-center items-center bg-white rounded-full shadow-md px-3 py-2 w-[90%] sm:w-auto md:w-[700px] lg:w-[800px] transition-all duration-200 divide-x divide-gray-200 hover:shadow-lg">
        {/* Location */}
        <div className="flex items-center w-4/12 px-3 gap-2">
          <EnvironmentOutlined className="text-gray-500 text-lg" />
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="!border-none !shadow-none focus:!shadow-none focus:!border-none"
          />
        </div>

        {/* Dates */}
        <div className="flex items-center w-6/12 px-3 gap-2">
          <CalendarOutlined className="text-gray-500 text-lg" />
          <RangePicker
            className="!border-none !shadow-none w-full"
            onChange={(values) =>
              setDates(values as [dayjs.Dayjs | null, dayjs.Dayjs | null])
            }
            disabledDate={disabledDate}
          />
        </div>

        {/* Guests */}
        <div className="flex items-center w-2/12 px-3 gap-2">
          <UserOutlined className="text-gray-500 text-lg" />
          <InputNumber
            min={1}
            value={guests}
            onChange={(value) => setGuests(value || 1)}
            className="!border-none !shadow-none w-full"
            placeholder="Guests"
          />
        </div>

        {/* Search button */}
        <Button
          type="primary"
          shape="round"
          icon={<SearchOutlined />}
          onClick={onSearch}
          className="ml-3 bg-rose-500 hover:bg-rose-600 border-none font-medium"
        >
          Search
        </Button>
      </div>

      {/* MOBILE BUTTON */}
      <div className="flex sm:hidden justify-center w-full mt-2">
        <Button
          type="primary"
          shape="round"
          icon={<SearchOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="shadow-md bg-rose-500 hover:bg-rose-600 border-none"
        >
          Search
        </Button>
      </div>

      {/* MOBILE MODAL */}
      <Modal
        title="Search"
        open={isModalOpen}
        onOk={onSearch}
        onCancel={() => setIsModalOpen(false)}
        okText="Search"
        centered
      >
        <div className="flex flex-col gap-4">
          {/* Location */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <EnvironmentOutlined className="text-gray-500" />
            <Input
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              bordered={false}
            />
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <CalendarOutlined className="text-gray-500" />
            <RangePicker
              style={{ width: "100%" }}
              onChange={(values) =>
                setDates(values as [dayjs.Dayjs | null, dayjs.Dayjs | null])
              }
              bordered={false}
            />
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <UserOutlined className="text-gray-500" />
            <InputNumber
              min={1}
              value={guests}
              onChange={(value) => setGuests(value || 1)}
              bordered={false}
              className="w-full"
              placeholder="Guests"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SearchBar;
