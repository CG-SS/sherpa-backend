import { app } from './app';
import { logger } from '@sherpa-backend/logger';

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  logger.info(`Listening to port '${port}'.`);
});
