export interface Input {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface ValueRange {
  min: number;
  max: number;
}

const LatitudeRange: ValueRange = {
  min: -90.0,
  max: 90
};

const LongitudeRange: ValueRange = {
  min: -180,
  max: 180
};

// A million years before and after the start of the Unix Epoch
const timeRadius = 31536000000000;
const TimeStampRange: ValueRange = {
  min: -1 * timeRadius,
  max: timeRadius
};

// mayflower landing
// const input: Input = {
//   latitude: 41.9584367,
//   longitude: -70.6619798,
//   timestamp: -11017900800
// };

// Roanoke
// const input: Input = {
//   latitude: 35.8897,
//   longitude: -75.6615,
//   timestamp: -12149395200
// }

// Siege of bastogne
const input: Input = {
  latitude: 50.0,
  longitude: 5.7214,
  timestamp: -791596800
};

// hitler kills himself
// const input: Input = {
//   latitude: 52.5127,
//   longitude: 13.3811,
//   timestamp: -778636800
// };

// 52.5127° N, 13.3811° E


const highOrLow = (min: number, max: number, value: number): number => {
  // Is it in the top or bottom half of the range
  if ( value > ((min + max) / 2) ) {
    return 1;
  } else {
    return 0;
  }
}

const calculateBits = (range: ValueRange, value: number, precision: number): string => {
  let mutableRange = {... range};
  let bits = '';

  let i = 0;
  while(i < precision) {
    const result = highOrLow(mutableRange.min, mutableRange.max, value);

    if (result) {
      mutableRange = {
        min: (mutableRange.min + mutableRange.max) / 2,
        max: mutableRange.max
      }
    } else {
      mutableRange = {
        min: mutableRange.min,
        max: (mutableRange.min + mutableRange.max) / 2,
      }
    }

    i++;
    bits += result
  }
  return bits;
}

export const calculateHash = (input: Input, precision: number): string => {
  const bitPrecision = Math.ceil((precision / 3) * 6)

  const latBits = calculateBits(LatitudeRange, input.latitude, bitPrecision);
  const longBits = calculateBits(LongitudeRange, input.longitude, bitPrecision);
  const timeBits = calculateBits(TimeStampRange, input.timestamp, bitPrecision);

  let interleavedBits = '';
  for ( let i=0; i<latBits.length; i++) {
    interleavedBits += (latBits.charAt(i) + longBits.charAt(i) + timeBits.charAt(i));
  }

  const chunked = interleavedBits.match(/.{1,6}/g);
  const ints = chunked.map(x => parseInt(x, 2));
  const numbers = Uint8Array.from(ints).buffer;

  const buff = new Buffer(numbers);
  const base64 = buff.toString('base64');
  return base64;
};

const reverseHash = (hash: string): Input => {
  const buff = new Buffer(hash);




  return {
    latitude: 69,
    longitude: 69,
    timestamp: 69
  }
};

console.log(calculateHash(input, 15));
