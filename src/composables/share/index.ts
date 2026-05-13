import {
    onShareAppMessage as registerShareAppMessage,
    onShareTimeline as registerShareTimeline,
} from "@dcloudio/uni-app";

export interface ShareConfig {
    title?: string;
    path?: string;
    imageUrl?: string;
}

export type ShareConfigResolver = ShareConfig | (() => ShareConfig);

export interface ShareHandlers {
    onShareAppMessage: (config?: ShareConfigResolver) => void;
    onShareTimeline: (config?: ShareConfigResolver) => void;
    showShareMenu: () => void;
}

function resolveConfig(config?: ShareConfigResolver): ShareConfig {
    return typeof config === "function" ? config() : (config ?? {});
}

function buildPayload(base: ShareConfigResolver, extra?: ShareConfigResolver): ShareConfig {
    const current = {
        ...resolveConfig(base),
        ...resolveConfig(extra),
    };
    const payload: ShareConfig = {};
    if (current.title) payload.title = current.title;
    if (current.path) payload.path = current.path;
    if (current.imageUrl) payload.imageUrl = current.imageUrl;
    return payload;
}

function showShareMenu(): void {
    const api = typeof uni !== "undefined" ? (uni as unknown as {
        showShareMenu?: (options: {
            withShareTicket?: boolean;
            menus?: string[];
            fail?: () => void;
        }) => void;
    }) : undefined;

    api?.showShareMenu?.({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
        fail: () => undefined,
    });
}

export function useShare(config: ShareConfigResolver = {}): ShareHandlers {
    let appMessageRegistered = false;
    let timelineRegistered = false;

    const onShareAppMessage = (extra?: ShareConfigResolver) => {
        if (appMessageRegistered) return;
        appMessageRegistered = true;
        showShareMenu();
        registerShareAppMessage(() => buildPayload(config, extra));
    };

    const onShareTimeline = (extra?: ShareConfigResolver) => {
        if (timelineRegistered) return;
        timelineRegistered = true;
        showShareMenu();
        registerShareTimeline(() => {
            const payload = buildPayload(config, extra);
            return {
                title: payload.title,
                query: payload.path?.split("?")[1],
                imageUrl: payload.imageUrl,
            };
        });
    };

    onShareAppMessage();
    onShareTimeline();

    return {
        onShareAppMessage,
        onShareTimeline,
        showShareMenu,
    };
}
