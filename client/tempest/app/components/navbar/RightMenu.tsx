"use client";

import React, { useState } from "react";
import { Avatar, Drawer, Menu, Button, Modal } from "antd";
import type { MenuProps } from "antd";
import {
  MenuOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  UserOutlined,
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
  { key: "profile", label: "Profile", icon: <UserOutlined /> },
  { key: "properties", label: "My Properties", icon: <HomeOutlined /> },
  { key: "reservations", label: "Reservations", icon: <GiftOutlined /> },
  { key: "settings", label: "Settings", icon: <SettingOutlined /> },
  { type: "divider" },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    className: "text-red-500 font-semibold",
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
  const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] =
    useState(false);

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

    if (e.key === "login") {
      showLogin();
    } else if (e.key === "register") {
      showRegister();
    }

    if (e.key === "logout") {
      dispatch(logout());
      router.push("/");
      window.location.reload();
      toast.success("Logout Successful");
      {
        /* Remove this in production */
      }
      dispatch(resetAuth());
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {" "}
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => setIsCreatePropertyModalOpen(true)}
          >
            Host Property
          </Button>
          <Avatar size="large" src={user?.profile_picture} />
        </>
      ) : (
        <></>
      )}
      <div onClick={showMain} style={{ outline: "none" }} tabIndex={-1}>
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
      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            Create Property
          </div>
        }
        open={isCreatePropertyModalOpen}
        footer={null}
        onCancel={() => {
          setIsCreatePropertyModalOpen(false);
        }}
        width={1100}
        destroyOnHidden
      >
        <CreatePropertyModal
          onSuccess={() => setIsCreatePropertyModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default RightMenu;
