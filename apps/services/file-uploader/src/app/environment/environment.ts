export const environment = {
  production: process.env.NODE_ENV === 'production',
  // The dir where the unparsed files will reside.
  unparsedFilesDir: process.env.UNPARSED_FILES_DIR ?? '/tmp/unparsed',
  // The dir where the parsed files will reside. After the file gets parsed, it's
  // move to the parsed files dir.
  parsedFilesDir: process.env.PARSED_FILES_DIR ?? '/tmp/parsed',
  // The dir where the transient files will be stored.
  tempFileDir: process.env.TMP_DIR ?? '/tmp',
  // The kafka topic to produce to.
  kafkaTopic: process.env.KAFKA_TOPIC ?? 'default-topic',
  // The batch size that the file parser will produce to Kafka.
  fileParserBatchSize: +process.env.FILE_PARSER_BATCH_SIZE ?? 5,
};
