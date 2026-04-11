import TopologyCanvas from "../components/TopologyCanvas";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 font-sans dark:bg-black">
      <header className="flex h-14 items-center px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black/50 backdrop-blur-sm z-10 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
          DNTV <span className="text-zinc-400 font-normal ml-2">v1.0</span>
        </h1>
        <div className="ml-auto flex items-center gap-4">
          {/* Auth/User Info will go here */}
        </div>
      </header>
      <main className="flex-1 min-h-0 relative">
        <TopologyCanvas />
      </main>
    </div>
  );
}
