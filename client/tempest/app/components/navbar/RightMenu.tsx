"use client";

import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Drawer, Menu } from "antd";
import type { MenuProps } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import RegisterForm from "../forms/RegisterForm";
import LoginForm from "../forms/LoginForm";
import { logout, reset as resetAuth } from "../../lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { toast } from "react-toastify";

type MenuItem = Required<MenuProps>["items"][number];

const items2: MenuItem[] = [
  {
    key: "help",
    label: "Help",
    icon: <QuestionCircleOutlined />,
  },
  {
    type: "divider",
    className: "w-9/10 mx-auto",
  },
  {
    key: "gift-cards",
    label: "Gift Cards",
  },
  {
    type: "divider",
    className: "w-9/10 mx-auto",
  },
  {
    key: "login",
    label: "Login",
  },
  {
    key: "register",
    label: "Register",
  },
  {
    type: "divider",
    className: "w-9/10 mx-auto",
  },
  {
    key: "settigs",
    label: "Settings",
    children: [
      { key: "5", label: "Language" },
      { key: "6", label: "Theme" },
    ],
  },
];

const items1: MenuItem[] = [
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "logout",
    label: "Logout",
  },
  {
    key: "settings",
    label: "Settings",
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
      toast.success("Logout Successful"); {/* Remove this in production */}
      dispatch(resetAuth());
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? <Avatar size="large" src={user?.profile_picture} /> : <></>}
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
    </div>
  );
}

export default RightMenu;
