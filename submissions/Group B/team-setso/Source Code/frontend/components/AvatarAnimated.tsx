"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export function AvatarAnimated() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 600);
    return () => clearInterval(id);
  }, []);

  const src = frame === 0 ? "/mr-yami-closed.png" : "/mr-yami-open.png";

  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-indigo-200 shadow-lg">
      <Image
        src={src}
        alt="YAMI AI Avatar"
        fill
        sizes="100vw"
        className="object-cover object-top transition-opacity duration-150"
        priority
      />
    </div>
  );
}
