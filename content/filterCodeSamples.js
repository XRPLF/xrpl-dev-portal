const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const { JSDOM } = require('jsdom');

const csDir = 'content/_code-samples/';
const skipDirs = ['node_modules', '.git', '__pycache__'];
const wordsToCaps = ['xrp'];

const markdown = new MarkdownIt();
let net, tls;
if (typeof window === 'undefined') {
  net = require('net');
  tls = require('tls');
}

const toTitleCase = (s) => {
  const words = s.split(/_|[^\w']/);
  return words
    .filter((word) => word)
    .map((word) => (wordsToCaps.includes(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
    .replace("'S", "'s")
    .replace(" A ", " a ");
};

let langs = [];

const sortfunc = (cs) => {
  if (cs.title.includes('Intro') || cs.title.includes('Quickstart')) {
    return ` ${cs.title}`;
  }
  return cs.title;
};

const allCodeSamples = () => {
  const cses = [];

  const walkDir = (dirPath) => {
    const filenames = fs.readdirSync(dirPath);

    for (const skip of skipDirs) {
      const index = filenames.indexOf(skip);
      if (index > -1) filenames.splice(index, 1);
    }

    filenames.forEach((file) => {
      const fullPath = path.join(dirPath, file);

      if (fs.statSync(fullPath).isDirectory()) {
        walkDir(fullPath);
      } else if (file === 'README.md') {
        const md = fs.readFileSync(fullPath, 'utf-8');
        const html = markdown.render(md);
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const h = document.querySelector('h1, h2, h3');
        const p = document.querySelector('p');

        const cs = {
          path: dirPath,
          title: h ? h.textContent : toTitleCase(path.basename(dirPath)),
          description: p ? p.textContent : '',
          href: dirPath,
          // you can fill the 'langs' array as per your logic
          langs: [],
        };

        // Add unique names to list for sorting
        if (!langs.includes(cs.langs)) {
          langs.push(cs.langs);
        }

        cses.push(cs);
      }
    });
  };

  walkDir(csDir);

  return cses.sort((a, b) => sortfunc(a).localeCompare(sortfunc(b)));
};

export { allCodeSamples, langs as allLangs };