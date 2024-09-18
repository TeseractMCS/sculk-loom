interface Manifest {
    format_version: number;
    header: {
        description: string;
        name: string;
        uuid: string;
        min_engine_version: [number, number, number];
        version: [number, number, number] | string;
    };
    modules: Module[];
    dependencies?: Dependency[];
    metadata?: Metadata;
}

interface Module {
    type:
        | "resources"
        | "data"
        | "client_data"
        | "interface"
        | "world_template"
        | "skin_pack"
        | "script";
    language?: "javascript" | "Javascript";
    entry?: string;
    uuid: string;
    version: [number, number, number] | string;
    description?: string;
}

interface Dependency {
    module_name?: string;
    uuid?: string;
    version: [number, number, number] | string;
}

interface Metadata {
    authors?: string[];
    license?: string;
    url?: string;
    product_type?: "" | "addon";
}

export { Manifest, Module, Dependency, Metadata };
