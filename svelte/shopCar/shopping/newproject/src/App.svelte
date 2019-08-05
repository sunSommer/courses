<script>
  import Home from "./Home.svelte";
  import ShopCar from "./ShopCar.svelte";
  import Login from "./Login.svelte";
  import { Link, Route, Router } from "svelte-routing";
  //   export let name;
</script>

<style>
  html,
  body,
  .app {
    margin: 0;
    padding: 0;
  }
  .app {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    height: 44px;
    background: #e43130;
  }
  .main {
    flex: 1;
    background: #d8d8d8;
    overflow-y: auto;
  }
  .footer {
    height: 56px;
	box-shadow: 1px 1px 1px 1px #ccc;
	display: flex;
	align-items: center;
	justify-content: space-around;
  }
</style>

<div class="app">
  <header class="header">header</header>
  <Router>
    <main class="main">
      <Route component="{Home}" path="/" />
      <Route path="shopcar" component="{ShopCar}" />
	  <Route path="login" component="{Login}" />
    </main>
    <footer class="footer">
      <Link to="/">首页</Link>
      <Link to="shopcar">购物车</Link>
	  <Link to="login">登录</Link>
    </footer>
  </Router>
</div>
