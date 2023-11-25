# Babel Plugin: Lodash Direct Imports

## Installation

```bash
npm i --save-dev babel-plugin-lodash-direct-import
```

## Usage

An example `.babel.rc` file:

```json
{
    "plugins": ["lodash-direct-import"]
}
```

## What This Plugin Does

This plugin converts various types of `import` statements for `lodash` and
`lodash/fp` functions into direct function imports. This change assists
libraries like [https://webpack.js.org/](Webpack) in efficiently bundling code
by only importing the functions need to build the module / bundle. This is
commonly referred to as "cherry picking".

## Why This Plugin is Needed

If you don't use direct imports, Webpack will end up pulling in all of lodash
just to grant a module access to the handful of functions it needs. This leads
to increased bundle bloat, which negatively impacts the performance of your
applications and sites.

## How This Plugin Works

This lodash plugins converts your imports to direct imports. It can handle the
following import types:

### Named Imports

```js
import { get, replace } from "lodash";
```

Becomes

```js
import get from "lodash/get";
import replace from "lodash/replace";
```

### Named Imports (Aliased)

```js
import { test as foo } from "lodash";
const testMe = foo(value);
```

Becomes

```js
import foo from "lodash/test";,
const testMe = foo(value);
```

### Default Imports

```js
import _ from "lodash";

const foo = _.get("bar");
```

Becomes

```js
import lodash_get from "lodash/get";

const foo = lodash_get("bar");
```

### Default Imports (Aliased)

```js
import { default as _ } from "lodash";

const foo = _.get("bar");
```

Becomes

```js
import lodash_get from "lodash/get";

const foo = lodash_get("bar");
```

## Namespaced Imports

```js
import * as ld from "lodash";
const test = ld.map(value);
const test2 = ld.replace(value);
```

Becomes

```js
import lodash_map from "lodash/map";
import lodash_replace from "lodash/replace";
const test = lodash_map(value);
const test2 = lodash_replace(value);
```

## Helpful Development Resources

- [AST Spec](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)
- [Babel Types](https://babeljs.io/docs/babel-types)
- [AST Explorer](https://astexplorer.net/)
