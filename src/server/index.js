import express from 'express'

import defaults from './defaults'
import router from './router'
import rewriter from './rewriter'
import bodyParser from './body-parser'

export default {
  create: () => express().set('json spaces', 2),
  defaults,
  router,
  rewriter,
  bodyParser,
}
