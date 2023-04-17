<script>
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Line from "$lib/component/Line.svelte";

	let current = {
		name: "Name",
		age: 21,
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		tags: [
			"Sports",
			"Travel",
			"Books",
			"Technology",
			"Cars",
			"Film",
			"Spirituality",
			"Politics",
		],
	};

	let choosen = [];

	let allTags = [
		"Sports",
		"Travel",
		"Arts",
		"Food",
		"Books",
		"Video games",
		"Nature",
		"Technology",
		"History",
		"Fashion",
		"Pets",
		"Cars",
		"Film",
		"Business",
		"Spirituality",
		"Music",
		"Politics",
	];

	onMount(() => {

		for (let i = 0; i < current.tags.length; i++) {
			choosen.push(current.tags[i]);
		}
		choosen = choosen;
		console.log(choosen);
	});

	function handleOnClick(tag) {
		if (choosen.includes(tag)) {
			choosen = choosen.filter((item) => item !== tag);
		} else {
			choosen.push(tag); 
			choosen = choosen;
		}
	}
	
</script>

<div class="flex flex-col w-full bg-transparent h-full p-5">
	<div class="flex flex-col">
		<div class="flex flex-row items-center gap-5 mt-2">
			{current.name}
			<button>
				<Icon icon="mingcute:pencil-line" />
			</button>
		</div>
		<Line />
		<div class="flex flex-row items-center gap-5 mt-2">
			{current.age}
			<button>
				<Icon icon="mingcute:pencil-line" />
			</button>
		</div>
		<Line />
		<!-- <div class="bg-textarea text-black mt-2 h-[200px] rounded-lg mb-2"> -->
			<textarea class="bg-textarea text-black mt-2 h-[200px] rounded-lg mb-2 w-full" cols="30" rows="10" value={current.description}></textarea>
		<!-- </div> -->
		<Line />
		<div class="flex flex-col mt-2 mb-2 w-full">
			<div class="items-center">Tags</div>
			<div class="flex flex-wrap gap-3">
				{#each allTags as tag}
					<button
						class={
						choosen.includes(tag) ? "bg-pink w-[120px] p-1 border rounded-lg": "bg-dark w-[120px] p-1 border rounded-lg"
						}
						on:click={() => {
							handleOnClick(tag);
						}}>
							{tag}
					</button>
				{/each}
			</div>
		</div>
		<Line />
		<button class="flex h-[50px] mt-3 mb-5 w-full rounded-lg bg-green-500 items-center justify-center">
			<Icon icon="dashicons:saved" color="white"/>
		</button>
	</div>
</div>