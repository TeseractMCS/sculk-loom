export function ParseModule(moduleString: string) {
    const regex = /(?<name>@?[\w\-\/]+)@(?<version>\d+\.\d+\.\d+(-[a-zA-Z0-9\-.]+)?(\+[a-zA-Z0-9\-.]+)?)/;
    const match = moduleString.match(regex);

    if (match) {
        const { name, version } = match.groups;
        return { name, version };
    } else {
        const err = new Error(
            `No module with version found on string '${moduleString}'`,
        );
        console.error(err, err.stack);
        return undefined;
    }
}
