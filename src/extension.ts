import './_';
declare global {
  interface Number {
    zeroEmbed( digit: number ): string
    ratio( base: number,floatings?: number ): number
    rate( base: number,floatings?: number ): number
    rank( floatings?: number ): string
    rankJp(): string
    toDate( separate?: string ): string
  }
  interface String {
    compress(): string
    encode(): string
    decode(): string
    toLower(): string
    toUpper(): string
    toCapital(): string
    clip( from: number,to?: number ): string
    partReplace( begin: number,string: string ): string
    toBlob( mimeType: any ): Blob | false
    toNumber(): number
    removeLetters(): string
  }

  namespace Array {
    type OrderInput = {
      direction: 'ASC' | 'DESC',
      keys?: ( string | number )[],
      numeral?: boolean
    }
  }
  interface Array<T> {
    order: {
      ( params: Array.OrderInput ): Array<T>
    }
  }
  interface JsminExtension {
    formatCharacter: {
      postal: {
        JP( params: string ): string
      }
      tel: {
        mobile( params: string ): string
        fixed( params: string ): string
      }
    }
    transformer: {
      weekday: {
        JP( params: number ): string
        shortJP( params: number ): string
      }
    }
  }
}
// String
$.extend( {
  compress: function () {
    return this.trim().replace( /(\s|\n|\t)/ig,"" );
  },
  encode: function ( this: string ) {
    return encodeURIComponent( this );
  },
  decode: function ( this: string ) {
    return decodeURIComponent( this );
  },
  toUpper: function ( this: string ) {
    return this.toLocaleUpperCase();
  },
  toLower: function ( this: string ) {
    return this.toLocaleLowerCase();
  },
  toCapital: function ( this: string ) {
    let letter = this;
    if ( letter ) {
      letter = letter
        .replace( /^./,this[ 0 ].toUpper() )
        .replace( /(\s|_|-)[a-z]{1}/ig,( l ) => l[ 1 ].toUpper() );
    }
    return letter;
  },
  clip: function ( this: string,from: number,to?: number ) {
    return this.slice( from,to );
  },
  partReplace: function ( this: string,begin: number,string: string ) {
    return ( this.slice( 0,begin ) + string + this.slice( begin + string.length ) );
  },
  toBlob: function ( this: string,mimeType: string ) {
    let bin = window.atob( this.replace( /^.*,/,'' ) );
    let buffer = new Uint8Array( bin.length );
    for ( var i = 0; i < bin.length; i++ ) buffer[ i ] = bin.charCodeAt( i );
    try {
      var blob = new Blob( [ buffer.buffer ],{ type: mimeType } );
    } catch ( e ) {
      return false;
    }
    return blob;
  },
  toNumber: function ( this: string ) {
    return Number( this );
  },
  removeLetters: function ( this: string ) {
    return this.replace( /[\D]/ig,'' );
  }
},String );
// Number
$.extend( {
  zeroEmbed: function ( digit: number ) {
    return String( this ).padStart( ( digit || 2 ),'0' );
  },
  ratio: function ( this: number,base: number,floatings: number = 2 ) {
    let f = 10 ** floatings;
    let r = Math.round( this / base * f * 100 ) / f;
    return r;
  },
  rate: function ( this: number,base: number,floatings: number = 2 ) {
    let f = 10 ** floatings;
    let r = Math.round( this / base * f ) / f;
    return r;
  },
  rank: function ( floatings: number = 1 ) {
    let f = 10 ** floatings;

    let num = Number( this );
    let index = num.toLocaleString().replace( /\d/ig,'' ).length;

    return Math.round( num / ( 1000 ** index ) * f ) / f + ( 'KMGTPEZY'[ index - 1 ] || '' );
  },
  rankJp: function () {
    let num = Number( this );
    let str: string = '';

    if ( num >= 1000000000000 ) {
      str = `${ num / 1000000000000 }兆`;
    } else if ( num >= 100000000 ) {
      str = `${ num / 100000000 }億`;
    } else if ( num >= 10000 ) {
      str = `${ num / 10000 }万`;
    } else if ( num >= 1000 ) {
      str = `${ num / 1000 }千`;
    } else {
      str = `${ num.toLocaleString() }`;
    }
    return str;
  },
  toDate: function ( this: number,separate = '/' ) {
    let string = String( this );
    let year = string.slice( 0,4 );
    let month = string.slice( 4,6 );
    let date = string.slice( 6,8 );

    let ar = [];
    year.length != 4 || ar.push( year );
    month.length != 2 || ar.push( month );
    date.length != 2 || ar.push( date );

    return ar.join( separate );
  }
},Number );
// Array
const getDeepProperty = ( object: plainObject,keys: ( string | number )[] ) => {
  if ( !object ) return void 0;
  let data: any = object;
  for ( let key of keys ) {
    if ( !data ) break;
    data = data[ key ];
  }
  return data;
}
$.extend( {
  order: function ( props: Array.OrderInput ) {
    let {
      direction = 'ASC',
      keys = [],
      numeral = false
    } = props;
    let returnArray = [];

    if ( keys.length ) {
      if ( numeral ) {
        returnArray = this.sort( ( a: any,b: any ) => {
          return Number( Number( getDeepProperty( a,keys ) ) > Number( getDeepProperty( b,keys ) ) ) * 2 - 1;
        } );
      } else {
        returnArray = this.sort( ( a: any,b: any ) => {
          const _a = String( getDeepProperty( a,keys ) ).replace( /(\d+)/g,m => m.padStart( 18,'0' ) ),
            _b = String( getDeepProperty( b,keys ) ).replace( /(\d+)/g,m => m.padStart( 18,'0' ) );
          return Number( _a > _b ) * 2 - 1;
        } );
      }
    } else {
      if ( numeral ) {
        returnArray = this.sort( ( a: number,b: number ) => Number( a > b ) * 2 - 1 );
      } else {
        returnArray = this.sort( ( a: string,b: string ) => {
          const _a = String( a ).replace( /(\d+)/g,m => m.padStart( 18,'0' ) ),
            _b = String( b ).replace( /(\d+)/g,m => m.padStart( 18,'0' ) );
          return Number( _a > _b ) * 2 - 1;
        } );
      }
    }

    if ( direction == 'DESC' ) returnArray = returnArray.reverse();
    return returnArray;
  }
},Array );

$.formatCharacter = {
  postal: {
    JP: ( value ) => {
      let result = '--';
      value = String( value ).removeLetters()
      if ( value.length == 7 ) result = value.replace( /^(\d{3})(.*)/,'$1-$2' );
      return result;
    }
  },
  tel: {
    mobile: ( value ) => {
      let result = '--';
      value = String( value ).removeLetters()
      if ( value.length == 11 ) result = value.replace( /^(\d{3})(\d{4})(\d{4})/,'$1-$2-$3' );
      return result;
    },
    fixed: ( value ) => {
      let result = '--';
      value = String( value ).removeLetters()
      if ( value.length == 10 ) result = value.replace( /^(\d{2})(\d{4})(\d{4})/,'$1-$2-$3' );
      return result;
    },
  },
}

$.transformer = {
  weekday: {
    JP: ( value ) => {
      return [ '日','月','火','水','木','金','土' ][ value ] + '曜日';
    },
    shortJP: ( value ) => {
      return [ '日','月','火','水','木','金','土' ][ value ];
    }
  }
}