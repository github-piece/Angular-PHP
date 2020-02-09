# 7 December 2018 - v1.3.0
- Update to Angular 7
- Update to Angular Material 7
- Removed ngx-smart-table dependency. Now we use Angular Material tables with filtering, sorting, pagination and selection.
- Added a new section with Material Forms and validations
- Removed webpack process and replaced it with tsc
- Bug fixing
- Updated all libraries to its latest versions


# Update angular-admin-template v1.2.0 - Release 15 March 2018
This update brings much more stability and ease of use. In the first versions of this template, the `angular-cli` wasn’t mature enough to support both Ahead of Time compilation and server side rendering. That forced us to explore a more complex approach using webpack.

We acknowledge this and listen our customers feedback. Besides being carefully crafted and polished, that approach was too complex for non advanced developers. Our most valuable principle is that “Angular, and our templates should be easy to develop”. That’s why in this update we replaced (without losing capabilities) the webpack workflow with the angular-cli.
Behind the scenes, the angular-cli does the exact same procedure we did before with webpack. The advantage of the cli is that these procedures are hidden behind a simple config file (`angular-cli.json`). Yet advanced users can opt out and [**eject**](https://github.com/angular/angular-cli/wiki/eject) the webpack config to mold it to their specific needs.

Please read the [DOCUMENTATION](http://bit.ly/angular-admin-template) for more in-depth explanation about this new workflow.

This update includes:
------
- Update **Angular CLI** from `1.5.1` to `1.7.3`
- Update **Angular** from `5.0.2` to `5.2.8`

This new version includes a bunch of fixes and route the next update when Angular 6 becomes stable. Here's a [great guide](https://alligator.io/angular/angular-5/) that covers most of the steps to upgrade.
The most significant changes that affect this project were the new [HttpClient](https://alligator.io/angular/httpclient-intro/) and the new version of [RxJs](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md) that changed the way we use and include operators in our code.

- Update **Angular Material** from `5.0.0.rc0` to `5.2.4`
- Update all the barrels to avoid circular dependencies warnings. Following one [simple rule](https://github.com/angular/angular-cli/issues/1831#issuecomment-242953578): Do not import a symbol from a barrel that export the current file.
- Fix server side rendering for some views that were not working properly (this had to do with third party libraries that didn't work as expected with server side rendering)
- Updated and removed unused third party libraries

Removed `ng2-datepicker` and `ngx-chips` as the latest version of Angular Material has robust components for these use cases.
Updated `nouislider` and `ng2-nouislider`

- Enforce the [**Angular Style Guide**](https://angular.io/guide/styleguide) throughout the project
- Include `pre-commit` hook in `package.json` to enforce linting before commiting
- Improve DOCUMENTATION
- Refactor code

# Update angular-admin-template v1.1.0 - Release 27 December 2017
Bug fixes
