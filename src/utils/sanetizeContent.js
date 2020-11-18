import sanitizeHtml from 'sanitize-html';

export default content => {
  let featureImg = null;
  const images = [];
  const contentSanetize = sanitizeHtml(content, {
    allowedTags: false,
    allowedAttributes: false,
    parser: {
      lowerCaseTags: true
    },
    // transformTags: {
    //   '*': (tagName, attribs) => {
    //     if (
    //       attribs.class
    //       && (attribs.class.includes('medium-insert-active') || attribs.class.includes('medium-insert-image-active'))
    //     ) {
    //       attribs.class = attribs.class.replace('medium-insert-active', '');
    //       attribs.class = attribs.class.replace('medium-insert-image-active', '');
    //     }

    //     if (attribs.contenteditable) {
    //       delete attribs.contenteditable;
    //     }
    //     return {
    //       tagName,
    //       attribs
    //     };
    //   }
    // },
    exclusiveFilter(node) {
      // if (!keepDefaults && node.attribs && node.attribs.class === 'editor-default') {
      //   return true;
      // }

      // if (node.tag === 'h1') {
      //   return true;
      // }

      // if ((node.tag === 'h2' || node.tag === 'h3' || node.tag === 'h4') && !node.text.trim()) {
      //   return true;
      // }

      // if (
      //   node.tag === 'div'
      //   && node.attribs
      //   && (node.attribs.class === 'medium-insert-images-placeholder'
      //     || node.attribs.class === 'medium-insert-search'
      //     || node.attribs.class === 'medium-insert-embeds-overlay'
      //     || node.attribs.class === 'medium-insert-buttons'
      //     || node.attribs['data-placeholder'])
      // ) {
      //   return true;
      // }

      // if (node.tag === 'figcaption' && node.attribs && node.attribs['data-placeholder']) {
      //   return true;
      // }

      if (node.tag === 'img' && node.attribs && node.attribs.src) {
        const height = node.attribs['data-height'];
        const width = node.attribs['data-width'];
        const id = node.attribs['data-id'];
        const md5 = node.attribs['data-id'];
        const format = node.attribs.src.split('.').pop(-1);
        const imageObject = {
          height,
          width,
          id,
          md5,
          format
        };
        if (featureImg === null) {
          featureImg = imageObject;
        }
        images.push(imageObject);
      }
    }
  });

  return { contentSanetize, featureImg, images };
};
