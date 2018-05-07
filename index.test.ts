import {
  LatitudeRange,
  LongitudeRange,
  TimeStampRange,
  _highOrLow,
  _calculateBits,
  encodeHash,
  decodeHash,
  HashInput,
  Precision
} from './index'

const inputs: HashInput[] = [
  // mayflower landing
  {
    latitude: 41.9584367,
    longitude: -70.6619798,
    timestamp: -11017900800
  },
  // Roanoke colony established
  {
    latitude: 35.8897,
    longitude: -75.6615,
    timestamp: -12149395200
  },
  // Siege of bastogne
  {
    latitude: 50.0,
    longitude: 5.7214,
    timestamp: -791596800
  },
  // Apollo 11 Launch
  {
    latitude: 28.5620,
    longitude: -80.57721,
    timestamp: -14601600
  }
];

describe('Test ranges', () => {
  test('Latitude', () => {
    expect(LatitudeRange.min).toEqual(-90);
    expect(LatitudeRange.max).toEqual(90);
  });
  test('Longitude', () => {
    expect(LongitudeRange.min).toEqual(-180);
    expect(LongitudeRange.max).toEqual(180);
  });
  // test('Timestamp', () => {
  //   expect(LatitudeRange.min).toEqual(-90);
  //   expect(LatitudeRange.max).toEqual(90);
  // });
});

describe('Test individual functions', () => {
  test('highOrLow', () => {
    expect(_highOrLow(0,10,3)).toEqual(0);
    expect(_highOrLow(3,7,6)).toEqual(1);
  })
  test('calculateBits', () => {
    expect(_calculateBits({min: 0, max: 10}, 4, 3)).toEqual('011')
    expect(_calculateBits({min: -10, max: 10}, 4, 3)).toEqual('101')
  });
  test('decodeHash', () => {
    // console.log(decodeHash('Iy07LzspJQAqFCkHJAka'));
    // reverseHash()
  })
});

describe('Test known hashes', () => {
  // console.log(encodeHash(inputs[0], 15));
  // console.log('chud');
});

describe('Precision', () => {

  test('Exact', () => {
    for ( let input of inputs) {
      const hash = encodeHash(input, Precision.Exact);
      const decoded = decodeHash(hash);
      // ~1cm precision
      expect(decoded.latitude).toBeCloseTo(input.latitude, 7);
      expect(decoded.longitude).toBeCloseTo(input.longitude, 7);
      // Nanosecond precision
      expect(decoded.timestamp).toBeCloseTo(input.timestamp, 3);
    }
  });

  test('High', () => {
    for ( let input of inputs) {
      const hash = encodeHash(input, Precision.High);
      const decoded = decodeHash(hash);
      // ~1m precision
      expect(decoded.latitude).toBeCloseTo(input.latitude, 5);
      expect(decoded.longitude).toBeCloseTo(input.longitude, 5);
      // 100ms precision
      expect(decoded.timestamp).toBeCloseTo(input.timestamp, 1);
    }
  });

  test('Mid', () => {
    for ( let input of inputs) {
      const hash = encodeHash(input, Precision.Mid);
      const decoded = decodeHash(hash);
      // ~1m precision
      expect(decoded.latitude).toBeCloseTo(input.latitude, 5);
      expect(decoded.longitude).toBeCloseTo(input.longitude, 5);
      // 1m precision
      expect(decoded.timestampError).toBeLessThan(60);
    }
  });

  test('Low', () => {
    for ( let input of inputs) {
      const hash = encodeHash(input, Precision.Low);
      const decoded = decodeHash(hash);
      // ~1km precision
      expect(decoded.latitude).toBeCloseTo(input.latitude, 2);
      expect(decoded.longitude).toBeCloseTo(input.longitude, 2);
      // 1 month precision
      expect(decoded.timestampError).toBeLessThan(60 * 60 * 24 * 30);
    }
  });
});


