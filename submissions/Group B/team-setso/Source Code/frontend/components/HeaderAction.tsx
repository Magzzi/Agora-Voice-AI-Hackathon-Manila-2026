import React from "react";

export function HeaderAction({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <button className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
      {children}
    </button>
  );
}
