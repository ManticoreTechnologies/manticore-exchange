interface AssetNameParts {
    parents: string[];
    name: string;
}

const formatParentPath = (parents: string[]): string[] => {
    if (parents.length <= 1) return parents;
    
    // Always show first parent, truncate middle if needed
    if (parents.length === 2) return parents;
    
    // For longer paths, show first parent and last parent with ellipsis
    return [parents[0], '...', parents[parents.length - 1]];
};

export const splitAssetName = (assetName: string): AssetNameParts => {
    if (assetName === "EVR") {
        return {
            parents: [],
            name: "EVRMORE ($EVR)"
        };
    }

    // Split by special characters (/, #, ~)
    const parts = assetName.split(/[\/|#|~]/);
    
    return {
        parents: formatParentPath(parts.slice(0, -1)),
        name: parts[parts.length - 1]
    };
}; 