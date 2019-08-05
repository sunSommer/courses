<script>
    export let fileList;

    function handleClick (arr,id){
        arr.forEach(val => {
            if(val.id !== id){
                console.log(val.items)
                handleClick(val.items,id)
            } else {
                console.log(222)
                val.items.forEach(ite => {
                    console.log(ite)
                    ite.isShow = !ite.isShow
                    console.log(ite.isShow)
                })
            }
        })
    }
</script>

<style>

</style>

<div>
{#each fileList as item}
    {#if item.isShow === true}
    <p on:click={() => handleClick(fileList,item.id)}>{item.name}</p>
    {/if}
    {#if item.items}
        <svelte:self fileList={item.items} />
    {/if}
{/each}
</div>