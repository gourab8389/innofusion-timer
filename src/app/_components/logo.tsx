import Image from "next/image";
import Link from "next/link";


const Logo = () => {
  return (
    <div className="hidden lg:flex w-full justify-between relative">
      {/** here i add some margin top later i fix it */}
      <div className="flex items-center justify-center gap-4 mt-5">
        <Link href={"/"} className="cursor-pointer">
          <Image
            src={"/logos/uem.svg"}
            alt="UEM Logo"
            width={65}
            height={65}
            className="shrink-0"
          />
        </Link>
        <div className="w-1 h-12 bg-[#DADADA]" />
        <Link href={"/"} className="cursor-pointer">
          <Image
            src={"/logos/site_logo.png"}
            alt="UEM Logo"
            width={65}
            height={65}
            className="shrink-0"
          />
        </Link>
      </div>
      {/* <ExionsLogo/> */}
    </div>
  );
};

export default Logo;
