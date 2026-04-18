import "pinia";
import type { StateTree } from "pinia";

declare module "pinia" {
    interface DefineStoreOptionsBase<S extends StateTree, Store> {
        unistorage?: boolean;
    }
}
