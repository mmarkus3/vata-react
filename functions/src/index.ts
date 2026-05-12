/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/https';
import { AppModule } from './app.module';
import { onMail as onMailFunc } from './on-item/mail';

initializeApp();

/** NestJS */
const expressServer = express();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFunction = async (serverInstance: any): Promise<INestApplication> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(serverInstance),
    { logger: ['error', 'warn'] },
  );
  app.enableCors();
  return app.init();
};

createFunction(expressServer)
  .catch((error) => {
    console.error('Nest broken', error);
  });

export const api = onRequest({
  region: 'europe-north1',
  timeoutSeconds: 240,
  memory: '1GiB',
}, async (request, response) => {
  const url = new URL(request.url, `https://${request.headers.host}`);
  console.log(request.method, url.pathname);
  expressServer(request, response);
});

export const onMail = onMailFunc;
