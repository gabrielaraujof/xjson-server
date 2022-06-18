import { Request } from 'express'
import url from 'url'

export default function getFullURL(req: Request) {
  const root = url.format({
    protocol: req.protocol,
    host: req.get('host'),
  })

  return `${root}${req.originalUrl}`
}
