import fs from 'fs'
import path from 'path'
import express, { NextFunction, Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'
import compression from 'compression'
import errorhandler from 'errorhandler'
import bodyParser from './body-parser'

interface MiddlewaresOptions {
  /**
   * Path to static files
   * @default "public" (if folder exists)
   */
  static?: string;

  /**
   * Enable logger middleware
   * @default true
   */
  logger?: boolean;

  /**
   * Enable body-parser middleware
   * @default false
   */
  bodyParser?: boolean;

  /**
   * Disable compression
   * @default false
   */
  noGzip?: boolean;

  /**
   * Disable CORS
   * @default false
   */
  noCors?: boolean;

  /**
   * Accept only GET requests
   * @default false
   */
  readOnly?: boolean;
}

export default function (userOpts: MiddlewaresOptions) {
  const userDir = path.join(process.cwd(), 'public')
  const defaultDir = path.join(__dirname, '../../public')
  const staticDir = fs.existsSync(userDir) ? userDir : defaultDir

  const opts = { logger: true, static: staticDir, ...userOpts };

  const arr = []

  // Compress all requests
  if (!opts.noGzip) {
    arr.push(compression())
  }

  // Enable CORS for all the requests, including static files
  if (!opts.noCors) {
    arr.push(cors({ origin: true, credentials: true }))
  }

  if (process.env.NODE_ENV === 'development') {
    // only use in development
    arr.push(errorhandler())
  }

  // Serve static files
  arr.push(express.static(opts.static))

  // Logger
  if (opts.logger) {
    arr.push(
      logger('dev', {
        skip: (req: Request) =>
          process.env.NODE_ENV === 'test' || req.path === '/favicon.ico',
      })
    )
  }

  // No cache for IE
  // https://support.microsoft.com/en-us/kb/234067
  arr.push((req: Request, res: Response, next: NextFunction) => {
    res.header('Cache-Control', 'no-cache')
    res.header('Pragma', 'no-cache')
    res.header('Expires', '-1')
    next()
  })

  // Read-only
  if (opts.readOnly) {
    arr.push((req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'GET') {
        next() // Continue
      } else {
        res.sendStatus(403) // Forbidden
      }
    })
  }

  // Add middlewares
  if (opts.bodyParser) {
    arr.push(bodyParser)
  }

  return arr
}
