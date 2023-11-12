<div id="picture" class={`carousel flex flex-row relative overflow-hidden ${height} w-full`}>
	<div bind:this={carousel} class="carousel-inner flex w-full">
		{#each photosArray as photo}
			<div style="flex: 0 0 auto" class="w-full">
				<img id="currentImage" src={photo} href={photo} alt="carousel" class="rounded-lg w-full h-full block object-cover">
			</div>
		{/each}
	</div>
	<div class="absolute inset-y-0 flex items-center w-full justify-between">
		<button on:click={() => onClickPrevious()} class="h-12 sm:h-20 cursor-pointer text-white">
			<ChevronLeftIcon />
		</button>
		<button on:click={() => onClickNext()} class="h-12 sm:h-20 cursor-pointer text-white">
			<ChevronRightIcon />
		</button>
	</div>
	{#if context === "account"}
		<button v-if="photosArray.length" on:click={() => deleteOne()}
			class="button-important !w-10 sm:!w-auto absolute top-2 sm:top-4 right-2 sm:right-4 z-10 !h-10 !gap-0 !px-2 sm:!px-4">
			<TrashIcon class="h-4 w-4" />
		</button>
		<button on:click={() => coverInput.click()}
			class="button-tertiary flex gap-2 !w-10 sm:!w-auto absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10 !h-10 !px-2 sm:!px-4">
			<CameraIcon />
			<span class="hidden sm:flex">Add a picture</span>
			<input bind:this={coverInput} ref="coverInput" on:change={(event) => onInputImage(event)} type="file" class="hidden">
		</button>
	{/if}
</div>

<script>
	import ChevronLeftIcon from '$lib/svg/svgChevronLeft.svelte';
	import ChevronRightIcon from '$lib/svg/svgChevronRight.svelte';
	import CameraIcon from '$lib/svg/svgCamera.svelte';
	import TrashIcon from '$lib/svg/svgTrash.svelte';

	export let context;
	export let height;

	console.log(height);
	/* Array of URL to display the images */
	let photoIdx = 0;
	let photosArray = [];
	let carousel;

	/* Array of Files object to send to API */
	let covers = [];
	let coverInput;
	let isImageModif = false;

	const maxPhotos = 10;

	function onClickNext() {
		photoIdx = photoIdx + 1;
		if (photoIdx >= photosArray.length)
			photoIdx = 0;
		// photoIdx = photoIdx % photosArray.length;
		carousel.style.transform = `translateX(-${photoIdx}00%)`;
	}

	function onClickPrevious() {
		photoIdx = photoIdx - 1;
		if (photoIdx < 0)
			photoIdx = photosArray.length - 1;
		carousel.style.transform = `translateX(-${photoIdx}00%)`;
		carousel = carousel;
	}

	function onInputImage(event) {
		let image = event.target.files[0];
		if (!image) return;
		if (image.type.startsWith('image') === false)
			console.error("Please select a valid image");
		else if (image.size / 1000000 >= 10.0)
			console.error("Please select an image smaller than 10 MB");
		else {
			if (covers.length >= maxPhotos)
				console.error("You can't upload more than 10 images");
			else {
				photosArray.push(URL.createObjectURL(image));
				covers.push(image);
				isImageModif = true;
				photoIdx = photosArray.length - 1;
				carousel.style.transform = `translateX(-${photoIdx}00%)`;
				photosArray = photosArray;
			}
		}
	}

	function deleteOne() {
		photosArray.splice(photoIdx, 1);
		covers.splice(photoIdx, 1);
		isImageModif= true;
		if (photoIdx > 0)
			photoIdx--;
		carousel.style.transform = `translateX(-${photoIdx}00%)`;
		photosArray = photosArray;
		covers = covers;
	}
</script>