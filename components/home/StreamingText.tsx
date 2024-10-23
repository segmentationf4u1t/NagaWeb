"use client";
import React, { useState, useEffect, useRef } from "react";

interface StreamingTextProps {
	text: string;
}

const StreamingText: React.FC<StreamingTextProps> = ({ text }) => {
	const [displayedText, setDisplayedText] = useState("");
	const timeoutId = useRef<number | undefined>(undefined);
	const textRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const renderText = (index: number) => {
			if (index < text.length) {
				setDisplayedText((prev) => prev + text[index]);
				timeoutId.current = window.setTimeout(() => renderText(index + 1), 1);
			}
		};

		const handleScroll = () => {
			if (textRef.current) {
				const rect = textRef.current.getBoundingClientRect();
				if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
					renderText(0);
					window.removeEventListener("scroll", handleScroll);
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Check if already in view

		return () => {
			if (timeoutId.current !== undefined) {
				clearTimeout(timeoutId.current);
			}
			window.removeEventListener("scroll", handleScroll);
		};
	}, [text]);

	return (
		<div
			ref={textRef}
			className="streaming-text"
			style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
		>
			{displayedText}
		</div>
	);
};

export default StreamingText;
