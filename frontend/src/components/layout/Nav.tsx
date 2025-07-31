"use client";

import AuthModalManager from "../ui/AuthModalManager";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200">
      <div className="mx-auto px-[15vw] py-[0.5vw] flex items-center justify-between">
        <div className="text-[1.5vw] font-semibold">glitchLink</div>

        {/* Tombol Auth & Modal */}
        <div className="flex items-center gap-[1vw]">
          {/* Bisa ganti dengan tombol user if logged in */}
          <AuthModalManager />
        </div>
      </div>
    </nav>
  );
}
