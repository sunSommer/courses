#### v-model在组件中的使用
```
<template>
  <div id="app">
    <Child v-model="inp" />
    <button @click="changeInp">打印</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    Child:{
      props:['value'],
      template:`
        <div>
          子组件
          {{value}}
          <button @click="changeValue">修改</button>
        </div>
      `,
      methods:{
        changeValue(){
          this.$emit('input','修改之后的数据') //事件名必须为input，否则子传父数据双向绑定不生效
        }
      }
    }
  },
  data(){
    return {
      inp:'父组件的数据'
    }
  },
  methods:{
    changeInp(){
      console.log(this.inp) //子组件传来的数据是什么，这时this.inp就是什么
    }
  }
}
</script>
```
#### 子组件向父组件传参数
1. 自定义事件
```
子组件中 ----> $emit('事件名',参数)
父组件中 ----> @事件名='函数名'
```
2. $on + $emit
```
<template>
  <div id="app">
    <Child ref="child" />
    <button @click="changeInp">打印</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      inp: "父组件的数据"
    };
  },
  components: {
    Child: {
      props: ["value"],
      // created() {
      //   this.$on("input", val => {
      //     console.log("this", val);
      //   });
      // },
      },
      template: `
        <div>
          子组件
          {{value}}
          <button @click="changeValue">修改</button>
        </div>
      `,
      methods: {
        changeValue() {
          this.$emit("input", "修改之后的数据");
        }
      }
    }
  },
  // created(){
  //   this.$on('input',(val) => { //this指向父组件
  //     console.log('this',val)
  //   })
  // }
  
  //// 如果写在created生命周期里，会报“$on of undefined”的错。因为template模板在beforeMount和mounted之间执行，此时在created里是打印不出来refs的。但，这里是引用类型，在created可以打印出refs是因为mounted已经执行了，所以在created里监听会报错。
  mounted(){
     this.$refs.child.$on('input',(val) => { //this指向父组件
      console.log('this',val)
     })
   }
};
</script>
```
3. 发布订阅者模式对$bus的封装
4. 修饰符sync
#### 发布订阅者模式封装($bus)
```
想要实现的结果:
bus.$emit(eventName,params)
bus.$on(eventName,() => {})

class Bus{
    counstructor(){
        this.events = {}
    }
    $emit(eventName,params){
        this.events[eventName].forEach(val => {
          //这里this.events[eventName]不能写成 . 的形式，因为eventName是一个变量，变量只能写成中括号的形式。如果写成 . 的形式，则表示eventName这个属性名
          val(params)
        })
    }
    $on(eventName,cbk){
        if(this.events[eventName]){
            this.events.push(cbk)
        } else {
           this.events.eventName = [cbk] 
        }
        
    }
}

let bus = new Bus()
```
#### v-bind修饰符sync
使用v-bind，其实就是父子之间的参数传递，即子传父的一种关系。

修饰符sync的用处：通过$emit触发修改某个属性

在子组件中修改父组件中的inp：
```
<template>
  <div id="app">
    <Child :inp.sync="inp" />
    <button @click="changeInp">打印</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      inp: "父组件的数据"
    };
  },
  components: {
    Child: {
      props: ["value"],
      template: `
        <div>
          子组件
          {{value}}
          <button @click="changeValue">修改</button>
        </div>
      `,
      methods: {
        changeValue() {
          //update在这里是改变的意思，要改变inp,改变的内容是："修改之后的数据"
          this.$emit("update:inp", "修改之后的数据");
        }
      }
    }
  }
};
</script>
```
#### 原生js实现v-model
#### vue.extend
#### 用js语句添加组件
***
宏任务和微任务的区别？
***
React中可以优化的点
在constructor改变this指向代替箭头函数和render内绑定this，避免函数作为props带来不必要的rerender
shouldComponentUpdate，减少不不必要的rerender
PureComponent高性能组件只响应引用数据的深拷贝
使用唯一key优化list diff
合并setState操作，减少虚拟dom对比频率
React路由动态加载react-loadable
***
#### vue和react的区别？
1. 组件的创建不一样。react使用函数和class创建组件，vue使用vue实例的components方法和components属性；
2. react中没有指令，计算属性，watch监听，computed计算属性；
3. vue中的-model可以完成数据的双向绑定，react使用受控组件代替；
4. vue中使用get、set拦截器处理数据的绑定，react使用setState手动触发。
#### webpack和gulp的区别？
1. gulp强调的是前端开发的流程，合并后仍然是自己的代码；
2. webpack侧重于模块打包，打包后的代码不是自己的代码，很多是webpack自身的模块处理模块；