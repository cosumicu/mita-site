"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getUserPropertyList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import { Table, Spin, Image, Tag, Switch } from "antd";
import Link from "next/link";

export default function MyPropertiesPage() {
  const dispatch = useAppDispatch();

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
      title: "Property",
      dataIndex: "title",
      render: (_: any, record: any) => (
        <Link href={`/properties/${record.id}`}>
          <div className="flex items-center gap-3">
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
        </Link>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Guests",
      dataIndex: "guests",
      align: "center",
    },
    {
      title: "Price / Night",
      dataIndex: "price_per_night",
      render: (price: number) => `₱${Number(price).toLocaleString()}`,
    },
    {
      title: "Views",
      dataIndex: "views_count",
      align: "center",
    },
    {
      title: "Likes",
      dataIndex: "likes_count",
      align: "center",
    },
    {
      title: "Reservations",
      dataIndex: "reservations_count",
      align: "center",
    },
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
      title: "Instant Booking",
      dataIndex: "instant_booking",
      align: "center",
      // TODO: Add instant booking feature
      render: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch />
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
      <h2 className="font-bold my-4 text-lg sm:text-xl">My Properties</h2>

      <Table
        columns={columns}
        dataSource={tableData}
        loading={userPropertyListLoading}
        pagination={{
          current: currentPage,
          pageSize,
          total: count,
        }}
        rowClassName="cursor-pointer"
        onRow={(record) => ({
          onClick: () => (window.location.href = `/properties/${record.id}`),
        })}
        onChange={handleTableChange}
      />
    </div>
  );
}
