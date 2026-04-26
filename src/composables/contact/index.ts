/**
 * useContact —— 客服按钮配置（business-level cache）
 *
 * 后端返回 <button open-type="contact"> 的 4 个微信原生属性，模块级缓存共享给所有客服按钮。
 *
 * 使用方式（业务侧）：
 *
 *   1. App.vue / bootstrap 注入回调：
 *
 *      setConfigContact({
 *          getConfig: async () => {
 *              const res = await getContactConfig();
 *              return res.code === 1 ? res.data : null;
 *          },
 *      });
 *
 *   2. 任意按钮组件：
 *
 *      const contact = useContact();
 *      <hlw-button open-type="contact" v-bind="contact">联系客服</hlw-button>
 */
import { computed, ref } from "vue";
import { unwrapPayload, type AdapterPayload } from "../_internal/unwrap";

/** 后端返回的客服配置（按 button open-type=contact 标准属性命名） */
export interface ContactConfig {
    send_message_title: string;
    send_message_path: string;
    send_message_img: string;
    show_message_card: boolean;
}

/**
 * Adapter 注入接口 —— getConfig 支持「已解包」或「ThinkAdmin envelope」两种返回。
 * 业务方可以直接传 envelope-returning 接口：setConfigContact({ getConfig: getContactConfig })
 */
export interface ContactAdapter {
    getConfig: () => Promise<AdapterPayload<ContactConfig>>;
}

/** v-bind 到 button 的 camelCase props（微信原生属性约定） */
export interface ContactBindProps {
    sendMessageTitle: string;
    sendMessagePath: string;
    sendMessageImg: string;
    showMessageCard: boolean;
}

let adapter: ContactAdapter | null = null;
const config = ref<ContactConfig | null>(null);
let pending: Promise<void> | null = null;

/**
 * 注入业务回调（应用启动时调用一次；不调用则 useContact 始终返回空字段）。
 */
export function setConfigContact(a: ContactAdapter): void {
    adapter = a;
}

function loadConfig(): Promise<void> {
    if (config.value) return Promise.resolve();
    if (pending) return pending;
    if (!adapter?.getConfig) {
        console.warn("[useContact] adapter.getConfig 未注入；先调用 setConfigContact()");
        return Promise.resolve();
    }
    pending = adapter.getConfig()
        .then((raw) => {
            const cfg = unwrapPayload(raw);
            if (cfg) config.value = cfg;
        })
        .catch((e) => {
            console.warn("[useContact] load config failed", e);
        })
        .finally(() => {
            pending = null;
        });
    return pending;
}

/**
 * 返回 v-bind 友好的客服配置 computed（首次调用会异步拉一次配置）。
 */
export function useContact() {
    void loadConfig();
    return computed<ContactBindProps>(() => ({
        sendMessageTitle: config.value?.send_message_title || "",
        sendMessagePath:  config.value?.send_message_path  || "",
        sendMessageImg:   config.value?.send_message_img   || "",
        showMessageCard:  config.value?.show_message_card  ?? false,
    }));
}
