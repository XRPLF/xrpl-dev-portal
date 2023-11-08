/**
 * THis is very hacky script to convert jinja templates to jsx.
 * It doesn't cover all cases yet. I tested it for index page only.
 */

const fs = require('fs');
const path = require('path');

const HtmlToJsx = require('htmltojsx');

const fileName = process.argv[2];
const pageName = path.basename(fileName, '.html.jinja').replace('page-', '').replace('home', 'index');

const outputFileName = 'content/' + pageName + '.page.tsx';

const componentName = pageName.substring(0, 1).toUpperCase() + pageName.substring(1);

const content = fs.readFileSync(fileName, 'utf8');

const mainBlockOffset = content.indexOf('{% block main %}');
const mainBlockEndOffset = content.indexOf('{% endblock %}', mainBlockOffset);
const mainBlock = content.substring(mainBlockOffset + 16, mainBlockEndOffset);

const classes = content.match(/{% block mainclasses %}(.+?){% endblock %}/)?.[1] || '';

const setStatements = mainBlock.match(/{% set ([\w\d]+) = ((.|\n)+?)%}/g);
const sets = setStatements?.map(setStatement => {
  const setStatementParts = setStatement.split(' = ');
  const setStatementName = setStatementParts[0].replace('{% set ', '');
  const setStatementValue = setStatementParts[1].replace(/%}/g, '');
  return {
    name: setStatementName,
    value: setStatementValue.replace(/_\("(.+?)"\)/g, '"$1"'),
  };
});

const mainBlockWithoutSets = mainBlock.replace(/{% set ([\w\d]+) = ((.|\n)+?)%}/g, '');

const replacedJinja = mainBlockWithoutSets
  .replace(/{%/g, '$$$$')
  .replace(/%}/g, '$$$$')
  .replace(/{{/g, '$$$$')
  .replace(/}}/g, '$$$$');

const HtmlToJsxInst = new HtmlToJsx({
  createClass: false,
  indent: '    ',
});
const jsx = HtmlToJsxInst.convert(replacedJinja);

// replace trans

// replace $$ for card in cards3 $$
const jsxWithReplacedForLoops = jsx
  .replace(/\$\$ for ([\w\d]+) in ([\w\d]+) \$\$/g, ' { $2.map($1 => (')
  .replace(/\$\$ endfor \$\$/g, ')) }')
  .replace(/="\$\$(\w+\.\w+)\$\$"/g, '={$1}')
  .replace(/="\$\$(\w+\.\w+)\$\$\$\$(\w+\.\w+)\$\$"/g, '={$1 + $2}')
  .replace(/="\$\$(\w+\.\w+)\$\$(.+?)"/g, '={$1 + "$2"}')
  .replace(/\$\$(\w+\.\w+)\$\$/g, '{$1}')
  .replace(/<img ([^>]*?)src="(.*?)"/g, '<img $1src={require("$2")}');

const jsxWithReplacedTranslate = jsxWithReplacedForLoops.replace(
  /\$\$ trans \$\$((?:.|\n)+?)\$\$ endtrans \$\$/g,
  (match, match1) => {
    if (match1.indexOf('<br className="until-sm" />') > -1) {
      const parts = match1.split('<br className="until-sm" />');
      return parts.map(part => '{translate(' + JSON.stringify(part) + ')}').join('<br className="until-sm" />' + '\n');
    }
    return '{translate(' + JSON.stringify(match1) + ')}';
  }
);

const output = `import * as React from 'react';
import { useTranslate } from '@portal/hooks';

${sets?.map(set => `const ${set.name} = ${set.value};`).join('\n\n')}

const target= {prefix: ''}; // TODO: fixme

export default function ${componentName}() {
  const { translate } = useTranslate();

  return (
    <div className="${classes}">
      ${jsxWithReplacedTranslate}
    </div>
  )
}
`;

fs.writeFileSync(outputFileName, output, 'utf8');
