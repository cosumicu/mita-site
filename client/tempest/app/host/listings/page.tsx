"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { formatCurrency, formatDate } from "@/app/lib/utils/format";
import {
  getUserPropertyList,
  updatePropertyStatus,
} from "@/app/lib/features/properties/propertySlice";
import {
  Table,
  Spin,
  Image,
  Tag,
  Switch,
  Button,
  Drawer,
  Segmented,
  Menu,
  Dropdown,
} from "antd";
import { useRouter } from "next/navigation";
import PropertyDetailsDrawer from "@/app/components/drawer/PropertyDetailsDrawer";
import type { MenuProps } from "antd";
import { toast } from "react-toastify";

const STATUS_ITEMS: MenuProps["items"] = [
  { key: "ACTIVE", label: "Published" },
  { key: "INACTIVE", label: "Unpublish" },
];

export default function MyPropertiesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    data: userPropertyList,
    count,
    loading: userPropertyListLoading,
  } = useAppSelector((state) => state.property.userPropertyList);

  const { user } = useAppSelector((state) => state.user);

  const [isPropertyDetailsDrawerOpen, setIsPropertyDetailsDrawerOpen] =
    useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (user?.user_id) {
      dispatch(
        getUserPropertyList({
          filters: { user: user.user_id, status: statusFilter },
          pagination: { page: currentPage, page_size: pageSize },
        }),
      );
    }
  }, [dispatch, user, statusFilter, currentPage, pageSize]);

  const onStatusClick =
    (record: any): MenuProps["onClick"] =>
    async ({ key }) => {
      try {
        await dispatch(
          updatePropertyStatus({
            propertyId: record.id,
            status: key as string,
          }),
        ).unwrap();

        toast.success("Status updated!");
      } catch (msg) {
        toast.error(String(msg || "Failed to update status"));
      }
    };

  const columns = [
    {
      title: "Listing",
      dataIndex: "property",
      render: (_: any, record: any) => (
        <div
          className="flex items-center gap-3 cursor-pointer w-[300px]"
          onClick={() => router.push(`/properties/${record.id}`)}
        >
          <div>
            <Image
              src={record.image_url}
              alt={record.title}
              width={80}
              height={60}
              className="rounded-md object-cover"
              preview={false}
            />
          </div>
          <div className="min-w-0">
            {" "}
            <p className="font-semibold truncate">{record.title}</p>{" "}
            <p className="text-gray-500 text-sm truncate">{record.location}</p>
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
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const colorMap: any = {
          ACTIVE: "#7cb305",
          INACTIVE: "#8c8c8c",
          PENDING: "#d4b106",
          SUSPENDED: "#cf1322",
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
          <Switch size="small" disabled />
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProperty(record);
              setIsPropertyDetailsDrawerOpen(true);
            }}
          >
            <p className="text-xs">Details</p>
          </Button>

          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: STATUS_ITEMS,
              onClick: onStatusClick(record), // ✅ uses your thunk-based handler
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="More actions"
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
          </Dropdown>
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
    <div className="ui-container">
      <div className="ui-main-content">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-xl sm:text-2xl">Listings</p>
          </div>
          <div className="ml-auto mx-2">
            <Button
              type="primary"
              size="small"
              onClick={() => router.push("/host/create-listing")}
            >
              + Create Listing
            </Button>
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

        <div className="max-w-full overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-block">
            <Segmented<string>
              options={[
                { label: "All", value: "" },
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
                { label: "Suspended", value: "SUSPENDED" },
              ]}
              onChange={(value) => {
                setCurrentPage(1);
                setStatusFilter(value);
              }}
            />
          </div>{" "}
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={tableData}
            loading={userPropertyListLoading}
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
          title="Listing Details"
          placement="right"
          width={500}
          onClose={() => setIsPropertyDetailsDrawerOpen(false)}
          open={isPropertyDetailsDrawerOpen}
        >
          {selectedProperty ? (
            <PropertyDetailsDrawer propertyId={selectedProperty.id} />
          ) : (
            <Spin />
          )}
        </Drawer>
      </div>
    </div>
  );
}
