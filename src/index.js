import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv  from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/snake', (_, res) => {
	res.sendFile(path.join(__dirname, '/public/pages/snake.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
