# @talentui/bootstrap-react 用来启动Talent UI 程序的核心代码

 ## 他包括了原来TalentCore中 启动程序的大部分逻辑，但对流程做了一些简化。

 ## 应用，
 你的项目应该有如下结构
 ```
    -- project
        -- src
            --> entry.js
            -- pages //你的页面，和容器组件，同时也是代码拆分的依据
            -- component //所有的展现组件
                --> app.js
                --> header.js
                --> sidebar.js
                --> footer.js
            -- reducers
                //建议和你的页面结构对应
            -- app-config.js

 ```

```js
    //你在entry.js中
    import React, { Component } from "react";
    import Header from "components/common/header";
    import Footer from "components/common/footer";
    import Sidebar from "components/common/sidebar";
    import mainStyle from './styles.scss';

    /**
    * 必需！！
    * 应用组件
    * 如果项目中使用了页面对代码进行拆分，需要把页面的代码通过this.props.children来访问页面组件
    * 在talent-ui-2.0中如果使用了@talentui/bootstrap-react 作为项目的entry, 只需要export组件就可以了
    */
    export default class App extends Component {
        render() {
            return (
                <div>
                    <Header />
                    <div className="content-wrapper">
                        {this.props.children}
                    </div>
                    <Footer />
                </div>
            );
        }
    }

    ....

    // app-config.js 这个是必须要存在的文件， 基本上是用来配置单向数据流的，当然如果需要其他的扩展点，也会通过这个文件来实现，比如el
    import reduxThunk from "redux-thunk";
    import logger from "redux-logger";

    //应用配置文件，这个文件是必须存在的，但是配置可以为空，可以对项目运行时进行一些配置，比如，配置应用的初始state, redux中间件
    /**
    * 导出对象 应用配置，作为业务的扩展点
    *  @middlewares：包含middlewares，
    *  @afterCreateStore：创建完成store之后的回调，比如使用Redux-saga就需要在创建完store之后运行Saga
    *  @initialState: 应用程序的初始状态，一般没什么用，万一有用呢。
    *  @el: 如果是字符串，就是指定dom的ID, 也可以传dom对象, 默认是bsMain
    *  @...：   如果有什么需求可以提给liguoming@beisen.com，
    */
    const config = {
        middlewares: [reduxThunk],
        afterCreateStore: function(store) {},
        initialState: {},
        el: 'bsMain',
        i18n: {
            app: '应用名称',
            platform: '所属平台 默认值：isSysRes',
            host: '接口地址',
            lng: '语言编码',
            ns: ['命名空间'],
            debug: '开启调试，默认值false'
        }
    };
    export default config;

```





### 你不需要对路由，redux相关的东西做什么配置，就可以启动程序啦，当然，你还需要[@talentui/webpack-config](https://github.com/talentui/webpack-config) 来帮你生成webpack配置来应用本地的开发环境。


# 关于Page和Container

> **Page** 对于单页面应用来说，当我们切换地址的时候，页面并没有刷新，除了所有页面都会显示的公共部分之外（布局组件-Layout）， 变化的地方是浏览器地址变化所对应的一个组件，这个组件可以被叫作页面组件，页面组件作为Layout的组件的子组件，来响应浏览器地址的变化。

> **container**, 在[react-redux](http://redux.js.org/docs/basics/UsageWithReact.html)的网站上也做了说明，但是你需要明白，Container和Page有相关的地方，页面都是Container组件，但不是唯一的Container组件，你可以在需要的时候添加新的container组件，container组件 也可以包含其他的container组件。你可以看一下[这个讲解](http://b8836390.wiz03.com/share/s/2UwSeg0IDkMu2_Oa1d3k5No_3Nre4k28t4Pq2txChW3LGl9B)


## 更新说明

### 2019.1.11

> 添加对多语言的支持，增加appConfig当中的配置

### 9月26号

> 添加对tabs的支持，在路径中添加page1/tabs_/sometab会去项目目录中去识别page1目录下的sometab下去找tab-view.js[ts | tsx | jsx]。渲染时会把当前的tab名字作为属性_tabName传给tab-view.js对应的组件下

### 2月21号

> 为了不让大家产生误解详情请看上面的**关于Page和Container**，我们把页面目录由Containers改成了Pages

> 取消使用index.js来代表页面的规则，因为这个规则和应用查找模块的规则有重合的地方，也就是index.js代表一个目录地址指向的模块，当有目录嵌套的时候我们便会产生混淆。这应该是页面还是模块。

> 使用**page-view.js**来表示目录下的页面组件。

> **支持子路由和代码拆分**, 我们可以使用#/home/user这样的路由来访问pages/home/user/page-view.js所代表的页面。每一个页面都是一个code splitting的点，都会被打包成一个单独的chunk。你可以查看我们的[示例项目](http://gitlab.beisencorp.com/starter-templates/talent-ui-2.0-starter)
