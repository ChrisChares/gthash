export interface HashInput {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface HashOutput extends HashInput {
  latitudeError: number;
  longitudeError: number;
  timestampError: number;
}

export enum Precision {
  // 1km precision and one month precision.  Ancient historical use
  Low = 12,
  // 1m and minute precision.  Historical use
  Mid = 21,
  // 1m and 100 ms precision.  Aimed at general use
  High = 24,
  // picosecond and nonmeter precision 
  Exact = 30
}

export interface ValueRange {
  min: number;
  max: number;
}

export const LatitudeRange: ValueRange = {
  min: -90.0,
  max: 90
};

export const LongitudeRange: ValueRange = {
  min: -180,
  max: 180
};

// A hundred thousand years before and after the start of the Unix Epoch
const timeRadius = 60 * 60 * 24 * 365 * 100000;
export const TimeStampRange: ValueRange = {
  min: -1 * timeRadius,
  max: timeRadius
};

/**
 * Encode HashInput -> string.
 * @param {HashInput} input
 * @param {number|Precision} precision - Number of characters in resulting hash
 * @returns string - the hash
 */
export const encodeHash = (input: HashInput, precision: number|Precision): string => {
  const bitPrecision = Math.ceil((precision / 3) * 6)

  const latBits = _calculateBits(LatitudeRange, input.latitude, bitPrecision);
  const longBits = _calculateBits(LongitudeRange, input.longitude, bitPrecision);
  const timeBits = _calculateBits(TimeStampRange, input.timestamp, bitPrecision);

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

/**
 * Decode string -> HashOutput.
 * @param {hash} string - A geotemporal hash string
 * @returns {HashOutput}
 */
export const decodeHash = (hash: string): HashOutput => {
  const buf = Buffer.from(hash, 'base64'); 
  const nums = Uint8Array.from(buf);

  const binaryString = nums.reduce((sum: string, next: number): string => {
    for ( let i=5; i>= 0; i--) { sum += (next >> i) & 1 }
    return sum
  }, '');

  let latBits: string = '';
  let longBits: string = '';
  let timeBits: string = '';

  for (let i=0; i<binaryString.length; i++) {
    switch ( i % 3 ) {
      case 0: latBits += binaryString.charAt(i); break;
      case 1: longBits += binaryString.charAt(i); break;
      case 2: timeBits += binaryString.charAt(i); break;
    }
  }

  const [latitude, latitudeError] = _decodeBinaryString(latBits, LatitudeRange);
  const [longitude, longitudeError] = _decodeBinaryString(longBits, LongitudeRange);
  const [timestamp, timestampError] = _decodeBinaryString(timeBits, TimeStampRange);

  return {
    latitude, latitudeError,
    longitude, longitudeError,
    timestamp, timestampError
  }
};

export const _highOrLow = (min: number, max: number, value: number): number => {
  // Is it in the top or bottom half of the range
  if ( value > ((min + max) / 2) ) { return 1; } 
  else { return 0; }
}

export const _calculateBits = (range: ValueRange, value: number, precision: number): string => {
  let mutableRange = {... range};
  let bits = '';

  let i = 0;
  while(i < precision) {
    const result = _highOrLow(mutableRange.min, mutableRange.max, value);

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

export const _decodeBinaryString = (bits: string, range: ValueRange): [number, number] => {
  let mutableRange = {... range};

  for (let i=0; i<bits.length; i++) {
    const bit = bits.charAt(i);
    if ( bit === '1') {
      mutableRange = {
        min: (mutableRange.min + mutableRange.max) / 2,
        max: mutableRange.max
      }
    } else {
      mutableRange = {
        min: mutableRange.min,
        max: (mutableRange.min + mutableRange.max) / 2
      }
    }
  }

  const error = (mutableRange.max - mutableRange.min) / 2;

  return [mutableRange.min + error, error];
}
