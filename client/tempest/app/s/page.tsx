import React, { Suspense } from "react";
import SearchContent from "@/app/components/search/SearchContent";
import { Spin } from "antd";

export default function Page() {
  return (
    <Suspense fallback={<Spin></Spin>}>
      <SearchContent />
    </Suspense>
  );
}
