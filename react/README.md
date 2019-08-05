**构造函数**
1. 就近原则
2. 先找原型(prototype)，再找原型链(__proto__)

#### react的setState
##### setState在reactJS(react控制的事件处理过程)中是异步的。但,当它不属于reactJS中的机制时,它可能是同步的。
1. call,apply,bind的区别
```
call,apply会直接调用执行该方法
bind不会直接调用执行该方法
```
2. render函数在什么时候才会执行
```
初始化时会执行
在state状态或者props属性更改时触发render函数
```
3. 修改react中的this指向三种方法
```
1). 箭头函数
2). render里的bind
3). constructor里的bind
其中,三者在优化方面有很大的区别。render里的bind性能优化最低;constructor里的bind性能优化最高。
```
4. ref的三种方法
```
```

5. reactJS中的setState
###### reactJS在处理setState时,会将setState中的内容放在一个队列式中,当多个setState的内容相同时,这个队列式会将相同的多个setState放在同一位置,即后者覆盖前者。
```
<body>
    <div id="root"></div>

    <script src="js/react.js"></script>
    <script src="js/react-dom.js"></script>
    <script src="js/babel.js"></script>
    <script type="text/babel">
        class Content extends React.Component{
            state = {
                count:1
            }
            handleClick = () => {
                this.setState({
                    count:this.state.count + 1
                })
                console.log(this.state.count,'one') // 1,'one'
                this.setState({
                    count:this.state.count + 1
                })
                console.log(this.state.count,'two') // 1,'two'
                this.setState({
                    count:this.state.count + 1
                })
                console.log(this.state.count,'three') // 1,'three'
            }
            render(){
                let {count} = this.state
                return <div>
                    {count}
                    <button onClick={this.handleClick}>修改count</button>
                </div>
            }
        }
        ReactDOM.render(<Content />,document.getElementById('root'))
    </script>
</body>

// handleClick方法中虽然写了三个相同内容的setState,但在执行时,reactJS机制会将这三个setState放在队列(一个数组)的同一位置,而且在reactJS中setState是异步的.所以console的结果会在setState之前打印,即打印结果是1.
```

###### react的setState不在reactJS处理机制中时,setState是同步的。
```
<body>
    <div id="root"></div>

    <script src="js/react.js"></script>
    <script src="js/react-dom.js"></script>
    <script src="js/babel.js"></script>
    <script type="text/babel">
        class Content extends React.Component{
            state = {
                count:1
            }
            handleClick = () => {
                this.setState({
                    count:this.state.count + 1
                })
                console.log(this.state.count,'one') // 1,'one'
                setTimeout(() => {
                    this.setState({
                        count:this.state.count + 1
                    })
                    console.log(this.state.count,'three') // 3,'three'
                    this.setState({
                        count:this.state.count + 1
                    })
                    console.log(this.state.count,'four') // 4,'four'
                }, 0);
                this.setState({
                    count:this.state.count + 1
                })
                console.log(this.state.count,'two') // 1,'two'
            }
            render(){
                let {count} = this.state
                return <div>
                    {count}
                    <button onClick={this.handleClick}>修改count</button>
                </div>
            }
        }
        ReactDOM.render(<Content />,document.getElementById('root'))
    </script>
</body>

// setTimeout是异步函数,该方法不属于reactJS机制,所以写在里面的setState是同步。
```

```
<body>
    <div id="root"></div>

    <script src="js/react.js"></script>
    <script src="js/react-dom.js"></script>
    <script src="js/babel.js"></script>
    <script type="text/babel">
        class Content extends React.Component{
            state = {
                count:1
            }
            componentDidMount(){ this.refs.div.addEventListener('click',this.handleClick.bind(this))
            }
            handleClick = () => {
                this.setState({
                    count:this.state.count + 1
                })
                console.log(this.state.count,'one') // 2,'one'
                setTimeout(() => {
                    this.setState({
                        count:this.state.count + 1
                    })
                    console.log(this.state.count,'three') // 4,'three'
                    this.setState({
                        count:this.state.count + 1
                    }) console.log(this.state.count,'four') // 5,'four'
                }, 0);
                this.setState({
                    count:this.state.count + 1
                })
                console.log(this.state.count,'two') // 3,'two'
            }
            render(){
                let {count} = this.state
                return <div>
                    {count}
                    <button ref="div">修改count</button>
                </div>
            }
        }
        ReactDOM.render(<Content />,document.getElementById('root'))
    </script>
</body>

// addEventListener属于dom二级事件,不属于reactJS机制内,所以setState都是同步的。
```
#### 生命周期
> constructor不属于react的生命周期,是类组件的一个函数。
componentWillMount=>render=>componentDidMount=>componentWillReceiveProps(接收一个参数props)=>shouldComponentUpdate=>componentWillUnmout

> 两个新的生命周期替代三个will生命周期 => componentWillMount,componentWillReceiveProps,componentWillUpdate

> render之前的生命周期接收新的数据(nextProps,nextState)，之后的生命周期接收旧的数据(prevProps,prevState)

1. getDerivedStateFromProps  
> 静态函数。替代了原生命周期中的componentWillReceiveProps函数
```
//Home/index.jsx
import React, { Component } from 'react';
import Child from '../Child';

class Home extends Component{
  constructor(){
    super();
    this.state = {
      count:0
    };
  }
  render(){
    const {count} = this.state;
    return (
      <div>
        <Child count={this.state.count} />
        <button onClick={() => {this.setState({count : 2});}}>修改</button>
      </div>
    );
  }
}

export default Home;

//Child/index.jsx
import React, { Component } from 'react';
import Grandson from '../Grandson';

class Child extends Component{
  constructor(props){ //constructor只在组件实例时执行一次
    super(props);
    this.state = {
      count:props.count
    };
  }

  static getDerivedStateFromProps(nextProps,prevState){
    if(nextProps.count !== prevState.count) {
      return {
        count:nextProps.count
      }; //这里必须return一个对象。react底层机制会自动执行setState方法
    }
    return null;
  }
  render(){
    return (
      <div>
        {this.state.count}
      </div>
    );
  }
}

export default Child;
```
2. getSnapshotBeforeUpdate
> 可以获取到render之前的dom状态，通过componentDidUpdate反映
```
//Child/index.jsx
import React, { Component } from 'react';

class Child extends Component{
  constructor(props){
    super(props);
    this.state = {
      count:props.count
    };
  }

  static getDerivedStateFromProps(nextProps,prevState){
    if(nextProps.count !== prevState.count) {
      return {
        count:nextProps.count
      }; //这里必须return一个对象。react底层机制会自动执行setState方法
    }
    return null;
  }

  //当前生命周期中已经可以获取到真实的dom
  getSnapshotBeforeUpdate(){ //该生命周期必须和componentDidUpdate一起使用。其返回值可以作为componentDidUpdate的第三个参数
    console.log('getSnapshotBeforeUpdate');
    return null;
  }

  componentDidUpdate(){
    console.log('componentDidUpdate');
  }
  render(){
    console.log('render')
    return (
      <div>
        {this.state.count}
      </div>
    );
  }
}

export default Child;

//console的顺序是：render getSnapshotBeforeUpdate componentDidUpdate
```
#### context
> 上下文。Context提供了一种通过组件树传递数据的方法，而无需在每个级别手动传递props。可以实现跨级通信
```
//utils/context.js
import React from 'react';
export default React.createContext();

//Home/index.jsx
import React, { Component } from 'react';
import Child from '../Child';
import context from '../../utils/context';

class Home extends Component{
  constructor(){
    super();
    this.state = {
      count:0
    };
  }
  render(){
    const {count} = this.state;
    return (
      <div>
        <context.Provider value={{count}}>
          <Child />
        </context.Provider>
        <button onClick={() => {this.setState({count : 2});}}>修改</button>
      </div>
    );
  }
}

export default Home;

//Child/index.jsx
import React, { Component } from 'react';
import Grandson from '../Grandson';
import context from '../../utils/context';

class Child extends Component{
  constructor(props){
    super(props);
    this.state = {
      count:props.count
    };
  }
  
  render(){
    console.log('render');
    return (
      <div>
        <context.Consumer>
          {
            (value) => {
              console.log(value);
            }
          }
        </context.Consumer>
        <Grandson />
      </div>
    );
  }
}

export default Child;

//Grandson/index.jsx
import React, { Component } from 'react';
import context from '../../utils/context';

class Grandson extends Component{
  constructor(){
    super();
    this.state = { };
  }

  render(){
    return (
      <div>
        <context.Consumer>
          {
            (value) => {
              console.log(value);
            }
          }
        </context.Consumer>
      </div>
    );
  }
}

export default Grandson;
```
#### connect
> connect是一个高阶函数，返回一个包着渲染组件的高阶组件。
```
//component/provider.js
import React, { Component } from 'react';
import context from '../../utils/context';

class Provider extends Component{
  render(){
    let {store} = this.props;
    return (
      <context.Provider value={{store}}>
        {this.props.children}
      </context.Provider>
    );
  }
}

export default Provider;

//utils/connect.js
import React, { Component } from 'react';
import Context from './context';

const connect = () => {
  return (WrapComponent) => {
    return class extends Component{
      render(){
        return <div>
          <Context.Consumer>
            {
              (value) => {
                return <WrapComponent {...value} />;
              }
            }
          </Context.Consumer>
        </div>;
      }
    };
  };
};

export default connect;
```
#### redux
```
//store/store.js
import {createStore} from 'redux';

function homeStore(state = {count:1},action){
  switch (action.type) {
  case 'ADD':
    return {
      ...state,
      count:state.count + 1
    };
  
  default:
    return state;
  }
}

const store = createStore(homeStore);
export default store;

//Home/index.jsx
import React, { Component } from 'react';
import store from '../../store/store';

class Home extends Component{
  constructor(props){
    super(props);
    store.subscribe(() => {
      this.setState({ });
    });
  }
  add = () => {
    store.dispatch({
      type:'ADD'
    }); 
  }
  render(){
    let {count} = store.getState();
    return <div>
        Home
      <p>{count}</p>
      <button onClick={this.add}>修改</button>
    </div>;
  }
}

export default Home;
```

state：reducer被触发时，state状态永远是上一个reducer的返回值,是最新值

action：修改动作行为的描述体。描述目的：当前的动作让仓库做什么

> 注意：同一项目中的type必须具有唯一性。type命名

combineReducers({reducer1,reducer2})   合并多个reducer

#### react-redux 和 redux-thunk
1. react-redux

redux是数据管理的库

react-redux是将视图框架和数据管理的一个库链接起来。

react-redux中provider的作用注入全局的store即视图组件的store，connect用来链接视图组件

connect()() 第一个括号中没有传参数时，打印this.props，会默认将dispatch传递过来
2. redux-thunk

重写dispatch，解决异步的中间件。外层的dispatch不是真的连接store的dispath，里面的store.dispatch({})才是真正用来传递的
#### bindActionCreators(actionCreators, dispatch) 
把 action creators 转成拥有同名 keys 的对象，但使用 dispatch 把每个 action creator 包围起来，这样可以直接调用它们。
```
import {bindActionCreators} from "redux"
```
3. redux-saga

**redux-saga 使用了 ES6 的 Generator 功能，让异步的流程更易于读取，写入和测试。是一个用于管理 Redux 应用异步操作的中间件（又称异步 action）。**
**在 redux-saga 的世界里，所有的任务都通用 yield Effects 来完成（Effect 可以看作是 redux-saga 的任务单元）。**
##### redux-saga框架核心API
1. takeEvery
```
首先创建一个将执行异步 action 的任务：
import { call, put } from 'redux-saga/effects'

export function* fetchData(action) {
   try {
      const data = yield call(Api.fetchUser, action.payload.url);
      yield put({type: "FETCH_SUCCEEDED", data});
   } catch (error) {
      yield put({type: "FETCH_FAILED", error});
   }
}
然后在每次 FETCH_REQUESTED action 被发起时启动上面的任务
import { takeEvery } from 'redux-saga'

function* watchFetchData() {

  yield* takeEvery("FETCH_REQUESTED", fetchData)
}

上面的 takeEvery 函数可以使用下面的写法替换
function* watchFetchData() {
  
   while(true){
     yield take('FETCH_REQUESTED');
     yield fork(fetchData);
   }
}
```
##### Effect Creators
###### redux-saga框架提供了很多创建effect的函数。
1. take(pattern)  监听未来的action，是一个阻塞的effect
```
function* watchFetchData() {
   while(true) {
     // 监听一个type为 'FETCH_REQUESTED' 的action的执行，直到等到这个Action被触发，才会接着执行下面的 yield fork(fetchData)  语句
     yield take('FETCH_REQUESTED');
     yield fork(fetchData);
   }
}
```
2. put(action)  用来发送action的effect，相当于redux中的dispatch函数，当put一个action后，reducer中就会计算新的state并返回。也是阻塞effect
```
export function* toggleItemFlow() {
    let list = []
    // 发送一个type为 'UPDATE_DATA' 的Action，用来更新数据，参数为 `data：list`
    yield put({
      type: actionTypes.UPDATE_DATA,
      data: list
    })
}
```
3. call(fn,...args)  可以调用其他函数的函数。fn函数可以是一个Generator 函数，也可以是一个返回 Promise 的普通函数。也是阻塞effect
```
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export function* removeItem() {
  try {
    // 这里call 函数就调用了 delay 函数，delay 函数为一个返回promise 的函数
    return yield call(delay, 500)
  } catch (err) {
    yield put({type: actionTypes.ERROR})
  }
}
```
4. select(selector,...args)  用来指示 middleware调用提供的选择器获取Store上的state数据。类似于redux中获取store上的state
```
export function* toggleItemFlow() {
     // 通过 select effect 来获取 全局 state上的 `getTodoList` 中的 list
     let tempList = yield select(state => state.getTodoList.list)
}
```
##### react中redux-saga
```
//store.js

import {createStore,combineReducers,applyMiddleware} from "redux";
import createSaga from "redux-saga";
import {listenActions} from "./sagas
let sagaMiddleware = createSaga()

function StoreReducer(state = {count:1,name:"tom"},action){
  switch(action.type){
    case "ADD":
      return {
        ...state,
        count:state.count + 1
      }
    default:
      return state
  }
}

let store = createStore(combineReducers(),applyMiddleware(sagaMiddleware))
sagaMiddleware.run(listenActions)
export default store;

//sagas.js

import {takeEvery,put,take,call,select} from "redux-saga/effects";
import axios from "axios";
//takeEvery 提前加载
//take 可以接收参数。懒加载，什么时候用到什么时候加载
//call 类似await等待。多用于异步请求
//select 接收一个回调函数，类似store.getState

function* changeNum({number}){
  //yield put({
  //  type:"ADD"
  //})

  //call(调用哪个方法,地址)
  
  //let res = yield call(axios.get,'/data')
  //yield put({
  //  type:"ADD",
  //  number:res.data.number
  //})
  
  let  res = yield select((state) => {
    return state.StoreReducer.name
  })

}

export function* listenActions(){
  //yield takeEvery('ADDNUM',changeNum)
  let res = yield take('ADDNUM)
  yield changeNum(res)
}

//App.js

class App extends Component{
  render(){
    return (
      <div>
        <button onClick={() => {
          this.props.dispatch({
            type:"ADDNUM"
          })
        }}>+</button>
      </div>
    )
  }
}

export default connect(
  store => ({...store.App})
)(App)
```