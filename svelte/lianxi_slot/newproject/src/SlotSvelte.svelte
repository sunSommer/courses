<script>
    let content = '高壮'
    export let number
</script>

<style>

</style>

<div>
    <slot name='top'></slot>
    <slot name='bottom' {content}></slot>
    {number}
    {#if number > 0}
        {number}
        <svelte:self number={number - 1} />
    {/if}
</div>