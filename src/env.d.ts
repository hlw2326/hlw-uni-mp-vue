declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<object, object, unknown>
    export default component
}

declare global {
    var VITE_PLUGIN_NAME: string | undefined;
}

export {};


