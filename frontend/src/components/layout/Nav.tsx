export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200">
      <div className="max-w-[90vw] mx-auto px-[5vw] py-[0.5vw] flex items-center justify-between">
        <div className="text-[1.5vw] font-semibold">glitchLink</div>
        <button>Login</button>
      </div>
    </nav>
  );
}
