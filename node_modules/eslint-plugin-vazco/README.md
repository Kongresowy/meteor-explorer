# eslint-plugin-vazco-no-console


An eslint plugin to warn on usage of `console`.

**Table of Contents**

- [Install](#install)
- [Configuration](#configuration)
- [Rule Details](#rule-details)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm i -S eslint-plugin-vazco-no-console
```

## Configuration

Add `plugins` section and specify eslint-plugin-no-console-log as a plugin.

```json
{
  "plugins": [
    "vazco-no-console"
  ]
}
```

Then, enable the rule.

```json
{
  "rules": {
    "vazco-no-console/no-console": [1, {}]
  }
}
```


## Rule Details

This rule warns when it sees `console`. You can specify variants, like `console.warn` are not allowed.


## Licence

MIT. Copyright (c) [Vazco.eu](http://vazco.eu).
