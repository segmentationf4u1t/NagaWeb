"use client";

import { useTheme } from "next-themes";
import { useEffect} from "react";
import { Button } from "@/components/ui/button";
import SavingCosts from "./SavingCosts";
import { Core } from "@/conf/cfg";
import { motion } from "framer-motion";
import Link from "next/link";

import {
	SiAnthropic,
	SiGoogle,
	SiMicrosoft,
	SiAmazon,
	SiNvidia,
	SiMeta,
	SiOpenai,
} from "react-icons/si";

const iconComponents = [
	SiAnthropic,
	SiGoogle,
	SiMicrosoft,
	SiAmazon,
	SiNvidia,
	SiMeta,
	SiOpenai,
];

const iconPositions = [
	"right-[calc(100%+63px)] top-0",
	"right-[calc(100%+195px)] top-[52px]",
	"right-[calc(100%+34px)] top-[144px]",
	"right-[calc(100%+268px)] top-[164px]",
	"right-[calc(100%+156px)] top-[240px]",
	"right-[calc(100%+242px)] top-[340px]",
	"right-[calc(100%+66px)] top-[366px]",
	"left-[calc(100%+63px)] top-0",
	"left-[calc(100%+195px)] top-[52px]",
	"left-[calc(100%+34px)] top-[144px]",
	"left-[calc(100%+268px)] top-[164px]",
	"left-[calc(100%+156px)] top-[240px]",
	"left-[calc(100%+242px)] top-[340px]",
	"left-[calc(100%+66px)] top-[366px]",
];

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		}
	}
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: { duration: 0.5 }
	}
};

const iconVariants = {
	hidden: { scale: 0, opacity: 0 },
	visible: (i: number) => ({
		scale: 1,
		opacity: 1,
		transition: {
			delay: i * 0.1,
			duration: 0.5,
			type: "spring",
			stiffness: 100
		}
	})
};

export default function Hero() {
	const { setTheme } = useTheme();

	useEffect(() => {
		setTheme("dark");
	}, [setTheme]);

	return (
		<div className="relative rounded-lg">
			<motion.section 
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="py-16 md:py-32"
			>
				<div className="container flex flex-col items-center text-center">
					<motion.h1 
						variants={itemVariants}
						className="my-4 md:my-6 text-pretty text-3xl md:text-4xl font-bold lg:text-6xl text-foreground"
					>
						Dirty Cheap Proprietary Models
					</motion.h1>
					
					<motion.p 
						variants={itemVariants}
						className="mb-6 md:mb-8 max-w-3xl text-muted-foreground text-sm md:text-base lg:text-xl"
					>
						We offer powerful APIs for language models, image generation, speech
						processing, and more. Elevate your applications with our advanced
						artificial{" "}
						<span className="text-white font-bold">
							intelligence for minimal cost.
						</span>
					</motion.p>

					<motion.div 
						variants={itemVariants}
						className="flex w-full flex-col justify-center gap-2 sm:flex-row"
					>
						<Button 
							className="w-full sm:w-auto bg-neutral-800 text-white hover:bg-neutral-700"
							onClick={() => window.open(Core.discord, '_blank', 'noopener,noreferrer')}
						>
							Join Discord
						</Button>
						<Link href="/dashboard" passHref legacyBehavior>
							<Button
								variant="outline"
								className="w-full sm:w-auto text-green-500"
							>
								or Login
							</Button>
						</Link>
					</motion.div>
				</div>

				<div className="mt-8 aspect-video text-clip sm:mt-16 md:aspect-auto md:h-[420px]">
					<div className="relative mx-auto flex max-w-3xl flex-col">
						{iconPositions.map((position, index) => {
							const IconComponent = iconComponents[index % iconComponents.length];
							return (
								<motion.div
									key={`icon-${IconComponent.name}-${index}`}
									variants={iconVariants}
									initial="hidden"
									animate="visible"
									custom={index}
									className={`absolute hidden size-[64px] rounded-2xl bg-secondary ring-1 ring-inset ring-secondary-foreground/10 md:block ${position}`}
								>
									<IconComponent
										size={48}
										className="m-2 transition-colors duration-300 ease-in-out hover:text-primary"
									/>
								</motion.div>
							);
						})}
						<motion.div 
							variants={itemVariants}
							className="container mx-auto"
						>
							<SavingCosts />
						</motion.div>
					</div>
				</div>
			</motion.section>
		</div>
	);
}
