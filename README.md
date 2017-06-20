# Talent-ui-bootstrap 用来启动Talent UI 程序的核心代码

 ## 他包括了原来TalentCore中 启动程序的大部分逻辑，但对流程做了一些简化。

 ## 应用，
 你的项目应该有如下结构
 ```
    -- project
        -- src
            --> entry.js
            -- ${containers} //你的页面，代码拆分的依据
            -- {component} //所有的共享组件
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
    * 在talent-ui-2.0中如果使用了talent-ui-bootstrap作为项目的entry, 只需要export组件就可以了
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
        el: 'bsMain'
    };
    export default config;

```





### 你不需要对路由，redux相关的东西做什么配置，就可以启动程序啦，当然，你还需要[talent-ui-webpackConfig](http://gitlab.beisencorp.com/ux-cnpm/talent-ui-webpack-config) 来帮你生成webpack配置来应用本地的开发环境。
