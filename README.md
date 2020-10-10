<div align="center">
  <h1>windowed-observable</h1>

  <img
    width="200"
    height="auto"
    alt="Windowed observable"
    src="https://res.cloudinary.com/daiqkausy/image/upload/v1596144724/windowed-observable.png"
  />

  <p>The home for all windowed-observable projects</p>
</div>
<hr />

![Npm version](https://img.shields.io/npm/v/windowed-observable)
![Build](https://img.shields.io/github/workflow/status/luistak/windowed-observable/CI/master)
![Size](https://img.shields.io/bundlephobia/minzip/windowed-observable)
![License](https://img.shields.io/github/license/luistak/windowed-observable)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style)](http://makeapullrequest.com)
![Downloads](https://img.shields.io/npm/dt/windowed-observable)

## Introduction

### Problem

In a micro frontends setup, one of the main problems is [cross application communication](https://dev.to/luistak/cross-micro-frontends-communication-30m3) and this library aims to solve it by providing a simple and framework agnostic API with zero configuration

### Solution

Exposing an `observable` that behaves like scoped a pub/sub topic passing events per namespaces.

This `Observable` is exported by the core package [`windowed-observable`](packages/core/REAMDE.md) with the following features:

### ✨ Features
- 📦 Scoped events by `namespaces`
- 🎣 Events history retrieval with `SubscriptionOptions`
- 🛡 100% Written in TypeScript with static types

## Packages

- [**windowed-observable**](packages/core/REAMDE.md) is a library for messaging using Observables, making it easier to communicate multiple apps or parts of an app using the window. It exposes an Observable that behaves like a scoped pub/sub topic using namespaces.

- [**react-windowed-observable**](packages/react/REAMDE.md) is a react abstraction over [`windowed-observable`](packages/core/REAMDE.md) exposing a helper that creates a scoped [`Context`](https://reactjs.org/docs/context.html) to handle events in a specific namespace
