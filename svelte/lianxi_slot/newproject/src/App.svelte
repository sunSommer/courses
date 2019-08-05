<script>
	import File from './File.svelte'
	// import SlotSvelte from './SlotSvelte.svelte'
	// export let name;
	// let student = []
	// import {onMount} from 'svelte'
	// onMount(async function() {
	// 	let res =await fetch('/student.json')
	// 	let result = await res.json()
	// 	student = result
	// })
	// let number = 10;
	let fileList = [
		{
			name:"文件夹1",
			id:1,
			isShow:true,
			items:[
				{
					name:"文件夹2",
					id:2,
					isShow:false,
					items:[
						{
							name:"文件1",
							id:3,
							isShow:false
						}
					]
				}
			]
		}
	]
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<File fileList={fileList} />

<!-- <h1>Hello {name}!</h1>
{#each student as item}
	<p>{item.name}</p>
{:else}
	<p>没有数据了...</p>
{/each}
<SlotSvelte number={number}>
	<p slot='top'>这是要在顶部的插槽</p>
	<p slot='bottom' let:content={b}>{b}</p>
</SlotSvelte>

{@debug student} -->
