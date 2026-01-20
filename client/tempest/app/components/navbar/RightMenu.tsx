"use client";

import React, { useMemo, useState } from "react";
import { Avatar, Drawer, Menu, Button, Modal } from "antd";
import type { MenuProps } from "antd";
import {
  MenuOutlined,
  QuestionCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import RegisterForm from "../modals/RegisterForm";
import LoginForm from "../modals/LoginForm";
import { logout, reset as resetAuth } from "../../lib/features/auth/authSlice";
import {
  getCurrentUser,
  reset as resetUser,
} from "../../lib/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { toast } from "react-toastify";
import Link from "next/link";
import { getUserPropertyList } from "@/app/lib/features/properties/propertySlice";
import LogoutConfirmation from "../modals/LogoutConfirmation";

type MenuItem = Required<MenuProps>["items"][number];

const items2: MenuItem[] = [
  { key: "help", label: "Help & Support", icon: <QuestionCircleOutlined /> },
  { key: "gift-cards", label: "Gift Cards", icon: <TagOutlined /> },
  { type: "divider" },
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
  { type: "divider" },
  {
    key: "settings",
    label: "Settings",
    children: [
      { key: "language", label: "Language" },
      { key: "theme", label: "Theme" },
    ],
  },
];

function RightMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const { user } = useAppSelector((state) => state.user);

  const [current, setCurrent] = useState("1");
  const [openMain, setOpenMain] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  const isHostActive = user?.host_status === "ACTIVE";

  // ✅ Build authenticated menu items based on host_status
  const authedItems: MenuItem[] = useMemo(() => {
    const base: MenuItem[] = [
      {
        key: "user-section",
        label: "User",
        type: "group",
        children: [
          { key: "profile", label: "Profile" },
          { key: "inbox", label: "Inbox" },
          { key: "saved", label: "Saved" },
        ],
      },
      { type: "divider" },
      {
        key: "guest-section",
        label: "Guest",
        type: "group",
        children: [{ key: "guest-reservations", label: "Reservations" }],
      },
      { type: "divider" },
    ];

    // ✅ Only include Host menu when ACTIVE
    if (isHostActive) {
      base.push({
        key: "host-section",
        label: "Host",
        type: "group",
        children: [
          { key: "host-dashboard", label: "Dashboard" },
          { key: "host-calendar", label: "Calendar" },
          { key: "host-properties", label: "Listings" },
          { key: "host-reservations", label: "Reservations" },
          { key: "host-requests", label: "Reservation Requests" },
        ],
      });
      base.push({ type: "divider" });
    }

    base.push({
      key: "logout-section",
      label: "Account",
      type: "group",
      children: [
        { key: "settings", label: "Settings" },
        {
          key: "logout",
          label: "Logout",
          className: "text-red-500 font-semibold",
        },
      ],
    });

    return base;
  }, [isHostActive]);

  const showMain = () => setOpenMain(true);
  const onCloseMain = () => setOpenMain(false);

  const showLogin = () => setOpenLogin(true);
  const onCloseLogin = () => setOpenLogin(false);

  const showRegister = () => setOpenRegister(true);
  const onCloseRegister = () => setOpenRegister(false);

  const onClick: MenuProps["onClick"] = async (e) => {
    setCurrent(e.key);

    switch (e.key) {
      case "login":
        if (pathname === "/login") return onCloseMain();
        if (pathname === "/register") {
          router.push("/login");
          return onCloseMain();
        }
        showLogin();
        break;

      case "register":
        if (pathname === "/register") return onCloseMain();
        if (pathname === "/login") {
          router.push("/register");
          return onCloseMain();
        }
        showRegister();
        break;

      case "help":
        onCloseMain();
        router.push("/help");
        break;

      case "gift-cards":
        onCloseMain();
        router.push("/gift2cards");
        break;

      case "profile":
        onCloseMain();
        router.push(`/users/profile/${user?.user_id}`);
        break;

      case "inbox":
        onCloseMain();
        router.push("/messages");
        break;

      case "saved":
        onCloseMain();
        router.push("/saved");
        break;

      case "guest-reservations":
        onCloseMain();
        router.push("/guest/reservations");
        break;

      // Host routes (these keys won't exist unless ACTIVE, but keeping is fine)
      case "host-dashboard":
        onCloseMain();
        router.push("/host/dashboard");
        break;

      case "host-calendar":
        onCloseMain();
        router.push("/host/calendar");
        break;

      case "host-properties":
        onCloseMain();
        router.push("/host/listings");
        break;

      case "host-requests":
        onCloseMain();
        router.push("/host/requests");
        break;

      case "host-reservations":
        onCloseMain();
        router.push("/host/reservations");
        break;

      case "logout":
        setOpenLogout(true);
        break;

      default:
        console.warn(`Unhandled menu key: ${e.key}`);
        break;
    }
  };

  const handleBecomeAHost = async () => {
    try {
      const freshUser = await dispatch(getCurrentUser()).unwrap();

      // If already active, go to dashboard
      if (freshUser.host_status === "ACTIVE") {
        onCloseMain();
        router.push("/host/dashboard");
        return;
      }

      const res = await dispatch(
        getUserPropertyList({
          filters: { user: freshUser.user_id, status: "" },
          pagination: { page: 1, page_size: 1 },
        }),
      ).unwrap();

      const hasListing = (res?.results?.length ?? 0) > 0;

      onCloseMain();

      if (hasListing) {
        router.push("/host/onboarding");
      } else {
        router.push("/host/create-listing");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error("Could not check host status. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-4">
      {user ? (
        <>
          {["INACTIVE", "ONBOARDING"].includes(user.host_status) && (
            <Button shape="round" type="primary" onClick={handleBecomeAHost}>
              <div>Become a Host</div>
            </Button>
          )}

          <Link href={`/users/profile/${user.user_id}`}>
            <Avatar
              className="!hidden sm:!inline-block"
              size={48}
              src={user.profile_picture_url}
            />
          </Link>
        </>
      ) : null}

      <div className="outline-none" onClick={showMain} tabIndex={-1}>
        <MenuOutlined />
      </div>

      <Drawer
        title="Mita Site"
        closable={{ "aria-label": "Close Button" }}
        onClose={onCloseMain}
        open={openMain}
        styles={{ body: { padding: 4 } }}
      >
        <Menu
          onClick={onClick}
          style={{ width: "100%" }}
          selectedKeys={[current]}
          mode="inline"
          items={user ? authedItems : items2}
        />
      </Drawer>

      <Modal
        title={<span className="block text-center font-semibold">Log in</span>}
        open={openLogin}
        onCancel={onCloseLogin}
        footer={null}
        centered
        destroyOnHidden
      >
        {openLogin && (
          <LoginForm
            onSuccess={onCloseLogin}
            onSwitchToRegister={() => {
              onCloseLogin();
              setOpenRegister(true);
            }}
          />
        )}
      </Modal>

      <Modal
        title={
          <span className="block text-center font-semibold">Register</span>
        }
        open={openRegister}
        onCancel={onCloseRegister}
        footer={null}
        centered
        destroyOnHidden
      >
        {openRegister && (
          <RegisterForm
            onSuccess={onCloseRegister}
            onSwitchToLogin={() => {
              onCloseRegister();
              setOpenRegister(false);
              setOpenLogin(true);
            }}
          />
        )}
      </Modal>

      <Modal
        title={<span className="block text-center font-semibold">Logout</span>}
        open={openLogout}
        onCancel={() => setOpenLogout(false)}
        footer={null}
        centered
        width="auto"
        destroyOnHidden
      >
        <LogoutConfirmation
          onSuccess={() => setOpenLogout(false)}
          onClose={() => setOpenLogout(false)}
        ></LogoutConfirmation>
      </Modal>
    </div>
  );
}

export default RightMenu;
