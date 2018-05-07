[![Build Status](https://travis-ci.com/ChrisChares/gthash.svg?branch=master)](https://travis-ci.com/ChrisChares/gthash)
[![Coverage Status](https://coveralls.io/repos/github/ChrisChares/gthash/badge.svg?branch=master)](https://coveralls.io/github/ChrisChares/gthash?branch=master)
![npm](https://img.shields.io/npm/v/gthash.svg)
![npm](https://img.shields.io/npm/dw/gthash.svg)

# gthash
Geotemporal hashing function based on z-order curves and extending the geohash concept.  The resulting string encodes time and space on Earth with variable precision and all other characteristics of a geohash.  Comes with Typescript definitions.

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

const hash = encodeHash({
  latitude: 52
  longitude: -101,
  timestamp: -129381982
});

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
