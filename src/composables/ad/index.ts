/**
 * 小程序广告工具。
 */

declare const wx: any;

export interface AdRes {
    ok: boolean;
    isEnded?: boolean;
    err?: unknown;
}

type AdDone = (res: AdRes) => void;

let popupAd: any = null;
let popupDone: ((ok: boolean) => void) | undefined;
let popupClose: (() => void) | null = null;
let popupError: ((err: unknown) => void) | null = null;

let rewardAd: any = null;
let rewardDone: AdDone | undefined;
let rewardPromise: Promise<AdRes> | null = null;
let rewardResolve: ((res: AdRes) => void) | null = null;
let rewardClose: ((res: { isEnded?: boolean }) => void) | null = null;
let rewardError: ((err: unknown) => void) | null = null;

function api() {
    return typeof wx === "undefined" ? null : wx;
}

function finish(res: AdRes) {
    rewardDone?.(res);
    rewardResolve?.(res);
    rewardResolve = null;
    rewardPromise = null;
}

function clearReward() {
    if (!rewardAd) return;
    if (rewardClose) rewardAd.offClose?.(rewardClose);
    if (rewardError) rewardAd.offError?.(rewardError);
    rewardClose = null;
    rewardError = null;
}

export function useHlwAd() {
    function clearPopup() {
        if (!popupAd) return;
        if (popupClose) popupAd.offClose?.(popupClose);
        if (popupError) popupAd.offError?.(popupError);
        popupClose = null;
        popupError = null;
    }

    function setAdPopup(adId: string, done?: (ok: boolean) => void): boolean {
        popupDone = done;
        const wxApi = api();
        if (!adId || !wxApi?.createInterstitialAd) return false;

        clearPopup();
        popupAd = wxApi.createInterstitialAd({ adUnitId: adId });
        popupAd.onLoad?.(() => {});
        popupError = (err: unknown) => {
            console.error("插屏广告加载失败", err);
            popupDone?.(false);
        };
        popupClose = () => {
            popupDone?.(true);
        };
        popupAd.onError?.(popupError);
        popupAd.onClose?.(popupClose);
        return true;
    }

    function showAdPopup(delay = 3000): Promise<boolean> {
        return new Promise((resolve) => {
            if (!popupAd) {
                resolve(false);
                return;
            }

            const done = popupDone;
            popupDone = (ok: boolean) => {
                done?.(ok);
                resolve(ok);
            };

            setTimeout(() => {
                popupAd.show().catch((err: unknown) => {
                    console.error("插屏广告显示失败", err);
                    popupDone?.(false);
                });
            }, Math.max(0, delay));
        });
    }


    function setAdReward(adId: string, done?: AdDone): Promise<AdRes> {
        rewardDone = done;
        rewardPromise = new Promise((resolve) => {
            rewardResolve = resolve;
        });

        const wxApi = api();
        if (!adId || !wxApi?.createRewardedVideoAd) {
            finish({ ok: false });
            return rewardPromise;
        }

        clearReward();
        rewardAd = wxApi.createRewardedVideoAd({ adUnitId: adId });
        rewardAd.onLoad?.(() => {});
        rewardClose = (res: { isEnded?: boolean }) => {
            finish({ ok: !!res?.isEnded, isEnded: !!res?.isEnded });
        };
        rewardError = (err: unknown) => {
            console.error("激励视频广告加载失败", err);
            finish({ ok: false, err });
        };
        rewardAd.onClose?.(rewardClose);
        rewardAd.onError?.(rewardError);
        return rewardPromise;
    }

    function showAdReward(): Promise<AdRes> {
        if (!rewardAd) {
            return Promise.resolve({ ok: false });
        }

        const current = rewardPromise || new Promise<AdRes>((resolve) => {
            rewardResolve = resolve;
        });
        rewardPromise = current;

        rewardAd.show().catch(() => {
            rewardAd.load()
                .then(() => rewardAd.show())
                .catch((err: unknown) => {
                    console.error("激励视频广告显示失败", err);
                    finish({ ok: false, err });
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
