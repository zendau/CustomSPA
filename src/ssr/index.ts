/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { readdir, lstatSync } from 'fs'
import {JSDOM} from 'jsdom'

import App from '@app/components/App'
import { SPA } from '@SPA';
import router from '@app/router';
import { storeInstance } from '@app/store';

const server = Bun.serve({
  port: 3000,
  fetch(req) {

    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    const document = dom.window.document;

    const q = readdir('../app', (err, files) => {
      if (err) console.log('err')

      files.forEach(file => console.log('file', file, lstatSync(`../app/${file}`).isDirectory()))
    })


    const q2 = document.createElement("div");
    q2.id ='5'


    // new SPA(App).use("store", storeInstance).mount(q2);


    // console.log('q2', q2)

    return new Response(JSON.stringify(document), { headers: { "Content-Type": "text/html", } });
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);