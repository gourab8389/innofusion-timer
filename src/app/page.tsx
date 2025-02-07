import Image from "next/image";
import CountdownTimer from "./_components/timer";

export default function Home() {
  return (
    <main className="flex items-center justify-center w-screen min-h-screen h-screen relative vmax-w-screen-2xl mx-auto ">
      <nav className="flex items-center justify-between w-full gap-4 fixed top-0 px-6 h-auto border-b py-3 inset-x-0">
      <Image src={"/logo.png"} alt="Hack Snippet" width={200} height={200} className="pointer-events-none select-none"/>
      </nav>
      <CountdownTimer />
    </main>
  );
}
