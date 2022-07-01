import { RouteResolver } from "@sherpa-backend/services/rest";
import { Request, Response } from "express";
import { logger } from "@sherpa-backend/logger";
import { UploadedFile } from "express-fileupload";
import { environment } from "../../environment";
import path from "path";
import { getUnixTime } from "date-fns";

const { unparsedFilesDir } = environment;

// POST /events/json
export const uploadJsonFile: RouteResolver = [
  '/upload/events/json',
  async (req: Request, res: Response) => {
    const { files } = req;

    if(!files || !Object.keys(files).length){
      res.status(422).send();
      return;
    }

    // We only grab the first file.
    const keys = Object.keys(files);
    const jsonFile = files[keys[0]] as UploadedFile;

    // If the file is truncated, it's over the size limit.
    if(jsonFile.truncated){
      res.status(422).send();
      return;
    }

    const { name } = jsonFile;

    // We only accept JSONs, so we check for the file extension.
    // Of course, that doesn't mean that it is actually a JSON, but it's all
    // we can do for now.
    if(!name.endsWith('.json')){
      res.status(422).send();
      return;
    }

    logger.info(`Received file '${name}'`);
    logger.info(`Moving to '${unparsedFilesDir}'.`);

    try {
      // We timestamp the name so there are fewer chances of collision.
      await jsonFile.mv(path.join(unparsedFilesDir, `${getUnixTime(new Date())}-${name}`));
    } catch (e) {
      logger.error(e);

      res.status(500).send();
      return;
    }

    res.status(200).send();
  },
];
