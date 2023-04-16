<script>
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
    import { current_component } from "svelte/internal";

	let i = 0;
	let Preferences = {
		gender: "",
		age: 0,
		sexual_orientation: "",
		interests: [],
	};

	let Questions = [
		{question : "What's your gender ?", type: "gender"},
		{question: "What's your age ?", type: "age"},
		{question: "What's your sexual orientation ?", type: "sexual_orientation"},
		{question: "What are your interests ?", type: "interests"},
	];
	let Answer = [
		['cisgender', 'transgender', 'non binary', 'fluid'],
		null,
		['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual'],
		["Sports", "Travel", "Arts", "Food","Books","Video games","Nature","Technology","History","Fashion","Pets","Cars","Film","Business","Spirituality","Music","Politics"],
	]

	onMount(() => {});

	function getEmoji(tag) {
		switch (tag) {
			case "Sports":
				return "🏀";
			case "Travel":
				return "🌍";
			case "Arts":
				return "🎨";
			case "Food":
				return "🍔";
			case "Books":
				return "📚";
			case "Video games":
				return "🎮";
			case "Nature":
				return "🌲";
			case "Technology":
				return "📱";
			case "History":
				return "📜";
			case "Fashion":
				return "👗";
			case "Pets":
				return "🐶";
			case "Cars":
				return "🚗";
			case "Film":
				return "🎬";
			case "Business":
				return "💼";
			case "Spirituality":
				return "🧘";
			case "Music":
				return "🎵";
			case "Politics":
				return "🗳️";
		}
	}

	let response = {
		gender : '',
		age : 0,
		sexual_orientation : '',
		interests : [],
	}

	let tags = [];

	function isIn(tag) {
		let isin = false;
		tags.forEach((item) => {
			if (item == tag) {
				isin = true;
			}
		});
		console.log(isin);
		return isin;
	}

	function addTag(tag) {
		if (!isIn(tag)) {
			tags.push(tag);
		}
		tags = tags;
	}

	let colorClicked = "bg-green-500";
	let colorNotClicked = "bg-gray-500";

	function getColor(tag) {
		if (isIn(tag)) {
			return colorClicked;
		} else {
			return colorNotClicked;
		}
	}

	let choosen = [];

	function handleOnClick(tag) {
		if (Questions[i].type === "interests") {
			if (choosen.includes(tag)) {
				choosen = choosen.filter((item) => item !== tag);
			} else {
			choosen.push(tag); 
			choosen = choosen;
			}
		}
		else {
			Preferences[Questions[i].type] = tag;
		}
	}

	function Finish() {
		Preferences.interests = choosen;
		// Make request to the back with Preferences object as data.
	}
</script>

<div class="w-[600px]">
	<div class="h-auto rounded-lg bg-dark mb-1 py-5">
		<div class="flex justify-center">{Questions[i].question}</div>
		<div class="h-0 border w-full" />
		<div>
			{#if Answer[i] == null}
				<input type="number">
			{:else}
				<div class="flex flex-wrap gap-3 justify-center items-center p-5 overflow-scroll scrollbar-hide">
					{#each Answer[i] as answer}
						<button
							id="{answer}"
							class={
							Questions[i].type === "interests" ? 
							choosen.includes(answer) ? "bg-pink w-[120px] p-1 border rounded-lg": "bg-dark w-[120px] p-1 border rounded-lg"
							: Preferences[Questions[i].type] === answer ? "bg-pink w-[120px] p-1 border rounded-lg": "bg-dark w-[120px] p-1 border rounded-lg"
							}
							on:click={() => {
								handleOnClick(answer);
								}}
							>
								{answer}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<div class="h-0 w-full border"></div>
	</div>
	<div class="flex justify-around">
		{#if i > 0}
			<button class="flex justify-between bg-slate-400 px-3 gap-1 rounded-lg items-center" on:click={() => {i--;}}>
				<div>
					←
				</div>
				<div>Prev</div>
			</button>
		{:else}
			<div />
		{/if}
		{#if i < 3}
			<button class="flex justify-between bg-green-500 px-3 gap-1 rounded-lg items-center" on:click={() => {i == 3 ? console.log('max') :i++;}}>
				<div>Next</div>
				<div>
					→
				</div>
			</button>
		{:else}
		<button class="flex justify-between bg-green-500 px-3 gap-1 rounded-lg items-center" on:click={() => {Finish()}}>
			<div>Finish</div>
			<div>
				👍
			</div>
		</button>
		{/if}
	</div>
</div>
