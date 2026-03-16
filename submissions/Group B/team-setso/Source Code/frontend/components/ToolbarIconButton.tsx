import React from "react";

export function ToolbarIconButton({
  children,
  ariaLabel,
}: Readonly<{
  children: React.ReactNode;
  ariaLabel: string;
}>) {
  return (
    <button
      aria-label={ariaLabel}
      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100"
    >
      {children}
    </button>
  );
}
