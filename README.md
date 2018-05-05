[![Build Status](https://travis-ci.com/ChrisChares/gthash.svg?branch=master)](https://travis-ci.com/ChrisChares/gthash)

# gthash
Geotemporal hashing function based on geohash and z-order curves.  The resulting string hash encodes time and space on Earth with variable precision and all other characteristics of a geohash.  Comes with Typescript definitions.

### Getting Started

```typescript
import { encodeHash, decodeHash } from 'gthash';

const hash = encodeHash({
  latitude: 52
  longitude: -101,
  timestamp: -129381982
});

```

### Benefits

+ Variable precision
+ Places that are similar in space and time will share a similar prefix
+ Typescript
+ No prod dependencies

### Drawbacks

All the same as a geohash

### Contributing

Please do!  

+ Performance
+ Documentation
+ Hash length
+ Code coverage
