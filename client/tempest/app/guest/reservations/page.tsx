"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { formatCurrency, formatDate } from "@/app/lib/utils/format";
import { getReservationList } from "@/app/lib/features/properties/propertySlice";
import { Table, Spin, Image, Tag, Button, Drawer, Segmented } from "antd";
import { useRouter } from "next/navigation";
import ReservationDetailsDrawer from "@/app/components/drawer/ReservationDetailsDrawer";

export default function ReservationListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    data: reservationList,
    count,
    loading: reservationListLoading,
  } = useAppSelector((state) => state.property.reservationList);

  const [isReservationDetailsDrawerOpen, setIsReservationDetailsDrawerOpen] =
    useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

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
      title: "Listing",
      dataIndex: "property",
      render: (_: any, record: any) => (
        <div
          className="flex items-center gap-3 cursor-pointer w-[300px]"
          onClick={() => router.push(`/properties/${record.property.id}`)}
        >
          <div>
            <Image
              src={record.property.image_url}
              alt={record.property.title}
              width={80}
              height={60}
              className="rounded-md object-cover"
              preview={false}
            />
          </div>
          <div className="min-w-0">
            {" "}
            <p className="font-semibold truncate">
              {record.property.title}
            </p>{" "}
            <p className="text-gray-500 text-sm truncate">
              {record.property.location}
            </p>
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
          PENDING: "#d4b106",
          APPROVED: "#7cb305",
          DECLINED: "#cf1322",
          ONGOING: "#7cb305",
          COMPLETED: "#7289da",
          CANCELLED: "#cf1322",
          EXPIRED: "#8c8c8c",
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
            color="primary"
            onClick={() => {
              setSelectedReservation(record.id); // store the clicked reservation
              setIsReservationDetailsDrawerOpen(true); // open drawer
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

  const tableData = reservationList?.map((item: any) => ({
    key: item.id,
    ...item,
  }));

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="px-4 sm:px-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-xl sm:text-3xl">Reservations</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <Button color="default" variant="filled" size="small">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-download"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                <path d="M7 11l5 5l5 -5" />
                <path d="M12 4l0 12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="">
        <Segmented<string>
          options={[
            { label: "All", value: "1" },
            { label: "Pending", value: "2" },
            { label: "Approved", value: "3" },
            { label: "Declined", value: "4" },
            { label: "Expired", value: "5" },
            { label: "Completed", value: "6" },
          ]}
          onChange={(value) => {}}
        />
      </div>

      <div className="overflow-x-auto">
        {" "}
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            current: currentPage,
            pageSize,
            total: count,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
        />
      </div>
      <Drawer
        title="Reservation Details"
        placement="right"
        width={500}
        onClose={() => setIsReservationDetailsDrawerOpen(false)}
        open={isReservationDetailsDrawerOpen}
      >
        {selectedReservation ? (
          <ReservationDetailsDrawer reservationId={selectedReservation} />
        ) : (
          <Spin />
        )}
      </Drawer>
    </div>
  );
}
