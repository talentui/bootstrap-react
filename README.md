# @talentui/bootstrap-react 用来启动 Talent UI 应用的核心代码

## 应用，

你的项目应该有如下结构

```
   -- project
       -- src
           --> layout.js
           -- pages //你的页面，和容器组件，同时也是代码拆分的依据
               --home
                   --page-view.js
           -- component //所有的展现组件
               --> app.js
               --> header.js
               --> sidebar.js
               --> footer.js
           -- reducers //建议和你的页面结构对应

```

## 应用的 entry 文件

```js
import app from '@talentui/bootstrap-react';
import reducer from './reducers';

app.config({
  el: '#bsMain', // 应用挂载点，可以是querySelector的选择器，或者是dom节点 //必须传
  reducer, // 应用的reducer, 必须传
  initialState: {}, //redux store的初始状态，可选
  afterCreateStore: function(store) {
    //store创建后的回调 可以在这里把saga注册到redux中了，可选
  },
  middlewares: [] //redux中间件，放到数组里，可选
});
app.start(); //启动应用
// reducer的热替换，生产环境会自动删除
if (module.hot) {
  module.hot.accept('./reducers', () => {
    let reducer = require('./reducers').default;
    app.replaceReducer(reducer);
  });
}
```

## layout.js

```js
import React from 'react';
import Header from './components/common/header';
import Footer from './components/common/footer';
export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Header name="hehe" title={3} />
        <div className="content-wrapper">{this.props.children /* 通过children来接收page组件 */}</div>
        <Footer />
      </div>
    );
  }
}
```

> 使用**page-view.js**来表示目录下的页面组件。

> **支持子路由和代码拆分**, 我们可以使用#/home/user 这样的路由来访问 pages/home/user/page-view.js 所代表的页面。每一个页面都是一个 code splitting 的点，都会被打包成一个单独的 chunk。你可以查看我们的[示例  项目](http://gitlab.beisencorp.com/starter-templates/talent-ui-2.0-starter)
