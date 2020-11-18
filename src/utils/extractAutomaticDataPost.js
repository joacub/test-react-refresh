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

export default content => {
  let contentTextPlain = '';
  let kickerSeted = ''; // eslint-disable-line
  let titleSeted = '';
  let titleTag = '';
  let subtitleTag = '';
  let subTitleSeted = '';
  let subTitleSetedOriginal = '';
  let descriptionSeted = '';
  let featureImg = false;
  const images = [];
  const links = {};
  const tagsPermitedToExtractText = {
    'header-one': true,
    'header-two': true,
    'header-three': true,
    'header-four': true,
    'header-five': true,
    'header-six': true,
    unstyled: true
  };

  const subtitlesSkipForDesc = {
    'header-one': true,
    'header-two': true,
  };

  Object.keys(content.entityMap).forEach(key => {
    const node = content.entityMap[key];
    if (node.type === 'LINK') {
      const { hidePopLinkOver, showPopLinkOver, ...dataLink } = node.data;
      links[key] = dataLink;
    }
  });

  content.blocks.forEach(node => {
    let index = 0;
    const value = node;
    index += 1;

    contentTextPlain += `${value.text.trim()} `;

    value.entityRanges.forEach(entity => {
      if (links[entity.key]) {
        links[entity.key].text = value.text.slice(entity.offset, entity.offset + entity.length);
      }
    });
    if (value.type === 'image') {
      if (!featureImg) {
        featureImg = { key: value.key, data: value.data };
      }
      images.push({ key: value.key, data: value.data });
    }
    if (!titleSeted || titleTag !== 'header-one') {
      if (index === 1 && value.type === 'header-two') {
        kickerSeted = trimString(striptags(value.text), 100);
      } else {
        if ((!titleSeted || (index < 5 && titleTag !== 'header-one')) && value.type === 'header-one') {
          titleTag = value.type;
          titleSeted = trimString(value.text, 100);
        }

        if (!titleSeted && value.type === 'header-two') {
          titleTag = value.type;
          titleSeted = trimString(value.text, 100);
        }

        if (!titleSeted && tagsPermitedToExtractText[value.type]) {
          titleSeted = trimString(value.text, 100);
        }
      }
    } else if (!subTitleSeted && tagsPermitedToExtractText[value.type]) {
      subTitleSetedOriginal = value.text;
      subtitleTag = value.type;
      subTitleSeted = trimString(subTitleSetedOriginal, 140);
    } else if ((!descriptionSeted || descriptionSeted.length < 150) && tagsPermitedToExtractText[value.type]) {
      if (!descriptionSeted && !subtitlesSkipForDesc[subtitleTag]) {
        descriptionSeted = trimString(`${subTitleSetedOriginal || ''} ${value.text}`, 200);
      } else {
        descriptionSeted = trimString(`${descriptionSeted || ''} ${value.text}`, 200);
      }
    }
  });

  const result = {
    kickerSeted, // eslint-disable-line
    titleSeted,
    titleTag,
    subTitleSeted,
    descriptionSeted,
    links,
    images,
    featureImg,
    contentTextPlain
  };

  return result;
};
