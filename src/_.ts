import express from 'express';

declare global {
  interface plainObject {
    [ index: string ]: any;
  }
  interface PrototypeObject {
    prototype: any;
  }

  namespace Jsmin {
    type Args = any
    type Doms = any
    type Child = Jsmin.Args
    type Childs = Jsmin.Child[]

    interface jsMin {
      new( v?: Args ): Method
    }

    interface Method {
      [ index: number ]: Jsmin.Child;
      [ Symbol.iterator ](): void;
      length: number
      warn?: string
      src?: Jsmin.Args
      srcType?: string

      jsMin: Jsmin.jsMin
      get( v?: number ): Jsmin.Childs
      for( v: Function,n?: number ): Jsmin.Childs[]
    }
    interface IsCheck {
      what( v: any ): string
      exist( v: any ): boolean
      nullish( val: any ): boolean
      jsmin( v: any ): v is Jsmin.Method
      string( v: any ): v is string
      boolean( v: any ): v is boolean
      number( v: any ): v is number
      array( v: any ): v is any[]
      function( v: any ): v is Function
      plainObject( v: any ): v is plainObject
      element( v: any ): v is HTMLElement
      elements( v: any ): v is HTMLElement[]
      date( v: any ): v is Date
    }

    namespace Fetch {
      type Input = {
        url: string
        body?: any
        bodyStringify?: boolean
        timeout?: number
        deploy?: 'text' | 'json' | 'formData' | 'blob' | 'arrayBuffer' | 'stream' | 'none'
        defaultHeader?: boolean
      } & Omit<RequestInit,'body'>
      type Output = {
        status: number
        statusText: string
        requestTime: number
        rawData: Response
        ok: boolean
        body: any
        [ key: string ]: any
      }
    }
  }
  interface Jsmin {
    fn: Jsmin.Method | plainObject
    prototype: Jsmin.Method | plainObject
    expando: string

    ( v?: Jsmin.Args ): Jsmin.Method

    extend( v: plainObject,t?: Jsmin | PrototypeObject ): void
    uuidGen( v?: number ): string

    is: Jsmin.IsCheck

    flatArray( v: any,regression?: '-R' ): any[]
    deepMerge<T>( target: T,...args: T[] ): T
    toJson( value: any ): {
      ok: boolean
      body: any
    }
    fnScope<T>( fn: {
      (): T
    } ): T

    randomNumber: {
      ( min?: number,max?: number ): number
    }

    getLocalIP(): string
    getIp( req: express.Request ): string
    ajax( o: Jsmin.Fetch.Input ): Promise<Jsmin.Fetch.Output>
    fetch: {
      get( params: Omit<Jsmin.Fetch.Input,'method'> ): Promise<Jsmin.Fetch.Output>
      post( params: Omit<Jsmin.Fetch.Input,'method'> ): Promise<Jsmin.Fetch.Output>
      put( params: Omit<Jsmin.Fetch.Input,'method'> ): Promise<Jsmin.Fetch.Output>
      option( params: Omit<Jsmin.Fetch.Input,'method'> ): Promise<Jsmin.Fetch.Output>
    }

    pending( callback: {
      ( resolve: {
        ( result: boolean ): void
      } ): void
    },seconds: number ): Promise<boolean>
  }
  interface JsminExtension {
  }

  type glob = typeof window | typeof global | typeof self;
  var $: Jsmin & JsminExtension;
}

( ( e: glob,t: Function ) => {
  t( e );
} )( typeof window !== 'undefined' ? window : typeof global !== "undefined" ? global : self,function ( C: glob ) {
  const S: Jsmin = ( e?: Jsmin.Args ) => {
    return new S.fn.jsMin( e );
  }
  S.fn = S.prototype = {};
  S.extend = function ( o: plainObject,D = S ) {
    for ( var [ k,v ] of Object.entries( o ) ) D.prototype[ k ] = v;
  }
  let uuidGenStrList = 'abcdefghijkrmnopqrstuvwxyz0123456789';
  S.uuidGen = function ( length: number = 64 ) {
    return Array.from( { length: length } ).map( ( a,index ) => {
      let len = index == 0 ? 25 : 35;
      return uuidGenStrList[ Math.round( Math.random() * len ) ];
    } ).join( '' ).toUpperCase();
  }
  S.expando = `__jsmin_${ S.uuidGen() }`;

  /* init layer */
  {
    const result = ( Jsmin: Jsmin.Method,v: Jsmin.Args ) => {
      if ( v.length ) {
        for ( var i = 0; i < v.length; i++ ) {
          let e = v[ i ];
          Jsmin[ i ] = e;
        }
        Jsmin.length = v.length;
      } else {
        Jsmin.warn = `No Argument(s).`;
        Jsmin.length = 0;
      }
      return Jsmin;
    }
    S.extend( {
      constructor: S,
      jsMin: function ( this: Jsmin.Method,v: Jsmin.Args ) {
        this.src = v;
        this.srcType = S.is.what( v );

        return result(
          this,
          S.is.jsmin( v )
            ? v.get()
            : S.is.array( v )
              ? v
              : S.is.exist( v )
                ? [ v ]
                : []
        );
      },
    } );
  }

  /* base layer */
  {
    let map = function ( _this: Jsmin.Method,n: Function,all?: number ) {
      let arr = [];
      for ( var i = 0; i < ( _this.length || 0 ); i++ ) arr.push( n( _this[ i ],i ) );
      if ( all ) arr = arr.filter( a => a != void 0 );
      return arr;
    }
    S.extend( {
      get: function ( this: Jsmin.Method,first?: number ) {
        if ( first ) return this[ 0 ];
        return map( this,( e: Jsmin.Childs ) => { return e; } );
      },
      for: function ( this: Jsmin.Method,n: Function,returnable?: number ) {
        let r = map( this,( e: Jsmin.Childs,i: number ) => { return n( e,i ) },1 );
        if ( returnable ) return r;
        return [];
      }
    } );
  }

  S.prototype[ String( Symbol.iterator ) ] = [][ Symbol.iterator ];
  S.fn.jsMin.prototype = S.fn;

  const instance: any = S;
  C.$ = instance;

  {
    S.flatArray = ( v,r ) => {
      if ( !S.is.array( v ) ) return [ v ];
      let arr = [];
      for ( let _v of v ) arr.push( ...( r == '-R' ) ? S.flatArray( _v,'-R' ) : [ _v ] )
      return arr;
    }
    S.pending = ( callback,time ) => {
      return new Promise( ( resolve,rej ) => {
        callback( resolve );
        setTimeout( () => {
          resolve( true );
        },time );
      } );
    }
    S.deepMerge = ( target: any,...mergeObject: any[] ) => {
      if ( !mergeObject.length ) return target;
      const source = mergeObject.shift();

      if ( S.is.plainObject( target ) && S.is.plainObject( source ) ) {
        for ( const key in source ) {
          if ( S.is.plainObject( source[ key ] ) ) {
            if ( !target[ key ] ) Object.assign( target,{ [ key ]: {} } );
            S.deepMerge( target[ key ],source[ key ] );
          } else {
            Object.assign( target,{ [ key ]: source[ key ] } );
          }
        }
      }
      return S.deepMerge( target,...mergeObject ) as any;
    }
    S.toJson = ( value ) => {
      let returnObject;
      try {
        returnObject = {
          ok: true,
          body: JSON.parse( value )
        }
      } catch ( error ) {
        returnObject = {
          ok: false,
          body: error
        }
      }
      return returnObject;
    }
    S.fnScope = ( fn ) => {
      return fn();
    }

    S.randomNumber = ( min = 0,max = 100 ) => {
      return Math.round( Math.random() * ( max - min ) ) + min;
    }
  }
  {
    S.is = {
      what: function ( v ) {
        let t = 'other';
        if ( this.jsmin( v ) ) t = 'jsmin';
        else if ( this.element( v ) ) t = 'element';
        else if ( this.elements( v ) ) t = 'elements';
        else if ( this.string( v ) ) t = 'string';
        else if ( this.number( v ) ) t = 'number';
        else if ( this.array( v ) ) t = 'array';
        else if ( this.function( v ) ) t = 'function';
        else if ( this.date( v ) ) t = 'date';
        else if ( typeof v == 'undefined' ) t = 'undefined';
        else if ( v == null ) t = 'null';
        else if ( isNaN( v ) ) t = 'NaN';
        else if ( this.plainObject( v ) ) t = 'plain';

        return t;
      },
      exist: function ( v ) {
        return v === ( v ?? !v );
      },
      nullish: function ( v ) {
        return !this.exist( v );
      },
      jsmin: function ( v ): v is Jsmin.Method {
        return ( v || {} ).constructor === S;
      },
      string: function ( v ): v is string {
        return typeof v === 'string';
      },
      boolean: function ( v ): v is boolean {
        return typeof v === 'boolean';
      },
      number: function ( v ): v is number {
        return !isNaN( v ) && typeof v === 'number';
      },
      array: function ( v ): v is any[] {
        let type = {}.toString.call( v );
        return ( v instanceof Array ) || type == '[object NodeList]' || type == '[object HTMLCollection]';
      },
      function: function ( v ): v is Function {
        return typeof v === 'function';
      },
      plainObject: function ( v ): v is plainObject {
        return {}.toString.call( v ) === "[object Object]" && !this.jsmin( v );
      },
      element: function ( v ): v is HTMLElement {
        return ( v && ( ( v.nodeType == 1 && typeof v.style == 'object' && typeof v.ownerDocument == 'object' ) || [ window,document ].includes( v ) ) );
      },
      elements: function ( v ): v is HTMLElement[] {
        let type = {}.toString.call( v );
        let valid = Number( !!v && typeof v != 'string' && this.array( v ) && type !== "[object Text]" );

        if ( valid && type !== '[object NodeList]' ) for ( var e of v ) valid &= Number( this.element( e ) );
        return !!valid;
      },
      date: function ( v ): v is Date {
        return this.number( new Date( v ).getTime() );
      }
    }

    S.getLocalIP = () => {
      let localIP = '',nif = require( 'os' ).networkInterfaces();
      for ( let [ key,value ] of Object.entries( nif ) ) {
        ( value as any[] ).forEach( ( d: any ) => {
          if (
            !d.internal && d.family === 'IPv4' &&
            !d.address.match( /^(169|127)/ )
          ) localIP = d.address;
        } );
      }
      return localIP;
    }
    S.getIp = function ( req: express.Request ) {
      let addr = req.headers[ "x-forwarded-for" ] || req.socket.remoteAddress || ``,
        ip = addr.toString().match( new RegExp( /(::ffff:)?(\d+\.\d+.\d+\.\d+(:\d+)?)/ ) ) || [];
      return ip[ 2 ] || 'NONE IP';
    }
  }
  {
    const open = async ( params: Jsmin.Fetch.Input ) => {
      let StartTime = C.performance.now();
      let time = 0;
      let controller: AbortController = new AbortController();
      let limit = setTimeout( () => {
        controller.abort();
      },params.timeout );

      let resOK = false;
      let resStatus = 500;
      let resText = 'InternalServerError';
      let resBody = {}
      let rawResponse: Response = {} as any

      try {
        params.signal = controller.signal;
        let {
          url,
          deploy,
          ...Params
        } = params;

        const result = await fetch( url,Params ).then( async response => {
          resOK = response.ok;
          resStatus = response.status;
          resText = response.statusText;
          rawResponse = response;

          if ( deploy == 'none' || deploy == 'stream' ) return response;
          return response[ deploy as 'json' ]();
        } ).catch( ( error ) => {
          throw new Error( error );
        } );
        clearTimeout( limit );

        resBody = result;
      } catch ( err ) {
        if ( resStatus == 500 ) resText = String( err ) || resText;

        if ( controller.signal.aborted ) {
          resStatus = 408;
          resText = 'Timeout';
        }
        resBody = String( err );
      } finally {
        clearTimeout( limit );
        time = C.performance.now() - StartTime;
      }

      return {
        ok: resOK,
        status: resStatus,
        statusText: resText,
        body: resBody,
        requestTime: time,
        rawData: rawResponse,
      } as Jsmin.Fetch.Output;
    }
    S.ajax = async ( params ) => {
      params.defaultHeader = params.defaultHeader ?? true;

      if (
        params.body &&
        !$.is.string( params.body ) &&
        ( params.bodyStringify ?? true )
      ) params.body = JSON.stringify( params.body || {} );

      params = {
        deploy: 'json',
        timeout: 1000 * 300,
        ...params
      }

      if ( params.defaultHeader ) {
        params.headers = {
          'content-type': 'application/json',
          ...params.headers,
        }
      }
      return await open( params );
    }
    S.fetch = {
      get: async ( params ) => {
        return await S.ajax( { ...params,method: 'get' } );
      },
      post: async ( params ) => {
        return await S.ajax( { ...params,method: 'post' } );
      },
      put: async ( params ) => {
        return await S.ajax( { ...params,method: 'put' } );
      },
      option: async ( params ) => {
        return await S.ajax( { ...params,method: 'option' } );
      },
    }
  }
} );

import './extension';
import './time';
import './server';