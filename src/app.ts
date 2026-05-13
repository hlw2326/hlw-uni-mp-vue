/**
 * useApp - 应用根上下文
 * 生命周期、Pinia、hlw 注入收敛在此。
 */
import { createSSRApp, type App, type Component } from 'vue';
import { hlw } from '@/hlw';
import { useRequest } from '@/composables/request';

let _installed = false;

/**
 * 创建 uni-app 应用入口工具。
 */
export function useApp() {
    /** 用于在导出前挂载插件。 */
    const _plugins: Array<(app: App) => void> = [];

    /**
     * 注册一个待安装的应用插件。
     */
    function use(pluginOrInstaller: any) {
        _plugins.push((app) => app.use(pluginOrInstaller));
    }

    /**
     * 生成符合 uni-app 约定的 createApp 入口函数。
     */
    function install(AppComponent: Component) {
        if (_installed) {
            console.warn('[hlw] useApp().install() 应只调用一次');
        }
        _installed = true;

        /**
         * 创建并返回 uni-app 运行时应用实例。
         */
        function createApp() {
            const app = createSSRApp(AppComponent);
            app.config.globalProperties['hlw'] = hlw;
            _plugins.forEach((fn) => fn(app));
            return { app };
        }

        return createApp;
    }

    return { install, use, hlw, request: useRequest() };
}
