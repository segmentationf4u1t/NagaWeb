import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import { Core } from "@/conf/cfg";
import Head from "next/head";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "NagaAI - Cheapest AI API",
	description:
		"Unlock advanced artificial intelligence capabilities with NagaAI. Leverage powerful APIs for GPT-4 language models, image generation, text-to-speech, transcription, translation, moderation & more. Elevate your applications with bleeding-edge AI from the industry leader.",
	keywords:
		"AI APIs, GPT-4, Claude 3, ChatGPT, image generation, text-to-speech, speech-to-text, translation, moderation, advanced AI, cutting-edge AI, artificial intelligence solutions, AI for developers, AI for businesses, NagaAI, cheap, best, best ai api, best ai api 2024, best ai api 2024",
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
	),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: process.env.NEXT_PUBLIC_WEB_URL,
		siteName: Core.name,
		images: [
			{
				url: `${process.env.NEXT_PUBLIC_WEB_URL}logos/naga.png`,
				width: 600,
				height: 600,
			},
		],
	},
	other: {
		cryptomus: "5e45c09f",
	},
};

interface Image {
	url: string;
	width: number;
	height: number;
}

interface OpenGraph {
	type: string;
	locale: string;
	url: string | undefined;
	siteName: string;
	images: Image[];
}

interface Metadata {
	title: string;
	description: string;
	keywords: string;
	metadataBase: URL | null;
	openGraph: OpenGraph;
	other?: {
		[key: string]: string;
	};
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<StoreProvider>
			<html lang="en" suppressHydrationWarning>
				<Head>
					<title>{metadata.title}</title>
					<meta name="description" content={metadata.description} />
					<meta name="keywords" content={metadata.keywords} />
					<meta property="og:type" content={metadata.openGraph.type} />
					<meta property="og:locale" content={metadata.openGraph.locale} />
					<meta property="og:url" content={metadata.openGraph.url} />
					<meta property="og:site_name" content={metadata.openGraph.siteName} />
					{metadata.openGraph.images.map((image) => (
						<meta key={image.url} property="og:image" content={image.url} />
					))}
					<script
						src="https://unpkg.com/react-scan/dist/auto.global.js"
						async
					/>
				</Head>
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem={false}
					>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</StoreProvider>
	);
}
