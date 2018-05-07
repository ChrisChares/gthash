![Logo](https://i.imgur.com/0LJfZz3.png)

**G**eo**T**emporal hashing algorithm based on z-order curves.  A time based extension to the popular [geohash](http://geohash.org/).  Typescript 💙 

[![Build Status](https://travis-ci.com/ChrisChares/gthash.svg?branch=master)](https://travis-ci.com/ChrisChares/gthash)
[![Coverage Status](https://coveralls.io/repos/github/ChrisChares/gthash/badge.svg?branch=master)](https://coveralls.io/github/ChrisChares/gthash?branch=master)
![npm](https://img.shields.io/npm/v/gthash.svg)
![npm](https://img.shields.io/npm/dw/gthash.svg)

### Installation

This is a [node](https://nodejs.org/en/) module available though [the npm registry](https://www.npmjs.com/package/gthash)

Installation is done via `npm` or `yarn`

```bash
$ npm install gthash --save

# OR

$ yarn add geohash

```

### Getting Started

```typescript
import { encodeHash, decodeHash } from 'gthash';

// Apollo 11 launch
const hash = encodeHash({
  latitude: 28.5620
  longitude: -80.57721,
  timestamp: -14601600
});

console.log(hash); // IykrGTkfLT8LBzonFg4qMhkjKBsHBAEj
```

### Features

+ Variable precision
+ Places that are similar in space and time will share a similar prefix
+ Typescript definitions
+ 100% test coverage

### Contributing

Please do!  

+ Performance
+ Documentation
+ Hash length
+ Code coverage
