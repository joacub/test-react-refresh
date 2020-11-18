import html2json from 'html2json';
import striptags from 'striptags';

const trimString = (str, maxLength) => {
  if (typeof str === 'string') {
    str = str.trim();
  }
  if (str.length > maxLength - 3) {
    const trimmedString = str.substr(0, maxLength - 3);
    return `${trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')))}...`;
  }

  return str;
};

function getContentChilds(contentJson, childContents) {
  for (let i = 0; i < contentJson.child.length; i += 1) {
    const value = contentJson.child[i];
    if (value.attr && value.attr.class && value.attr.class.includes('section-inner')) {
      childContents.push(value);
    }

    if (value.child) {
      getContentChilds(value, childContents);
    }
  }

  return childContents;
}

export default contentSanetize => {
  let kickerSeted = ''; // eslint-disable-line
  let titleSeted = '';
  let titleTag = '';
  let subTitleSeted = '';
  let subTitleSetedOriginal = '';
  let descriptionSeted = '';
  const contentJson = html2json.html2json(contentSanetize);
  const childContents = [];
  const tagsPermitedToExtractText = {
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
    p: true
  };
  getContentChilds(contentJson, childContents);
  childContents.forEach(node => {
    if (!node.child) {
      return;
    }
    let index = 0;
    for (let i = 0; i < node.child.length; i += 1) {
      const value = node.child[i];
      index += 1;

      if (value.tag === 'caption' || value.tag === 'figcaption') {
        continue; // eslint-disable-line
      }
      if (!titleSeted || titleTag !== 'h2') {
        if (index === 1 && value.tag === 'h3') {
          kickerSeted = trimString(striptags(html2json.json2html(value)), 100);
        } else {
          if ((!titleSeted || (index < 5 && titleTag !== 'h2')) && value.node === 'element' && value.tag === 'h2') {
            titleTag = 'h2';
            titleSeted = trimString(striptags(html2json.json2html(value)), 100);
          }

          if (!titleSeted && value.node === 'element' && value.tag === 'h3') {
            titleTag = 'h3';
            titleSeted = trimString(striptags(html2json.json2html(value)), 100);
          }

          if (!titleSeted && value.node === 'element' && tagsPermitedToExtractText[value.tag]) {
            titleSeted = trimString(striptags(html2json.json2html(value)), 100);
          }
        }
      } else if (!subTitleSeted && value.node === 'element' && tagsPermitedToExtractText[value.tag]) {
        subTitleSetedOriginal = striptags(html2json.json2html(value));
        subTitleSeted = trimString(subTitleSetedOriginal, 140);
      } else if (!descriptionSeted && value.node === 'element' && tagsPermitedToExtractText[value.tag]) {
        descriptionSeted = trimString(`${subTitleSetedOriginal} ${striptags(html2json.json2html(value))}`, 200);

        if (descriptionSeted) {
          break;
        }
      }
    }
  });

  return {
    kickerSeted, // eslint-disable-line
    titleSeted,
    titleTag,
    subTitleSeted,
    descriptionSeted
  };
};
