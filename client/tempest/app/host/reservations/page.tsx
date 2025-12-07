"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { formatCurrency, formatDate } from "@/app/lib/utils/format";
import { getHostReservationList } from "@/app/lib/features/properties/propertySlice";
import { Table, Spin, Image, Tag, Button } from "antd";
import { useRouter } from "next/navigation";

export default function ReservationListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    data: hostReservationList,
    count,
    loading: hostReservationListLoading,
  } = useAppSelector((state) => state.property.hostReservationList);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getHostReservationList({ page: currentPage, page_size: pageSize })
    );
  }, [dispatch, currentPage, pageSize]);

  if (hostReservationListLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Listing",
      dataIndex: "property",
      render: (_: any, record: any) => (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push(`/properties/${record.property.id}`)}
        >
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
    {
      title: "Check-in",
      dataIndex: "start_date",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Checkout",
      dataIndex: "end_date",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Booked",
      dataIndex: "created_at",
      render: (value: string) => formatDate(value),
    },
    { title: "Guests", dataIndex: "guests", align: "center" as const },
    {
      title: "Confirmation Code",
      dataIndex: "confirmation_code",
    },
    // {
    //   title: "Price / Night",
    //   dataIndex: "price_per_night",
    //   render: (_: any, record: any) =>
    //     `₱${formatCurrency(Number(record.price_per_night))}`,
    // },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (_: any, record: any) =>
        `₱${formatCurrency(Number(record.total_amount))}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const colorMap: any = {
          PENDING: "gold",
          APPROVED: "green",
          DECLINED: "red",
          ONGOING: "green",
          COMPLETED: "blue",
          CANCELLED: "gray",
        };
        return <Tag color={colorMap[status] || "blue"}>{status}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-4">
          <Button
            variant="outlined"
            size="small"
            type="primary"
            onClick={() => {
              // setIsDeletePropertyModalOpen(true);
            }}
          >
            <p className="text-xs">Details</p>
          </Button>
          <button
            onClick={() => {
              console.log("");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-dots"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const tableData = hostReservationList?.map((item: any) => ({
    key: item.id,
    ...item,
  }));

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="px-4 sm:px-10">
      <p className="my-4 text-lg sm:text-xl">Host Reservations</p>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: currentPage,
          pageSize,
          total: count,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
