# NgPackagrEntryIssues
Example for https://github.com/dherges/ng-packagr/issues/854

## Create our baseline
```
ng new ng-packagr-entry-issues
ng generate library @my/library
ng build @my/library
```
Create the app, add the library and try a build.
That worls. So far so good. See v1.

## Provide the entry points
Checkout `v2.0` to follow

+ Remove src/lib
+ Throw in src/foo and src/bar
+ Bar is a component with dependencies to foo and to the main entry.
+ Foo is a service to inject and there is also a constant.
+ Adjust tsconfig to use them in the library without building first.
+ Add BarModule and `<lib-bar>` to the app template.
+ Run `npm start`

And you see this:
> This is bar with message from foo: dynamic-foo-value + static-foo-value + main-entry-value


Good. Let's build the library:

```
ng build @my/library
```

### First error: isSkipSelf
```
Cannot read property 'isSkipSelf' of null
TypeError: Cannot read property 'isSkipSelf' of null
    at ProviderElementContext._getDependency (ng-packagr-entry-issues/node_modules/@angular/compiler/bundles/compiler.umd.js:11389:18)
    at ng-packagr-entry-issues/node_modules/@angular/compiler/bundles/compiler.umd.js:11334:60
    at Array.map (<anonymous>)
    at ng-packagr-entry-issues/node_modules/@angular/compiler/bundles/compiler.umd.js:11334:26
    at Array.map (<anonymous>)
    at ProviderElementContext._getOrCreateLocalProvider (ng-packagr-entry-issues/node_modules/@angular/compiler/bundles/compiler.umd.js:11312:63)
    at ng-packagr-entry-issues/node_modules/@angular/compiler/bundles/compiler.umd.js:11210:23
    at Array.forEach (<anonymous>)
    at new ProviderElementContext (ng-packagr-entry-issues/node_modules/@angular/compiler/bundles/compiler.umd.js:11207:49)
    at TemplateParseVisitor.visitElement (ng-packagr-entry-issues/node_modules/@angular/compiler/bundles/compiler.umd.js:14961:31)
```

Fix: Remove Injection (see `v2.1`)
The build still fails with another error.

### Second error: Paths
The error we get no is
```
Built @my/library
Built @my/library/src/foo

BUILD ERROR
projects/my/library/src/bar/public_api.ts(1,41): error TS2307: Cannot find module '@my/library'.
projects/my/library/src/bar/public_api.ts(2,44): error TS2307: Cannot find module '@my/library/foo'.

Error: projects/my/library/src/bar/public_api.ts(1,41): error TS2307: Cannot find module '@my/library'.
projects/my/library/src/bar/public_api.ts(2,44): error TS2307: Cannot find module '@my/library/foo'.

    at Object.<anonymous> (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:53:68)
    at Generator.next (<anonymous>)
    at ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:7:71
    at new Promise (<anonymous>)
    at __awaiter (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:3:12)
    at Object.compileSourceFiles (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:19:12)
    at Object.<anonymous> (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ng-v5/entry-point/ts/compile-ngc.transform.js:44:32)
    at Generator.next (<anonymous>)
    at ng-packagr-entry-issues/node_modules/ng-packagr/lib/ng-v5/entry-point/ts/compile-ngc.transform.js:7:71
    at new Promise (<anonymous>)
```
You clearly see a wrong library path beign generated `Built @my/library/src/foo`
Fixed by moving everything out of the `src/` folder and adjusting the ng-package.json. Also fix the tsconfig to keep the app running.

Checkout `v2.2` to follow.

We still get an error.

### Third error: Reference to main entry point.
That's the remaining error:

```
BUILD ERROR
projects/my/library/bar/public_api.ts(1,41): error TS2307: Cannot find module '@my/library'.

Error: projects/my/library/bar/public_api.ts(1,41): error TS2307: Cannot find module '@my/library'.

    at Object.<anonymous> (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:53:68)
    at Generator.next (<anonymous>)
    at ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:7:71
    at new Promise (<anonymous>)
    at __awaiter (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:3:12)
    at Object.compileSourceFiles (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ngc/compile-source-files.js:19:12)
    at Object.<anonymous> (ng-packagr-entry-issues/node_modules/ng-packagr/lib/ng-v5/entry-point/ts/compile-ngc.transform.js:44:32)
    at Generator.next (<anonymous>)
    at ng-packagr-entry-issues/node_modules/ng-packagr/lib/ng-v5/entry-point/ts/compile-ngc.transform.js:7:71
    at new Promise (<anonymous>)
```

Caused by a reference from the secondary entry point to the main library.
Fixed by removing the import `import { STATIC_MAIN_ENTRY_VALUE } from '@my/library';` in bar/public_api.ts.

Checkout `v3.0` to follow.

## Final Test
With our working (but reduced in functionality (no injection, no main entry reference)) we can do the final test.
Integrate the built library in the app. The build is in dist/@my/library.

Let's point to it in the tsconfig.json

```
"paths": {
  "@my/library": [ "dist/@my/library"],
  "@my/library/*": [ "dist/@my/library/*/"]
}
```
if you did not follow along, make sure the library is created in the dist before by running `ng build @my/library` and run a `ng build --prod` for an AOT build
and check the `dist/ng-packagr-entry-issues` content by serving it in a web browser.

Works 👏

## Conclusion
1. Paths are wrong for entry points not located in the root
Base path is calculated from the root of the library (@my/library) not from the location of the entry point file (@my/library/src/public-api)
Workaround: Remove the src folder.

2. There is a problem with injections. You get a `isSkipSelf` null error.
I remember that I had this problem sometimes but I can't nail the origin. My current project (Angular 5 with ng-packagr 2) is running fine with injected values.
So it's probably related to ng-packagr 3 or Angular 6. I guess ng-packagr 3. Seems to be related to my other issue: https://github.com/dherges/ng-packagr/issues/852

3. There is a problem with dependencies from the main entry point inside secondary entry points.
By the way, this problems is in there since the secondary entry point feature landed in ng-packagr.

My workaround was to convert dependencies in the main entry to secondary entry points and import it from there.

### Environment
```
Angular CLI: 6.0.1
Node: 8.9.4
OS: darwin x64
Angular: 6.0.1
... animations, cli, common, compiler, compiler-cli, core, forms
... http, language-service, platform-browser
... platform-browser-dynamic, router

Package                            Version
------------------------------------------------------------
@angular-devkit/architect          0.6.1
@angular-devkit/build-angular      0.6.1
@angular-devkit/build-ng-packagr   0.6.1
@angular-devkit/build-optimizer    0.6.1
@angular-devkit/core               0.6.1
@angular-devkit/schematics         0.6.1
@ngtools/json-schema               1.1.0
@ngtools/webpack                   6.0.1
@schematics/angular                0.6.1
@schematics/update                 0.6.1
ng-packagr                         3.0.0-rc.4
rxjs                               6.1.0
typescript                         2.7.2
webpack                            4.6.0
```