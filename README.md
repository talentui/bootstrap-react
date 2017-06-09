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

 ```

```js
    //你在entry.js中
    import {kickoff} from "@beisen/talent-ui-bootstrap";
    import reducers from "reducers";
    import App from 'components/common/app';

    // 使用pageLoader来实现代码拆分和异步加载
    const pageLoader = (path) => import(/* webpackMode: "lazy", webpackChunkName: "[request]" */ `containers/${path}/index`);

    //启动应用的代理，并且使用这个来实现组件的热更新
    const kickoffDelegation = kickoff({
        reducer: reducers, //required
        loader: pageLoader //required
        // ,reduxMiddleware: [] //optional
        // ,initialState: {} //optional
    });

    //现在启动我们的程序吧
    kickoffDelegation(App);

    //启动热更新
    if(module.hot){
        module.hot.accept('components/common/app', () => {
            kickoffDelegation(App)
        });
    }
```

### 你不需要对路由，redux相关的东西做什么配置，就可以启动程序啦，当然，你还需要[talent-ui-webpackConfig](http://gitlab.beisencorp.com/ux-cnpm/talent-ui-webpack-config) 来帮你生成webpack配置来应用本地的开发环境。
