# NgPackagrEntryIssues

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