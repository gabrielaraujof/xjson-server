import bodyParser from 'body-parser'

export default [
  bodyParser.json({ limit: '10mb', extended: false }),
  bodyParser.urlencoded({ extended: false }),
]
