import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

type SpinnerOverlayProps = {
  tip?: React.ReactNode;
  size?: "small" | "default" | "large";
  zIndex?: number;
};

export default function SpinnerOverlay({
  size = "default",
  tip,
  zIndex = 9999,
}: SpinnerOverlayProps) {
  const indicator = (
    <LoadingOutlined style={{ fontSize: 48, color: "white" }} spin />
  );

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex,
    backgroundColor: "rgba(0, 0, 0, 0.25)", // <-- dim the whole screen
    pointerEvents: "all",
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    minWidth: 96,
    minHeight: 96,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  };

  return (
    <div style={overlayStyle} role="status" aria-live="polite">
      <div style={containerStyle}>
        <Spin indicator={indicator} size={size} tip={tip} />
      </div>
    </div>
  );
}
