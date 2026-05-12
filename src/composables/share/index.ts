import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

export interface ShareConfig {
    title?: string;
    path?: string;
    imageUrl?: string;
}

export function useShare(config: ShareConfig): void {
    const payload: { title?: string; path?: string; imageUrl?: string } = {};
    if (config.title) payload.title = config.title;
    if (config.path) payload.path = config.path;
    if (config.imageUrl) payload.imageUrl = config.imageUrl;

    onShareAppMessage(() => payload);
    onShareTimeline(() => ({
        title: payload.title,
        imageUrl: payload.imageUrl,
    }));
}
