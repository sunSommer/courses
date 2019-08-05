<script>
    import {onMount,setContext} from "svelte";
    // import {writable} from "svelte/store"
    import {number} from "./store"

    let list = []
    onMount(async function(){
        let res = await fetch('http://169.254.213.224:3000/list')
        let result = await res.json()
        // console.log(result)
        list = result.list
        number.reset(list)
        // number.changeNum(list)
    })
    setContext('list',list)
    function handleClick(obj){
        number.addList(obj)
    }
</script>
<style>
.content{
    padding: 0 10px;
}
.content>dl{
    width: 100%;
    display: flex;
}
.content>dl>dt{
    width: 140px;
    background: orangered;
}
.content>dl>dd{
    flex: 1;
    margin: 0;
    margin-left: 10px;
}
.content>dl>dd>p{
    width: 100%;
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
}
</style>

<div class="content">
    {#each $number.list as item,index}
    {#each item.items as val,ind}
    
        <dl key={val.id}>
            <dt>
                图片
            </dt>
            <dd>
                <p>{val.title}</p>
                <span>{val.price.toFixed(2)}元</span>
                <button on:click={() => handleClick({id:val.id,index:index,ind:ind,type:item.type})}>加入购物车</button>
            </dd>
        </dl>
        {/each}
    {/each}
    
</div>