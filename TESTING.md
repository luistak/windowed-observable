# Testing

## Running components tests locally

Run every test in the package

```sh
yarn test:ci
```

Run and watch modified files 

Go to `core` or `react` package and run
```sh
yarn test:watch
```

## Technologies

We are using a react test setup with:

- [Jest](https://github.com/facebook/jest)
- [@testing-library](https://github.com/testing-library)
  - [react](https://github.com/testing-library/react-testing-library)
  - [jest-dom](https://github.com/testing-library/jest-dom)
  - [user-event](https://github.com/testing-library/user-event)

And these eslint plugins to ensure best practices

- [eslint-plugin-jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom)
- [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library)

## Principles

> [The more your tests resemble the way your software is used,
> the more confidence they can give you.](https://testing-library.com/docs/guiding-principles)

We are following [@testing-library](https://testing-library.com/docs/guiding-principles) guiding principles, trying to avoid [testing implementation details](https://kentcdodds.com/blog/testing-implementation-details)

## Best practices

- [**Common mistakes using @testing-library**](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Avoid nesting](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing)
- [Aha testing](https://kentcdodds.com/blog/aha-testing)

## Recommended extensions

### Jest vscode extension

We recommend using the [official jest extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) to ensure a better testing experience.

But this extension have a specific drawback, there is [no official support for multiple jest-configs](https://github.com/jest-community/vscode-jest/issues/428) or [support for monorepos](https://github.com/jest-community/vscode-jest/issues/129), although we added a `setupTests.ts` that only execute for this extension, each package have their own jest config

### Which query?

[`Which query`](https://github.com/testing-library/which-query) is an awesome extension that aims to enable developers to find a better query when writing tests

There is also [the docs](https://testing-library.com/docs/dom-testing-library/api-queries) and [this article](https://testing-library.com/docs/guide-which-query) that may help you to fint the best query