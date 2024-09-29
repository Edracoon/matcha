import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { showNotification, NotifType } from "./Notif";

interface CarouselProps {
	urlsArray: string[];
	isEdit?: boolean;
	onAdd?: (files: File) => void;
	onDelete?: (id: string) => void;
	sx?: string;
}

export default function Carousel({ urlsArray = [], isEdit = true, onAdd, onDelete, sx = "" }: CarouselProps) {

	const [photosArray, setPhotosArray] = useState(urlsArray);
	const [photoIdx, setPhotoIdx] = useState(0);
	
	const carousel = useMemo<HTMLElement>(() => { return document.querySelector('.carousel-inner') as HTMLElement }, [document.querySelector('.carousel-inner')]);
	
	const [covers, setCovers] = useState<File[]>([]);
	const coverInput = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		setPhotosArray(urlsArray);
		const newIdx = urlsArray.length - 1;
		setTimeout(() => {
			carousel.style.transform = `translateX(-${newIdx}00%)`;
			setPhotoIdx(newIdx);
		}, 1000);
	}, [urlsArray]);

	const maxPhotos = 5;

	function onClickNext() {
		const newIdx = photoIdx >= photosArray.length - 1 ? 0 : photoIdx + 1;
		setPhotoIdx(newIdx);
		carousel.style.transform = `translateX(-${newIdx}00%)`;
	}

	function onClickPrevious() {
		const newIdx = photoIdx === 0 ? photosArray.length - 1 : photoIdx - 1;
		setPhotoIdx(newIdx)
		carousel.style.transform = `translateX(-${newIdx}00%)`;
	}

	function onInputImage(e: React.ChangeEvent<HTMLInputElement>) {
		let image = e?.target?.files?.[0];
		if (!image) return;
		if (image.type.startsWith('image') === false)
			showNotification(NotifType.WARNING, "Careful", "Please select a valid image");
		else if (image.size / 1000000 >= 10.0)
			showNotification(NotifType.WARNING, "Careful", "Please select an image smaller than 10 MB");
		else {
			if (photosArray.length >= maxPhotos)
				showNotification(NotifType.WARNING, "Careful", "You can't upload more than 5 images");
			else {
				onAdd?(image) : null;
			}
		}
	}

	function deleteOne() {

		const newPhotos = photosArray.filter((_, index) => index !== photoIdx);
		setPhotosArray(newPhotos);

		const newCovers = covers.filter((_, index) => index !== photoIdx);
    	setCovers(newCovers);
	
		const newIdx = photoIdx === 0 ? 0 : photoIdx - 1;
		setPhotoIdx(newIdx);
		
		carousel.style.transform = `translateX(-${newIdx}00%)`;

		onDelete?(photosArray[photoIdx]) : null;
	}

	const handleClick = () => {
		if (coverInput.current) {
			coverInput.current.click();
		}
	}

	return (
		<div className={"carousel w-full sm:w-[500px] flex flex-row relative overflow-hidden h-[500px] sm:h-[600px] " + sx}>
			<div className="carousel-inner flex w-full">
				{photosArray.length === 0 &&
					<div style={{ flex: '0 0 auto' }} className="w-full">
						<img
							id="currentImage"
							src={"/src/assets/cover-placeholder.png"}
							alt="cover placeholder"
							className="rounded-lg w-full h-full block object-cover"
						/>
					</div>
				}
				{photosArray.map((photo, index) => (
					<div key={index} style={{ flex: '0 0 auto' }} className="w-full">
						<img
							id="currentImage"
							src={photo}
							alt="carousel"
							className="rounded-lg w-full h-full block object-cover"
						/>
					</div>
				))}
				
			</div>
			{isEdit && <div className="absolute text-white bg-indigo-500/60 px-1 py-1 rounded-lg text-lg bottom-2 sm:bottom-4 left-4 sm:left-6 z-1">
				{photosArray.length > 0 ? photoIdx + 1 : 0} / 5
			</div>}

			{/* Left and Right Navigation Arrows */}
			<div className="absolute inset-y-0 flex items-center w-full justify-between">
				<ChevronLeftIcon
					className="h-8 cursor-pointer text-white bg-indigo-500/60 rounded-lg ml-4"
					onClick={onClickPrevious}
				/>
				<ChevronRightIcon
					className="h-8 cursor-pointer text-white bg-indigo-500/60 rounded-lg mr-4"
					onClick={onClickNext}
				/>
			</div>
			{ photosArray.length > 0 && isEdit &&
				<button onClick={() => deleteOne()} className="text-white bg-indigo-500/60 px-1 py-1 rounded-lg text-sm !w-10 sm:!w-auto absolute top-2 sm:top-4 right-2 sm:right-4 z-10 !h-10 !gap-0">
					<XMarkIcon className="h-6 w-6" />
				</button>
			}
			{isEdit && <button
				onClick={handleClick}
				className=" text-white bg-indigo-500/60 px-1 py-1 rounded-lg text-sm absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10 !gap-0"
			>
				<PlusIcon className="h-6 w-6" />
				{/* <span className="hidden sm:flex">Add a picture</span> */}
			</button>}

			{isEdit && <input
				ref={coverInput}
				type="file"
				onChange={(e) => onInputImage(e)}
				className="hidden"
			/>}
		</div>
	);
};