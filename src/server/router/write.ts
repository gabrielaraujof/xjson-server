import { NextFunction, Request, Response } from "express"
import { LowdbSync } from "lowdb"

export default function write<T>(db: LowdbSync<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    db.write()
    next()
  }
}
