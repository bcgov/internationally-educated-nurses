# Common

This is a common package shared by api and web. Shared components are mostly data models and validators.

`Yarn` creates a link to each workspace in the root `node_modules` folder so that other workspaces can import it.

```bash
$ ls -l node_modules/@ien
accessibility -> ../../packages/accessibility
api -> ../../apps/api
common -> ../../packages/common
web -> ../../apps/web
```

Learn more about [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)