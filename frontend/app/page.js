import Image from "next/image";
import { Landing } from "@/components/component/landing";
import {Nav} from "@/components/component/nav";

export default function Home() {
  return (
    
    (<div className="flex flex-col min-h-[100dvh] bg-background">
      <Nav/>
      <Landing/>
    </div>)
  );
}
