import html2json from 'html2json';

const containerOpenTag = {
  1: '<div class="section-inner sectionLayout-insetColumn">',
  2: '<div class="section-inner sectionLayout-fullWidth">'
};

const testIsFullWidth = node => node
  && node.attr
  && node.attr.class
  && [
    'medium-insert-images-fullWidth',
    'medium-insert-images-outside',
    'medium-insert-embeds-fullWidth',
    'medium-insert-embeds-outside'
  ].some(item => node.attr.class.includes(item));

const jsonToHtml = json => {
  if (!json) {
    return null;
  }
  let currentContainer = 1;
  let lastContainer = 1;
  let html = '<div class="section-content">';
  html += json.length > 0 && testIsFullWidth(json[0]) ? containerOpenTag[2] : containerOpenTag[1];
  // const duplicateNameDetector = {};
  json.forEach(item => {
    if (!item) {
      return;
    }
    // if (item.attr && item.attr.name) {
    //   if (duplicateNameDetector[item.attr.name]) {
    //     return;
    //   }
    //   duplicateNameDetector[item.attr.name] = true;
    // }
    if (testIsFullWidth(item)) {
      currentContainer = 2;
    } else {
      currentContainer = 1;
    }
    if (lastContainer !== currentContainer) {
      html += '</div>';
      html += containerOpenTag[currentContainer];
    }

    lastContainer = currentContainer;
    html += html2json.json2html(item);
  });

  // eslint-disable-next-line
  const emptyHtml =
    '<h2 class="editor-default"><span>Title</span></h2><p class="editor-default"><span>Tell your story...</span></p>';
  html += json.length === 0 ? emptyHtml : '';

  html += '</div></div>';

  return html;
};

export default jsonToHtml;
