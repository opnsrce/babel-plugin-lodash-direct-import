import { transform } from "@babel/core";
import plugin from "./index";
import { it, describe, expect } from "@jest/globals";

const transformCode = (inputCode) =>
    transform(inputCode, { plugins: [plugin] }).code;

describe("Importing From Lodash", () => {
    it("should convert named imports to default imports (single)", () => {
        const input = `import {get} from "lodash/fp";`;
        const expectedOutput = `import get from "lodash/fp/get";`;

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should convert named imports to default imports (multiple)", () => {
        const input = `import {get, map} from "lodash";`;
        const expectedOutput = [
            `import get from "lodash/get";`,
            `import map from "lodash/map";`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (_ edition)", () => {
        const input = `
            import _ from "lodash";
            const test = _.map(value);
            const test2 = _.replace(value);
        `;

        const expectedOutput = [
            `import lodash_map from "lodash/map";`,
            `import lodash_replace from "lodash/replace";`,
            `const test = lodash_map(value);`,
            `const test2 = lodash_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (custom variable)", () => {
        const input = `
            import ld from "lodash";
            const test = ld.map(value);
            const test2 = ld.replace(value);
        `;

        const expectedOutput = [
            `import lodash_map from "lodash/map";`,
            `import lodash_replace from "lodash/replace";`,
            `const test = lodash_map(value);`,
            `const test2 = lodash_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (aliased default)", () => {
        const input = `
            import {default as ld} from "lodash";
            const test = ld.map(value);
            const test2 = ld.replace(value);
        `;

        const expectedOutput = [
            `import lodash_map from "lodash/map";`,
            `import lodash_replace from "lodash/replace";`,
            `const test = lodash_map(value);`,
            `const test2 = lodash_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (namespace import)", () => {
        const input = `
            import * as ld from "lodash";
            const test = ld.map(value);
            const test2 = ld.replace(value);
        `;

        const expectedOutput = [
            `import lodash_map from "lodash/map";`,
            `import lodash_replace from "lodash/replace";`,
            `const test = lodash_map(value);`,
            `const test2 = lodash_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });
});

describe("Importing From Lodash FP", () => {
    it("should convert named imports to default imports (single)", () => {
        const input = `import {get} from "lodash/fp";`;
        const expectedOutput = `import get from "lodash/fp/get";`;

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should convert named imports to default imports (multiple)", () => {
        const input = `import {get, map} from "lodash/fp";`;
        const expectedOutput = [
            `import get from "lodash/fp/get";`,
            `import map from "lodash/fp/map";`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (_ edition)", () => {
        const input = `
            import _ from "lodash/fp";
            const test = _.map(value);
            const test2 = _.replace(value);
        `;

        const expectedOutput = [
            `import lodash_fp_map from "lodash/fp/map";`,
            `import lodash_fp_replace from "lodash/fp/replace";`,
            `const test = lodash_fp_map(value);`,
            `const test2 = lodash_fp_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (custom variable)", () => {
        const input = `
            import ld from "lodash/fp";
            const test = ld.map(value);
            const test2 = ld.replace(value);
        `;

        const expectedOutput = [
            `import lodash_fp_map from "lodash/fp/map";`,
            `import lodash_fp_replace from "lodash/fp/replace";`,
            `const test = lodash_fp_map(value);`,
            `const test2 = lodash_fp_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (aliased default)", () => {
        const input = `
            import {default as ld} from "lodash/fp";
            const test = ld.map(value);
            const test2 = ld.replace(value);
        `;

        const expectedOutput = [
            `import lodash_fp_map from "lodash/fp/map";`,
            `import lodash_fp_replace from "lodash/fp/replace";`,
            `const test = lodash_fp_map(value);`,
            `const test2 = lodash_fp_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    it("should split lodash member expressions into separate functions and imports (namespace import)", () => {
        const input = `
            import * as ld from "lodash/fp";
            const test = ld.map(value);
            const test2 = ld.replace(value);
        `;

        const expectedOutput = [
            `import lodash_fp_map from "lodash/fp/map";`,
            `import lodash_fp_replace from "lodash/fp/replace";`,
            `const test = lodash_fp_map(value);`,
            `const test2 = lodash_fp_replace(value);`
        ].join("\n");

        expect(transformCode(input)).toBe(expectedOutput);
    });

    describe("Edge Cases", () => {
        it("should handle mixed imports", () => {
            const input = `
                import _ from "lodash";
                import _fp from "lodash/fp";
                import {test} from "lodash";
                import {test2} from "lodash/fp";
                import test3 from "other-library";
            `;

            const expectedOutput = [
                `import test from "lodash/test";`,
                `import test2 from "lodash/fp/test2";`,
                `import test3 from "other-library";`
            ].join("\n");

            expect(transformCode(input)).toBe(expectedOutput);
        });

        it("should handle non-default aliasing", () => {
            const input = `
                import {test as foo} from "lodash";
                const testMe = foo(value);
            `;

            const expectedOutput = [
                `import foo from "lodash/test";`,
                `const testMe = foo(value);`
            ].join("\n");

            expect(transformCode(input)).toBe(expectedOutput);
        });
    });
});
