"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { formatCurrency, formatDate } from "@/app/lib/utils/format";
import {
  getUserPropertyList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import { Table, Spin, Image, Tag, Switch, Button } from "antd";
import { useRouter } from "next/navigation";

export default function MyPropertiesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    data: userPropertyList,
    count,
    loading: userPropertyListLoading,
  } = useAppSelector((state) => state.property.userPropertyList);

  const { user } = useAppSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (user?.id) {
      dispatch(
        getUserPropertyList({
          userId: user.id,
          pagination: { page: currentPage, page_size: pageSize },
        })
      );
    }
  }, [dispatch, user, currentPage, pageSize]);

  if (userPropertyListLoading) {
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
          onClick={() => router.push(`/properties/${record.id}`)}
        >
          <Image
            src={record.image_url}
            alt={record.title}
            width={80}
            height={60}
            className="rounded-md object-cover"
            preview={false}
          />
          <div>
            <p className="font-semibold">{record.title}</p>
            <p className="text-gray-500 text-sm">{record.location}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Guests",
      dataIndex: "guests",
      align: "center" as const,
    },
    {
      title: "Price / Night",
      dataIndex: "price_per_night",
      render: (price: number) => `₱${formatCurrency(Number(price))}`,
    },
    {
      title: "Date Added",
      dataIndex: "created_at",
      render: (date: string) => `${formatDate(date)}`,
    },
    // {
    //   title: "Views",
    //   dataIndex: "views_count",
    //   align: "center",
    // },
    // {
    //   title: "Likes",
    //   dataIndex: "likes_count",
    //   align: "center",
    // },
    // {
    //   title: "Reservations",
    //   dataIndex: "reservations_count",
    //   align: "center",
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const colorMap: any = {
          ACTIVE: "green",
          INACTIVE: "gray",
          PENDING: "gold",
          SUSPENDED: "red",
        };
        return <Tag color={colorMap[status] || "blue"}>{status}</Tag>;
      },
    },
    {
      title: "Instant Book",
      dataIndex: "instant_booking",
      align: "center" as const,
      // TODO: Add instant booking feature
      render: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch size="small" />
        </div>
      ),
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

  const tableData = userPropertyList?.map((item: any) => ({
    key: item.id,
    ...item,
  }));

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="px-4 sm:px-10">
      <p className="my-4 text-lg sm:text-xl">Listings</p>

      <Table
        columns={columns}
        dataSource={tableData}
        loading={userPropertyListLoading}
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
