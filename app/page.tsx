"use client";
import HeroSection from "@/components/HeroT";
import dynamic from "next/dynamic";
const Reel = dynamic(() => import("@/components/Reel"));
const SectionB = dynamic(() => import("@/components/SectionB"));
import Nav from "@/components/Nav";
//import SectionB from '@/components/SectionB'
import { Core } from "@/conf/cfg";
export default function Home() {
	return (
		<div className="container">
			<Nav title={Core.title} version={Core.version} discord={Core.discord} />
			<HeroSection />
			<SectionB />
			<Reel />
		</div>
	);
}
