import 'zone.js/node';
import express from 'express';
import { join } from 'path';
import bootstrap from './main.server.js';

const app = express();
const distFolder = join(process.cwd(), 'dist/ragnarok-classic-library/browser');
const port = process.env['PORT'] || 4000;

app.engine('html', (_, options, callback) => {
  const req = (options as any).req;

  bootstrap({ document: '<app-root></app-root>', url: req.url })
    .then(html => callback(null, html))
    .catch(err => callback(err));
});

app.set('view engine', 'html');
app.set('views', distFolder);

app.get('*.*', express.static(distFolder, { maxAge: '1y' }));

app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
