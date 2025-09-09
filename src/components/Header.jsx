import React from "react";
import { useStore } from "../context/StoreContext";

export default function Header() {
  const { state } = useStore();
  return (
    <header
      dangerouslySetInnerHTML={{
        __html: `<?xml version='1.0' encoding='UTF-8'?>`,
      }}
    >
      {/* We'll mount existing static HTML via index.html. This placeholder is replaced. */}
      <div />
    </header>
  );
}
