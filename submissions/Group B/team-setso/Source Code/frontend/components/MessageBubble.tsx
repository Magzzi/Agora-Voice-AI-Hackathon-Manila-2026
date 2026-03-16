export function MessageBubble({
  align,
  text,
  time,
}: Readonly<{
  align: "left" | "right";
  text: string;
  time: string;
}>) {
  const isRight = align === "right";

  return (
    <div className={isRight ? "flex flex-col items-end" : "flex flex-col"}>
      <div
        className={[
          "max-w-[320px] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ring-1",
          isRight
            ? "bg-indigo-600 text-white ring-indigo-600"
            : "bg-white text-zinc-700 ring-zinc-200",
        ].join(" ")}
      >
        {text}
      </div>
      <div className="mt-1 text-[11px] text-zinc-400">{time}</div>
    </div>
  );
}
