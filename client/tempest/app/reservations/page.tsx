"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getReservationList } from "@/app/lib/features/properties/propertySlice";
import { Table, Spin, Image, Tag } from "antd";
import { useRouter } from "next/navigation";

export default function ReservationListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    data: reservationList,
    count,
    loading: reservationListLoading,
  } = useAppSelector((state) => state.property.reservationList);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getReservationList({ page: currentPage, page_size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  if (reservationListLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Property",
      dataIndex: "property",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.property.image_url}
            alt={record.property.title}
            width={80}
            height={60}
            className="rounded-md object-cover"
            preview={false}
          />
          <div>
            <p className="font-semibold">{record.property.title}</p>
            <p className="text-gray-500 text-sm">{record.property.location}</p>
          </div>
        </div>
      ),
    },
    { title: "Start Date", dataIndex: "start_date" },
    { title: "End Date", dataIndex: "end_date" },
    { title: "Nights", dataIndex: "number_of_nights", align: "center" },
    { title: "Guests", dataIndex: "guests", align: "center" },
    {
      title: "Price / Night",
      dataIndex: "price_per_night",
      render: (_: any, record: any) =>
        `₱${Number(record.price_per_night).toLocaleString()}`,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (_: any, record: any) =>
        `₱${Number(record.total_amount).toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const colorMap: any = {
          PENDING: "gold",
          ACCEPTED: "green",
          DECLINED: "red",
          CANCELLED: "gray",
        };
        return <Tag color={colorMap[status] || "blue"}>{status}</Tag>;
      },
    },
  ];

  const tableData = reservationList?.map((item: any) => ({
    key: item.id,
    ...item,
  }));

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="px-4 sm:px-10">
      <h2 className="font-bold my-4 text-lg sm:text-xl">My Reservations</h2>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: currentPage,
          pageSize,
          total: count,
        }}
        rowClassName="cursor-pointer"
        onRow={(record) => ({
          onClick: () => router.push(`/properties/${record.property.id}`),
        })}
        onChange={handleTableChange}
      />
    </div>
  );
}
