import './_';

import http from 'http';
import express from 'express';

declare global {
  namespace JsminServer {
    interface Method {
      express: typeof express
      expressServer: express.Express
      HTTP: http.Server
      launch( port: number ): void

      set( ...args: SetMethod ): JsminServer.Method
      use( ...args: UseMethod ): JsminServer.Method
      get( ...args: RestMethod ): JsminServer.Method
      post( ...args: RestMethod ): JsminServer.Method
      put( ...args: RestMethod ): JsminServer.Method
      options( ...args: RestMethod ): JsminServer.Method
      all( ...args: RestMethod ): JsminServer.Method
      nest( ...args: NestMethod ): JsminServer.Method
      deadEnd( fn: {
        ( err: any,req: customReq,res: customRes,next: express.NextFunction ): void
      } ): JsminServer.Method
    }
    type Path = string | number | boolean | RegExp
    type SetMethod = [ JsminServer.Path,JsminServer.Path ] | [ JsminServer.Path ]
    type UseMethod = [ JsminServer.Path ] | [ JsminServer.Path,JsminServer.Path ] | JsminServer.RestMethod | [ JsminServer.Callback ]
    type NestMethod = [ JsminServer.Path,{ ( router: JsminServer.Method ): JsminServer.Method } ]

    type RestMethod = [ path: JsminServer.Path,orgs: JsminServer.Callback | JsminServer.Callback[] ]
    interface Callback {
      ( req: customReq,res: customRes,next: express.NextFunction,error: Error ): void
    }

    type ResponseReturnInput = {
      // ok?: boolean
      status?: number
      body?: any
      bodyStringify?: boolean
    }
  }
  interface JsminServerExtension { }
  interface JsminExtension {
    Server: JsminServer.Method & JsminServerExtension
  }
  interface customReq extends express.Request { }
  interface customRes extends express.Response {
    return( params?: JsminServer.ResponseReturnInput ): customRes
  }
}

const expressServer: any = express();

$.Server = {
  express: express,
  expressServer,
  HTTP: new http.Server( expressServer ),
  launch: ( port ) => $.Server.HTTP.listen( port ),

  set: function ( ...args ) {
    expressServer.set( ...args );
    return this;
  },
  use: function ( ...args ) {
    expressServer.use( ...args );
    return this;
  },
  get: function ( ...args ) {
    expressServer.get( ...args );
    return this;
  },
  post: function ( ...args ) {
    expressServer.post( ...args );
    return this;
  },
  put: function ( ...args ) {
    expressServer.put( ...args );
    return this;
  },
  options: function ( ...args ) {
    expressServer.options( ...args );
    return this;
  },
  all: function ( ...args ) {
    expressServer.all( ...args );
    return this;
  },
  nest: function ( ...args ) {
    let [ path,callback ] = args;
    expressServer.use( path,callback( express.Router() as any ) );
    return this;
  },
  deadEnd: function ( fn ) {
    expressServer.use( fn );
    return this;
  },
  ...{} as any
}

$.Server.use( ( req,res,next ) => {
  res.return = function ( params ) {
    let {
      status = 200,
      body = {},
      bodyStringify = true
    } = params || {};

    let Body = body;
    if ( bodyStringify ) {
      if ( !$.is.string( body ) ) {
        Body = JSON.stringify( body );
      }
    }

    return res.status( status ).end( Body );
  }

  next();
} )