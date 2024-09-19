import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon, CameraIcon, PlusCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { showNotification, NotifType } from "./Notif";

interface CarouselProps {
	urlsArray: string[];
}

export default function Carousel({ urlsArray = [] }: CarouselProps) {

	const [photosArray, setPhotosArray] = useState(urlsArray);
	const [photoIdx, setPhotoIdx] = useState(0);
	
	const carousel = useMemo<HTMLElement>(() => { return document.querySelector('.carousel-inner') as HTMLElement }, [document.querySelector('.carousel-inner')]);
	
	const [covers, setCovers] = useState<File[]>([]);
	const coverInput = useRef<HTMLInputElement | null>(null);
	const [isImageModif, setIsImageModif] = useState(false);

	useEffect(() => {
		console.log("[Carousel] photoIdx: ", photoIdx);
		console.log("[Carousel] photosArray: ", photosArray);
		console.log("[Carousel] covers: ", covers);
	}, [photosArray, covers, photoIdx]);
	
	const maxPhotos = 10;

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
			0;// toaster.error("Please select a valid image");
		else if (image.size / 1000000 >= 10.0)
			0;// toaster.error("Please select an image smaller than 10 MB");
		else {
			if (covers.length >= maxPhotos)
				showNotification(NotifType.WARNING, "Careful", "You can't upload more than 10 images");
			else {
				const newIdx = photosArray.length;
				
				// Generate a URL for the image and push it to photosArray
				setPhotosArray((prevPhotosArray) => [...prevPhotosArray, URL.createObjectURL(image)]);
				// Push the image to covers array
				setCovers((prevCovers) => [...prevCovers, image]);

				setIsImageModif(true);
				setPhotoIdx(newIdx);
				
				carousel.style.transform = `translateX(-${newIdx}00%)`;
			}
		}
	}
	
	function deleteOne() {

		const newPhotos = photosArray.filter((_, index) => index !== photoIdx);
		setPhotosArray(newPhotos);

		const newCovers = covers.filter((_, index) => index !== photoIdx);
    	setCovers(newCovers);
	
		setIsImageModif(true);
		const newIdx = photoIdx === 0 ? 0 : photoIdx - 1;
		setPhotoIdx(newIdx);
		
			carousel.style.transform = `translateX(-${newIdx}00%)`;
	}

	const handleClick = () => {
		if (coverInput.current) {
			coverInput.current.click();
		}
	}

	return (
		<div className="carousel w-[40%] flex flex-row relative overflow-hidden h-[500px] my-10">
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
			{ photosArray.length > 0 &&
				<button onClick={() => deleteOne()} className="text-white bg-indigo-500/60 px-1 py-1 rounded-lg text-sm !w-10 sm:!w-auto absolute top-2 sm:top-4 right-2 sm:right-4 z-10 !h-10 !gap-0">
					<XMarkIcon className="h-6 w-6" />
				</button>
			}
			<button
				onClick={handleClick}
				className=" text-white bg-indigo-500/60 px-1 py-1 rounded-lg text-sm absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10 !gap-0"
			>
				<PlusIcon className="h-6 w-6" />
				{/* <span className="hidden sm:flex">Add a picture</span> */}
			</button>

			<input
				ref={coverInput}
				type="file"
				onChange={(e) => onInputImage(e)}
				className="hidden"
			/>
		</div>
	);
};