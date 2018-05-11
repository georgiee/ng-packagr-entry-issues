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
Checkout `v2` to follow

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
