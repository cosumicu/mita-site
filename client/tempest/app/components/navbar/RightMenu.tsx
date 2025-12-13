"use client";

import React, { useState } from "react";
import { Avatar, Drawer, Menu, Button, Modal } from "antd";
import type { MenuProps } from "antd";
import {
  MenuOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  MailOutlined,
  SettingOutlined,
  LogoutOutlined,
  GiftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import RegisterForm from "../forms/RegisterForm";
import LoginForm from "../forms/LoginForm";
import { logout, reset as resetAuth } from "../../lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { toast } from "react-toastify";
import CreatePropertyModal from "../modals/CreatePropertyModal";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

const items2: MenuItem[] = [
  {
    key: "help",
    label: "Help & Support",
    icon: <QuestionCircleOutlined />,
  },
  {
    key: "gift-cards",
    label: "Gift Cards",
    icon: <GiftOutlined />,
  },
  { type: "divider" },
  {
    key: "login",
    label: "Login",
    icon: <UserOutlined />,
  },
  {
    key: "register",
    label: "Register",
    icon: <PlusOutlined />,
  },
  { type: "divider" },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      { key: "language", label: "Language" },
      { key: "theme", label: "Theme" },
    ],
  },
];

const items1: MenuItem[] = [
  {
    key: "user-section",
    label: "User",
    type: "group",
    children: [
      { key: "profile", label: "Profile", icon: <UserOutlined /> },
      { key: "inbox", label: "Inbox", icon: <MailOutlined /> },
    ],
  },
  { type: "divider" },

  {
    key: "guest-section",
    label: "Guest",
    type: "group",
    children: [
      {
        key: "guest-reservations",
        label: "Reservations",
      },
      { key: "guest-favorites", label: "Favorites" },
    ],
  },
  { type: "divider" },
  {
    key: "host-section",
    label: "Host",
    type: "group",
    children: [
      { key: "host-dashboard", label: "Dashboard" },
      { key: "host-properties", label: "Listings" },
      { key: "host-reservations", label: "Reservations" },
      {
        key: "host-requests",
        label: "Reservation Requests",
      },
    ],
  },
  { type: "divider" },

  {
    key: "logout-section",
    label: "Account",
    type: "group",
    children: [
      { key: "settings", label: "Settings", icon: <SettingOutlined /> },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        className: "text-red-500 font-semibold",
      },
    ],
  },
];

function RightMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [current, setCurrent] = useState("1");

  const [openMain, setOpenMain] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  // const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] =
  //   useState(false);

  const showMain = () => {
    setOpenMain(true);
  };
  const onCloseMain = () => {
    setOpenMain(false);
  };

  const showLogin = () => {
    setOpenLogin(true);
  };
  const onCloseLogin = () => {
    setOpenLogin(false);
  };

  const showRegister = () => {
    setOpenRegister(true);
  };
  const onCloseRegister = () => {
    setOpenRegister(false);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);

    switch (e.key) {
      case "login":
        showLogin();
        break;

      case "register":
        showRegister();
        break;

      case "help":
        setOpenMain(false);
        router.push(`/help`);
        break;

      case "gift-cards":
        setOpenMain(false);
        router.push(`/gift2cards`);
        break;

      case "profile":
        setOpenMain(false);
        router.push(`/users/profile/${user?.id}`);
        break;

      case "inbox":
        setOpenMain(false);
        router.push(`/messages`);
        break;

      case "host-dashboard":
        setOpenMain(false);
        router.push(`/host/dashboard`);
        break;

      case "host-properties":
        setOpenMain(false);
        router.push(`/host/myproperties`);
        break;

      case "host-requests":
        setOpenMain(false);
        router.push(`/host/requests`);
        break;

      case "guest-favorites":
        setOpenMain(false);
        router.push(`/guest/liked`);
        break;

      case "guest-reservations":
        setOpenMain(false);
        router.push(`/guest/reservations`);
        break;

      case "host-reservations":
        setOpenMain(false);
        router.push(`/host/reservations`);
        break;

      case "logout":
        dispatch(logout());
        router.push("/");
        window.location.reload();
        toast.success("Logout Successful");
        dispatch(resetAuth());
        break;

      default:
        console.warn(`Unhandled menu key: ${e.key}`);
        break;
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-4">
      {user ? (
        <>
          {" "}
          <Button
            type="primary"
            onClick={() => router.push("/host/create-listing")}
            className="!hidden sm:!block px-6 py-2 !rounded-full tracking-wide"
          >
            <div>Become a host</div>
          </Button>
          <Link href={`/users/profile/${user.id}`}>
            <Avatar
              className="!hidden sm:!inline-block"
              size={48}
              src={user?.profile_picture_url}
            />
          </Link>
        </>
      ) : (
        <></>
      )}
      <div className="outline-none" onClick={showMain} tabIndex={-1}>
        {" "}
        {/* style={{ outline: "none" }} tabIndex={-1} solves the issue of border showing when drawer is opened */}
        <MenuOutlined />
      </div>

      <Drawer
        title="Mita Site"
        closable={{ "aria-label": "Close Button" }}
        onClose={onCloseMain}
        open={openMain}
        styles={{
          body: {
            padding: 4,
          },
        }}
      >
        <Menu
          onClick={onClick}
          style={{ width: "100%" }}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[current]}
          mode="inline"
          items={user ? items1 : items2}
        />
        <Drawer
          title="Login"
          width={320}
          closable={false}
          onClose={onCloseLogin}
          open={openLogin}
        >
          {openLogin && (
            <LoginForm
              onSuccess={() => {
                onCloseLogin();
              }}
            />
          )}
        </Drawer>

        <Drawer
          title="Register"
          width={320}
          closable={false}
          onClose={onCloseRegister}
          open={openRegister}
        >
          {openRegister && (
            <RegisterForm
              onSuccess={() => {
                onCloseRegister();
              }}
            />
          )}
        </Drawer>
      </Drawer>
      {/* <Modal
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            Create Listing
          </div>
        }
        open={isCreatePropertyModalOpen}
        footer={null}
        onCancel={() => {
          setIsCreatePropertyModalOpen(false);
        }}
        width={1100}
        centered
        destroyOnHidden
      >
        <CreatePropertyModal
          onSuccess={() => setIsCreatePropertyModalOpen(false)}
        />
      </Modal> */}
    </div>
  );
}

export default RightMenu;
