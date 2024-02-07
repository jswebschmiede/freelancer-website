export interface MetaSEO {
    title?: string;
    description?: string;
    canonical?: string | URL;
    noindex?: boolean;
    nofollow?: boolean;
    ogTitle?: string;
    ogType?: string;
    ogImage?: string;
}
