import scroll from 'ssr-scroll-to';

function calculateScrollOffset(element, offset, alignment) {
  const { body } = document;

  const html = document.documentElement;
  const elementRect = element.getBoundingClientRect();
  const { clientHeight } = html;
  const documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  offset = offset || 0; // additional offset to top
  let scrollPosition;
  switch (alignment) {
    case 'top':
      scrollPosition = elementRect.top;
      break;
    case 'middle':
      scrollPosition = elementRect.bottom - clientHeight / 2 - elementRect.height / 2;
      break;
    case 'bottom':
      scrollPosition = elementRect.bottom - clientHeight;
      break;
    default:
      scrollPosition = elementRect.bottom - clientHeight / 2 - elementRect.height / 2;
      break; // defaul to middle
  }
  const maxScrollPosition = documentHeight - clientHeight;
  return Math.min(scrollPosition + offset + window.pageYOffset, maxScrollPosition);
}

const scrollTo = (ref, options) => {
  options = options || {
    offset: 0,
    align: 'middle'
  };
  if (ref === null) return 0;
  return scroll(0, calculateScrollOffset(ref, options.offset, options.align), options);
};

export default scrollTo;
