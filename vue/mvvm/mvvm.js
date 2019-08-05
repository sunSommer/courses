
//公共方法的封装
const utils = {
    //公共方法。用来替换页面上的元素标签内容和{{}}的内容
    setValue(data,key,node,nodeType){
        //调用getValue方法
        node[nodeType] = this.getValue(data,key)
    },
    //公共方法。获取最新的数据值
    getValue(data,key){
        //判断nodeValue也就是key是否含有 . ,如果有的话，则表示nodeValue是对象层层嵌套的
        if(key.indexOf('.') > -1){
            //用split方法将nodeValue转换成数组
            let keys = key.split('.')
            //对数组进行遍历
            keys.forEach(item => {
                //获取到的nodeVlue的每一项赋值给data
                data = data[item]
            })
            //将获取到的data返回出去
            return data
        } else {
            //如果没有含有 . 的话，直接对页面上的内容数据进行替换
            return data[key]
        }
    },
    //公共方法。input框的值发生改变时，数据也随着改变
    changeValue(data,key,value){
        //判断nodeValue也就是key是否含有 . ,如果有的话，则表示nodeValue是对象层层嵌套的
        if(key.indexOf('.') > -1){
            //用split方法将nodeValue转换成数组
            let keys = key.split('.');
            //对数组进行for循环遍历，这里要注意 i 要小于keys.length-1，因为要修改的是最后一层的数据
            for(let i=0;i<keys.length - 1;i++){
                //获取到data数据中keys的每一项的值，并赋给data
                data = data[keys[i]]
            }
            //将input框的最新值赋值给data数据的最后一层
            data[keys[keys.length - 1]] = value
        } else {
            //如果没有含有 . 的话，将input框的最新值直接赋给data数据
            data[key] = value
        }
    }
}

class Dep{
    constructor(){
        this.events = []
    }
    addWatcher(obj){
        this.events.push(obj)
    }
    changeWatcher(){
        this.events.forEach(item => {
            item.touchFunc()
        })
    }
}

Dep.target = null;
let dep = new Dep()

class Observer{
    constructor(data){
        //如果data不存在或者data的类型不是object，则不往下走，直接return
        if(!data || typeof data !== 'object'){
            return;
        }
        this.data = data;
        this.init()
    }
    //把data的属性挂载到this上
    init(){
        //获取到data数据的key值，并对其遍历
        Object.keys(this.data).forEach(val => {
            //调用observer方法
            this.observer(this.data,val,this.data[val])
        })
    }
    //对于data数据的设置和获取进行劫持，监听属性值的改变
    observer(data,key,value){
        //递归该方法，达到每一级都能被劫持的目的
        new Observer(data[key])
        Object.defineProperty(data,key,{
            //获取属性值
            get(){
                if(Dep.target){
                    dep.addWatcher(Dep.target)
                }
                return value
            },
            //设置/修改属性值
            set(newValue){
                //如果当前的值和修改后的值相等，则直接return
                if(value === newValue){
                    return;
                }
                value = newValue
                //递归该方法。将获取到的新值也进行劫持，达到监听每一级的目的
                new Observer(value)
                dep.changeWatcher()
            }
        })
    }
}

//监听页面内容的改变
class Watcher{
    constructor(data,key,cbk){
        this.data = data;
        this.key = key;
        this.cbk = cbk;
        Dep.target = this;
        this.init();
    }
    init(){
        //调用公共方法。将获取到的值赋值给this.value
        this.value = utils.getValue(this.data,this.key)
        Dep.target = null
        return this.value
    }
    //页面内容改变时触发回调函数
    touchFunc(){
        //页面内容改变时，调用init，获取到最新的值
        let newValue = this.init()
        this.cbk(newValue)
    }
}

//创建一个构造函数
class Mvvm{
    //根据结果确定是否接收参数。参数是一个对象
    constructor({el,data}){
        this.el = document.getElementById(el);
        this.data = data;
        this.init();
        //视图上的内容以碎片dom的方式添加
        this.initDOM()
    }
    //把data的属性挂载到this上
    init(){
        // console.log(this.data)
        //获取到data数据的key值，并对其遍历
        Object.keys(this.data).forEach(val => {
            //调用observer方法
            this.observer(this.data,val,this.data[val])
        })
        //给当前数据集合的每一个属性添加劫持
        new Observer(this.data)
    }
    //对于data数据的设置和获取进行劫持，监听属性值的改变
    observer(data,key,value){
        Object.defineProperty(data,key,{
            //获取属性值
            get(){
                return value
            },
            //设置/修改属性值
            set(newValue){
                value = newValue
            }
        })
    }
    //视图上的内容以碎片dom的方式添加
    initDOM(){
        //将创建碎片dom的方法赋值给newFragment
        let newFragment = this.createFragment()
        //模板解析器compiler
        this.compiler(newFragment)
        //将碎片dom添加到页面上
        this.el.appendChild(newFragment)
    }
    //创建一个碎片dom
    createFragment(){
        //创建的碎片dom赋值给newFragment
        let newFragment = document.createDocumentFragment()
        //往创建成功的碎片dom里添加内容。定义一个变量
        let firstChild;
        //while循环判断第一个子节点和el的第一个子节点是否相等，如果相等，添加到碎片dom中
        while(firstChild = this.el.firstChild){
            newFragment.appendChild(firstChild)
        }
        //该方法返回创建的碎片dom
        return newFragment
    }
    //解析，接收的参数表示页面的所有node
    compiler(node){
        //判断node.nodeType=1是否成立。如果成立，则是元素标签，即input和p标签
        if(node.nodeType === 1){
            //获取到每一个node的attributes属性，并转化成伪数组
            let attributes = [...node.attributes]
            //对获取到的attributes属性值进行遍历
            attributes.forEach(item => {
                //再判断attributes属性值中是否含有nodeName等于v-model的项
                if(item.nodeName === 'v-model'){
                    //上述条件都成立的话，调用公共方法setValue,以替换元素标签的内容
                    utils.setValue(this.data,item.nodeValue,node,'value')
                    //给当前元素添加dom2级input事件，回调函数获取当前元素内容改变后的最新值
                    node.addEventListener('input',(e) => {
                        // console.log(e.target.value)
                        utils.changeValue(this.data,item.nodeValue,e.target.value)
                    })
                }
            })
            //判断nodeType=3是否成立。成立的话，则修改的是页面的数据内容
        } else if(node.nodeType === 3){
            //判断当前node的nodeValue是否含有'{{'
            if(node.nodeValue.indexOf('{{') > -1){
                //如果上述两个条件都成立的话，获取到当前node的nodeValue的内容(把{{}}去掉)
                let newValue = node.nodeValue.split('{{')[1].split('}}')[0]
                // 调用公共方法setValue，以替换非元素标签的内容
                utils.setValue(this.data,newValue,node,'textContent')
                //newValue存在且对数据改变进行触发
                newValue && new Watcher(this.data,newValue,(newValue) => {
                    node.textContent = newValue
                })
            }
        }

        //判断node.childNodes是否存在。如果存在，则遍历每一项
        if(node.childNodes && node.childNodes.length > 0){
            node.childNodes.forEach(val => {
                //递归，调用自身的方法
                this.compiler(val)
            })
        }
    }
}