import React, { useState, useEffect, type FC } from "react";
import { Button } from "../ui/button";
interface TypingInputProps {
	texts: string[];
}

const TypingInput: FC<TypingInputProps> = ({ texts }) => {
	const [currentText, setCurrentText] = useState("");
	const [textIndex, setTextIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [reverse, setReverse] = useState(false);

	useEffect(() => {
		if (textIndex < texts.length) {
			const currentFullText = texts[textIndex];

			if (!reverse) {
				if (charIndex < currentFullText.length) {
					const timeout = setTimeout(() => {
						setCurrentText((prev) => prev + currentFullText[charIndex]);
						setCharIndex(charIndex + 1);
					}, 30);
					return () => clearTimeout(timeout);
				}

				const timeout = setTimeout(() => {
					setReverse(true);
				}, 1000);
				return () => clearTimeout(timeout);
			}

			if (charIndex > 0) {
				const timeout = setTimeout(() => {
					setCurrentText(currentFullText.slice(0, charIndex - 1));
					setCharIndex(charIndex - 1);
				}, 30);
				return () => clearTimeout(timeout);
			}

			const timeout = setTimeout(() => {
				setReverse(false);
				setTextIndex(textIndex + 1);
			}, 200);
			return () => clearTimeout(timeout);
		}

		const timeout = setTimeout(() => {
			setCurrentText("");
			setCharIndex(0);
			setTextIndex(0);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [charIndex, textIndex, texts, reverse]);

	return (
		<div className="typing-input-container">
			<Button
				variant={"outline"}
				className="typing-input w-full"
				style={{ borderRadius: "2rem" }}
			>
				{currentText}
			</Button>
		</div>
	);
};

export default TypingInput;
