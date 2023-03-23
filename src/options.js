'use strict';

import dotenv from 'dotenv';
import lodash from 'lodash';
import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import commander from 'commander';
import {resolve, dirname} from 'path';

const {merge} = lodash;

const IFACE = '0.0.0.0';
const PORT = 8000;
const ERROR_PROB = 0.1;
const DELAY_PROB = 0.2;
const FREQ_MS = 2000;

function assertPort(port, program, excode) {
  if (port <= 1024 || port > 65535) {
    console.error(`Invalid port (must be between 1025 and 65535): ${port}`);
    program.outputHelp();
    process.exit(excode);
  }
}

/**
 * Prepares the configuration from environment variables.
 * @return {{config: {iface:string,port:number,failures:boolean,delays:boolean,frequency:number}}} Configuration
 */
function configFromEnv() {
  dotenv.config();
  const cfg = {};
  if (process.env.IFACE) cfg.iface = process.env.IFACE;
  if (process.env.PORT) cfg.port = process.env.PORT;
  if (process.env.FREQUENCY) cfg.frequency = parseInt(process.env.FREQUENCY, 10);
  if (process.env.DELAY_PROB) cfg.delayProb = parseFloat(process.env.DELAY_PROB);
  if (process.env.ERROR_PROB) cfg.errorProb = parseFloat(process.env.ERROR_PROB);
  if (process.env.FREQUENCY) cfg.frequency = parseInt(process.env.FREQUENCY, 10);
  return cfg;
}

function metaInfo() {
  const fn = fileURLToPath(import.meta.url);
  const dn = dirname(fn);
  const path = resolve(dn, '../package.json');
  const json = JSON.parse(readFileSync(path, 'utf8'));
  return {
    name: json.name,
    version: json.version
  };
}

/**
 * Reads the command line and returns the parsed configuration.
 * @return {{config:{iface:string,port:number,failures:boolean,delays:boolean,frequency:number}}} Configuration
 */
export function parse() {
  const info = metaInfo();

  // generic properties
  const program = new commander.Command(info.name)
      .version(info.version)
      .option('-i, --iface <interface>', 'The interface the service will listen to for requests')
      .option('-p, --port <port>', 'The port number the service will listen to for requests', p => parseInt(p, 10))
      .option('-f, --frequency <ms>', 'The frequency each temperature message is sent', p => parseInt(p, 10))
      .option('-d, --delay-prob <prob>', 'The probability that a message is delayed', parseFloat)
      .option('-e, --error-prob <prob>', 'The probability that an error occurs', parseFloat)
      .option('-E, --no-env', 'Ignores the .env file')
      .option('-F, --no-failures', 'Dont\'t simulate failures')
      .option('-D, --no-delays', 'Dont\'t simulate delays')
  ;

  // parses command line
  program.parse(process.argv);
  const options = program.opts();

  const def = {
    iface: IFACE,
    port: PORT,
    frequency: FREQ_MS,
    delayProb: DELAY_PROB,
    errorProb: ERROR_PROB
  };

  // read env variables
  const env = !options.env ? {} : configFromEnv();

  const config = merge(def, env, {
    iface: options.iface,
    port: options.port,
    failures: options.failures,
    delays: options.delays,
    frequency: options.frequency,
    delayProb: options.delayProb,
    errorProb: options.errorProb
  });

  assertPort(config.port, program, 2);

  return {config};
}

export default parse;
