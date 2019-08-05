import {writable,get,derived} from "svelte/store"


function changeNumber(){
    // let number = writable(0)
    let {subscribe,set,update} = writable({list:[],newList:[],allPrice:0})
    return {
        subscribe,
        // changeNum:function (type) {
        //     update((number) => {
        //         number.list = type
        //         return number
        //     })
        // },
        addList:function (obj) {
            update((number) => {
                let shop = number.list[obj.index]
                let ite = shop.items.filter(item => item.id === obj.id)
                let childIndex = shop.arr.findIndex(val => val.id === obj.id)
                if (childIndex !== -1) {
                    shop.arr[childIndex].count += 1
                } else {
                    shop.arr.push({count:1,...ite[0]})
                }
                let child = number.newList.find(val => val.type === obj.type)
                if(!child){
                    number.newList.push(shop)
                }
                return number
            })
        },
        addCount:function (obj) {
            update((number) => {
                let ind = number.newList[obj.index].arr.findIndex(item => item.id === obj.id)
                number.newList[obj.index].arr[ind].count += 1
                let buyList = []
                number.newList[obj.index].arr.forEach(item => {
                    if(item.check){
                        buyList.push(item)
                    }
                })
                number.allPrice = buyList.reduce((prev,cur) => prev + cur.price * cur.count,0)
                return number
            })
        },
        delCount:function (obj) {
            update((number) => {
                let ind = number.newList[obj.index].arr.findIndex(item => item.id === obj.id)
                number.newList[obj.index].arr[ind].count -= 1
                if(number.newList[obj.index].arr[ind].count < 1){
                    number.newList[obj.index].arr.splice(ind,1)
                    if(number.newList[obj.index].arr.length === 0){
                        number.newList.splice(obj.index,1)
                    }
                }
                let buyList = []
                number.newList[obj.index].arr.forEach(item => {
                    if(item.check){
                        buyList.push(item)
                    }
                })
                number.allPrice = buyList.reduce((prev,cur) => prev + cur.price * cur.count,0)
                return number
            })
        },
        checkShow:function (obj) {
            update((number) => {
                let buyList = []
                let ind = number.newList[obj.index].arr.findIndex(item => item.id === obj.id)
                number.newList[obj.index].arr[ind].check = !number.newList[obj.index].arr[ind].check
                number.newList[obj.index].check=  number.newList[obj.index].arr.every(item =>{
                    return item.check
                })
                number.newList[obj.index].arr.forEach(item => {
                    if(item.check){
                        buyList.push(item)
                    }
                })
                number.allPrice = buyList.reduce((prev,cur) => prev + cur.price * cur.count,0)
                // console.log(buyList)
                return number
            })
        },
        checkBox:function(index){
            update((number) => {
                number.newList[index].check = !number.newList[index].check
                number.newList[index].arr.forEach(item =>{
                    item.check = number.newList[index].check
                })
                if(number.newList[index].check){
                    number.allPrice = number.newList[index].arr.reduce((prev,cur) => prev + cur.price * cur.count,0)
                }
                return number
            })
        },
        checkAll:function (check){
            update((number) => {
                
                if (check) {
                    number.newList.forEach(item => {
                        item.check = check
                    })
                }
                console.log(number)
            })
        },
        reset:(list) => {
            set({list,newList:[]})
        },
        // addList:function (obj) {
        //     const {list,newList} = get(number)
        //     // console.log(obj,list)
        //         // console.log(obj)
        //         let shop = list[obj.index]
        //         let ite = shop.items.filter(item => item.id === obj.id)
        //         let childIndex = shop.arr.findIndex(val => val.id === obj.id)
        //         console.log(childIndex)
        //         if (childIndex !== -1) {
        //             shop.arr[childIndex].count += 1
        //         } else {
        //             // console.log(ite)
        //             shop.arr.push({count:1,...ite[0]})
        //         }
        //         console.log(shop.arr)
        //         let child = newList.find(val => val.type === obj.type)
        //         if(!child){
        //             newList.push(shop)
        //         }
        //         // console.log(number.newList)
        //         set({list,newList})
        //         let exam = derived(number,$number => number)
        //         console.log(exam)
        // },
    }
}


export const number = changeNumber()