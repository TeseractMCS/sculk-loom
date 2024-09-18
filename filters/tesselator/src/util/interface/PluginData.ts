export interface PluginData {
    name: string;
    authors: string[];
    id: string;
    description: string;
    version: `${number}.${number}.${number}${'' | `-${string}`}${'' | `.${number}${'' | `.${number}`}`}`;
    entryPoints: string[];
    modules: string[];
    external: string[];
}