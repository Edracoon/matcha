import React, { useEffect, useState } from "react";

interface DropComponentProps {
	id: number;
	onDropped: (files: File[] | "maxFileSizeReached") => void;
}

export default function DropComponent({ id, onDropped }: DropComponentProps) {
	const toMegaByte = 1000000;
	const [active, setActive] = useState(false);
	const [files, setFiles] = useState<File[]>([]);

	useEffect(() => {
	console.log(files);
	}, [files]);

	const highlight = (e: React.DragEvent) => {
		e.preventDefault();
		setActive(true);
	};

	const unhighlight = (e: React.DragEvent) => {
		e.preventDefault();
		setActive(false);
	};

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setActive(false);
		handleGivenFiles(e.dataTransfer.files);
	};

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleGivenFiles(e.target.files);
	};

	const handleGivenFiles = (givenFiles: FileList | null) => {
		if (!givenFiles) return;

		const newFiles: File[] = [];
		for (let i = 0; i < givenFiles.length; i++) {
			const file = givenFiles[i];
			const fileSizeMb = file.size / toMegaByte;
			if (fileSizeMb >= 10.0) {
				onDropped("maxFileSizeReached");
				return;
			}
			newFiles.push(file);
		}
		setFiles((prevFiles) => [...prevFiles, ...newFiles]);
		onDropped(newFiles);
	};

	return (
		<div
			className={`h-full px-12 rounded-lg border-2 border-dashed border-gray-300 flex justify-center items-center text-center ${
				active ? "bg-indigo-100" : ""
			}`}
			onDragEnter={highlight}
			onDragOver={highlight}
			onDragLeave={unhighlight}
			onDrop={onDrop}
		>
			<div
				className="flex max-w-lg rounded-md px-6 pt-5 pb-6"
				onDragEnter={highlight}
				onDragLeave={highlight}
				onDragOver={highlight}
				onDrop={onDrop}
			>
				<div className="space-y-1 text-center">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						stroke="currentColor"
						fill="none"
						viewBox="0 0 48 48"
						aria-hidden="true"
					>
						<path
							d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<div className="flex flex-col lg:flex-row text-sm text-gray-600 justify-center">
						<label
							htmlFor={`file-upload${id}`}
							className={`relative cursor-pointer rounded-md font-medium text-indigo-400 focus-within:outline-none hover:text-indigo-500 ${
								active ? "bg-indigo-100" : ""
							}`}
						>
							<span className="text-center">Choose or</span>
							<input
								id={`file-upload${id}`}
								name={`file-upload${id}`}
								type="file"
								className="sr-only"
								onChange={onInput}
							/>
							<p className="pl-1">drag and drop a picture</p>
						</label>
					</div>
					<p className="text-xs text-gray-500">from PNG, JPG... up to 10MB</p>
				</div>
			</div>
		</div>
	);
};
