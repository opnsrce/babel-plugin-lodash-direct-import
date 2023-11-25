const transformBabelImports = ({ types }) => {
    const {
        identifier: createIdentifier,
        importDeclaration: createImportDeclaration,
        importDefaultSpecifier: createImportDefaultSpecifier,
        isImportDefaultSpecifier,
        isImportNamespaceSpecifier,
        isImportSpecifier,
        stringLiteral: createStringLiteral
    } = types;

    const createDefaultImportStatement = (specifier, importPath) => {
        const modulePath = createStringLiteral(importPath);

        const defaultImportSpecifier = createImportDefaultSpecifier(
            createIdentifier(specifier)
        );

        return createImportDeclaration([defaultImportSpecifier], modulePath);
    };

    return {
        visitor: {
            ImportDeclaration(path, state) {
                const {
                    node: {
                        source: { value: importSource },
                        specifiers
                    }
                } = path;

                const isLodashImport = ["lodash", "lodash/fp"].includes(
                    importSource
                );

                if (!isLodashImport) {
                    return;
                }

                for (let specifier of specifiers) {
                    const {
                        local: { name: variableName } = {},
                        imported: { name: specifierName } = {}
                    } = specifier;

                    const isNamedImport = isImportSpecifier(specifier);

                    const isDefaultImport =
                        isImportDefaultSpecifier(specifier) ||
                        specifierName === "default";

                    const isNamespaced = isImportNamespaceSpecifier(specifier);

                    if (isNamedImport && !isDefaultImport && !isNamespaced) {
                        state.defaultImportList.push(
                            createDefaultImportStatement(
                                variableName,
                                `${importSource}/${specifierName}`
                            )
                        );
                    } else {
                        state.importMap.set(variableName, importSource);
                    }
                }

                path.remove();
            },
            MemberExpression(path, state) {
                const {
                    node: {
                        object,
                        property: { name: property }
                    }
                } = path;

                const objectSource = state.importMap.get(object.name);

                if (objectSource) {
                    const defaultSpecifier = `${objectSource.replace(
                        /\//g,
                        "_"
                    )}_${property}`;
                    const library = `${objectSource}/${property}`;

                    state.defaultImportList.push(
                        createDefaultImportStatement(defaultSpecifier, library)
                    );

                    path.replaceWith(createIdentifier(defaultSpecifier));
                }
            },
            Program: {
                enter(path, state) {
                    state.defaultImportList = [];
                    state.importMap = new Map();
                },
                exit(path, state) {
                    if (state.defaultImportList.length) {
                        path.node.body.unshift(...state.defaultImportList);
                    }
                }
            }
        }
    };
};

export default transformBabelImports;
