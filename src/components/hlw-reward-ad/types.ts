export interface HlwRewardAdResult {
    /** 是否播放成功 */
    success: boolean;
    /** 广告是否完整播放结束 */
    isEnded: boolean;
    /** 广告加载是否失败 */
    loadFailed?: boolean;
    /** 加载/播放失败时的错误对象 */
    err?: any;
}
