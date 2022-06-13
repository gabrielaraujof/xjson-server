export default function write(db) {
  return (req, res, next) => {
    db.write()
    next()
  }
}
