#!/usr/bin/env node
import pkg from '../../package.json'
import pleaseUpgradeNode from 'please-upgrade-node'
import cli from '.'

pleaseUpgradeNode(pkg)
cli()
