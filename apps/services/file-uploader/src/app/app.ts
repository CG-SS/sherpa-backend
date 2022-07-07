import { Validator } from 'express-json-validator-middleware';

import { defaultApp } from '@sherpa-backend/services/rest';
import { V1PostRoutes, V1PostRoutesWithSchema } from './routes/v1';
import { logger } from '@sherpa-backend/logger';
import fileUpload from 'express-fileupload';
import { environment } from './environment';

logger.defaultMeta = { service: 'file-uploader-service' };

export const app = defaultApp;

const { tempFileDir } = environment;

app.use(
  fileUpload({
    // Max 10 MB
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir,
  })
);

const { validate } = new Validator({ allErrors: true });

V1PostRoutesWithSchema.forEach(([route, schema, resolver]) =>
  app.post(`/v1${route}`, validate({ body: schema }), resolver)
);
V1PostRoutes.forEach(([route, resolver]) => app.post(`/v1${route}`, resolver));
