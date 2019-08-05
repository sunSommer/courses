<script>
    import {beforeUpdate,afterUpdate} from "svelte";
    import {number} from "./store"
    
    function handleDel(obj){
        // console.log(id)
        number.delCount(obj)
    }

    function handleAdd(obj){
        number.addCount(obj)
    }
    function handleCheck(obj){
        number.checkShow(obj)
    }
    function handleBox(index){
        number.checkBox(index)
    }
    function handleAll(e){
        // console.log()
        number.checkAll(e.target.checked)
    }
    beforeUpdate(() => {
        console.log("beforeUpdate")
    })
    afterUpdate(() => {
        console.log("afterUpdate")
    })

</script>
<style>
.content{
    padding: 0 10px;
}
.content dl{
    padding: 0;
    margin: 0;
    width: 100%;
    display: flex;
}
.content dl>dt{
    width: 140px;
    background: orangered;
}
.content dl>dd{
    flex: 1;
    margin: 0;
    margin-left: 10px;
}
.content dl>dd>p{
    width: 100%;
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
}
.content dl>dd>div{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.first{
    margin-top: 10px;
    display: flex;
}
</style>
<div class="content">
{#if $number.newList}
{#each $number.newList as item,index}
<div>
<input type="checkbox" checked={item.check} on:change={() => handleBox(index)}>
<span>{item.name}</span>
{#if item.arr}
{#each item.arr as val}
<div class="first">
<input type="checkbox" checked={val.check} on:change={() => handleCheck({id:val.id,index:index,type:item.type,check:val.check})}>
<dl>
    <dt></dt>
    <dd>
        <p>{val.title}</p>
        <div>
            <span>{val.price.toFixed(2)}元</span>
            <p>
                <span on:click={() => handleDel({id:val.id,index:index,type:item.type})}>-</span>
                <span>{val.count}</span>
                <span on:click={() => handleAdd({id:val.id,index:index,type:item.type})}>+</span>
            </p>
        </div>
    </dd>
</dl>
</div>
{/each}
{/if}
</div>
{/each}
{/if}
<div>
    <input type="checkbox" on:change={(e) => handleAll(e)}>
    <span>全选</span>
    <span>总价：{$number.allPrice}元</span>
</div>
</div>