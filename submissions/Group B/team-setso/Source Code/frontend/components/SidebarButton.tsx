import React from "react";

export function SidebarButton({
  children,
  active,
  ariaLabel,
}: Readonly<{
  children: React.ReactNode;
  active?: boolean;
  ariaLabel: string;
}>) {
  return (
    <button
      aria-label={ariaLabel}
      className={[
        "flex h-11 w-full items-center justify-center rounded-2xl transition",
        active
          ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
