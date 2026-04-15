export interface MenuItem {
    key: string;
    label: string;
    icon?: string;
    value?: string;
    url?: string;
    action?: () => void;
}
