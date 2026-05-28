/**
 * 小程序广告工具。
 * 提供插屏广告 (Interstitial Ad) 与激励视频广告 (Rewarded Video Ad) 的注册、缓存与展示能力。
 */

declare const uni: any;
declare const wx: any;

/**
 * 广告播放/加载结果数据结构。
 */
export interface AdRes {
    /** 广告是否正常加载或成功展示完成 */
    ok: boolean;
    /** 激励视频是否完全播放完毕 (仅激励视频有此属性) */
    isEnded: boolean;
    /** 加载或展示失败时的错误对象 */
    err?: any;
}

type AdDone = (res: AdRes) => void;

// 缓存不同 Unit ID 的广告实例
const popupCache = new Map<string, any>();
const rewardCache = new Map<string, any>();

let activePopupAdId = "";
let popupDone: ((ok: boolean) => void) | undefined;

let activeRewardAdId = "";
let rewardDone: AdDone | undefined;
let rewardPromise: Promise<AdRes> | null = null;
let rewardResolve: ((res: AdRes) => void) | null = null;

/**
 * 获取当前环境的小程序全局 API 实例。
 */
function getAdApi() {
    if (typeof uni !== "undefined") return uni;
    if (typeof wx !== "undefined") return wx;
    return null;
}

/**
 * 触发激励视频广告结束的回调并 resolve Promise。
 */
function finish(res: AdRes) {
    rewardDone?.(res);
    rewardResolve?.(res);
    rewardResolve = null;
    rewardPromise = null;
}

/**
 * 小程序广告 Composables。
 * 
 * @example
 * ```ts
 * const { setAdPopup, showAdPopup, setAdReward, showAdReward } = useHlwAd();
 * 
 * // 1. 插屏广告
 * setAdPopup('ad-unit-id');
 * await showAdPopup();
 * 
 * // 2. 激励视频
 * await setAdReward('ad-unit-id');
 * const res = await showAdReward();
 * if (res.ok && res.isEnded) {
 *    // 发放奖励
 * }
 * ```
 */
export function useHlwAd() {
    /**
     * 配置/预加载插屏广告。
     * 
     * @param adId 广告单元 ID
     * @param done 广告关闭后的回调（可选）
     * @returns 是否配置成功
     */
    function setAdPopup(adId: string, done?: (ok: boolean) => void): boolean {
        popupDone = done;
        if (!adId) return false;

        const api = getAdApi();
        if (!api?.createInterstitialAd) return false;

        activePopupAdId = adId;
        if (!popupCache.has(adId)) {
            try {
                const ad = api.createInterstitialAd({ adUnitId: adId });
                ad.onLoad?.(() => console.log(`[HlwAd] Interstitial loaded: ${adId}`));
                ad.onError?.((err: unknown) => {
                    console.error("[HlwAd] Interstitial load error:", err);
                    if (activePopupAdId === adId) {
                        popupDone?.(false);
                    }
                });
                ad.onClose?.(() => {
                    if (activePopupAdId === adId) {
                        popupDone?.(true);
                    }
                });
                popupCache.set(adId, ad);
            } catch (e) {
                console.error("[HlwAd] Interstitial creation failed:", e);
                return false;
            }
        }
        return true;
    }

    /**
     * 延迟展示已配置的插屏广告。
     * 
     * @param delay 延迟毫秒数，默认 3000ms
     * @returns 返回 Promise，resolve 是否成功显示且用户关闭了它
     */
    function showAdPopup(delay = 3000): Promise<boolean> {
        return new Promise((resolve) => {
            const ad = popupCache.get(activePopupAdId);
            if (!ad) {
                resolve(false);
                return;
            }

            const done = popupDone;
            popupDone = (ok: boolean) => {
                done?.(ok);
                resolve(ok);
            };

            setTimeout(() => {
                ad.show().catch((err: unknown) => {
                    console.error("[HlwAd] Interstitial show error:", err);
                    popupDone?.(false);
                });
            }, Math.max(0, delay));
        });
    }

    /**
     * 配置/预加载激励视频广告。
     * 
     * @param adId 广告单元 ID
     * @param done 播放结束的回调（可选）
     * @returns 返回 Promise<AdRes>，在加载或创建失败时直接 resolve
     */
    function setAdReward(adId: string, done?: AdDone): Promise<AdRes> {
        rewardDone = done;
        rewardPromise = new Promise((resolve) => {
            rewardResolve = resolve;
        });

        if (!adId) {
            finish({ ok: false, isEnded: false });
            return rewardPromise;
        }

        const api = getAdApi();
        if (!api?.createRewardedVideoAd) {
            finish({ ok: false, isEnded: false });
            return rewardPromise;
        }

        activeRewardAdId = adId;
        if (!rewardCache.has(adId)) {
            try {
                const ad = api.createRewardedVideoAd({ adUnitId: adId });
                ad.onLoad?.(() => console.log(`[HlwAd] Rewarded video loaded: ${adId}`));
                ad.onError?.((err: unknown) => {
                    console.error("[HlwAd] Rewarded video load error:", err);
                    if (activeRewardAdId === adId) {
                        finish({ ok: false, isEnded: false, err });
                    }
                });
                ad.onClose?.((res: { isEnded?: boolean }) => {
                    if (activeRewardAdId === adId) {
                        const isEnded = !!res?.isEnded;
                        finish({ ok: isEnded, isEnded });
                    }
                });
                rewardCache.set(adId, ad);
            } catch (e) {
                console.error("[HlwAd] Rewarded video creation failed:", e);
                finish({ ok: false, isEnded: false, err: e });
            }
        }
        return rewardPromise;
    }

    /**
     * 立即播放已加载的激励视频广告。
     * 
     * @param onShowSuccess 广告成功展示播放时的回调（用于隐藏 Loading 状态等）
     * @returns 返回 Promise<AdRes>，指示广告是否正常播放完毕
     */
    function showAdReward(onShowSuccess?: () => void): Promise<AdRes> {
        const ad = rewardCache.get(activeRewardAdId);
        if (!ad) {
            return Promise.resolve({ ok: false, isEnded: false });
        }

        const current = rewardPromise || new Promise<AdRes>((resolve) => {
            rewardResolve = resolve;
        });
        rewardPromise = current;

        ad.show()
            .then(() => {
                onShowSuccess?.();
            })
            .catch(() => {
                ad.load()
                    .then(() => {
                        ad.show()
                            .then(() => {
                                onShowSuccess?.();
                            })
                            .catch((err: unknown) => {
                                console.error("[HlwAd] Rewarded video show error:", err);
                                finish({ ok: false, isEnded: false, err });
                            });
                    })
                    .catch((err: unknown) => {
                        console.error("[HlwAd] Rewarded video load error:", err);
                        finish({ ok: false, isEnded: false, err });
                    });
            });

        return current;
    }

    return {
        setAdPopup,
        showAdPopup,
        setAdReward,
        showAdReward,
    };
}

