const nodeContainerHot = document.createElement('div');
nodeContainerHot.setAttribute('id', 'hot-progress');
nodeContainerHot.setAttribute('class', 'r-leave-to');

const style = document.createElement('style');
style.innerHTML = `#hot-progress {
    box-sizing: border-box;
    position: fixed;
    font-family: monospace;
    bottom: 20px;
    right: 20px;
    background-color: #2E495E;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.2);
    color: #00C48D;
    width: 90px;
    z-index: 2147483647;

    transition-delay: 0.2s;
    transition-property: all;
    transition-duration: 0.3s;
  }
  #hot-progress img {
    width: 1.1em;
    position: relative;
    top: 3px;
    margin-right: 10px;
  }

  .r-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  #hot-progress span {
    float: right;
  }
  `;

const imgNode = document.createElement('IMG');
// eslint-disable-next-line
imgNode.setAttribute(
  'src',
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K' // eslint-disable-line max-len
);

const textnodeWrap = document.createElement('span');
const textnode = document.createTextNode('0%');
textnodeWrap.appendChild(textnode);

nodeContainerHot.appendChild(imgNode);
nodeContainerHot.appendChild(textnodeWrap);

const bodyNode = document.getElementsByTagName('body')[0];
bodyNode.appendChild(style);
bodyNode.appendChild(nodeContainerHot);

const incresePercent = _progress => {
  textnode.textContent = `${_progress}%`;

  if (_progress >= 99) {
    nodeContainerHot.setAttribute('class', 'r-leave-to');
  } else {
    nodeContainerHot.setAttribute('class', '');
  }
};

// webpack-dev-server sends messages with `webpack` prefix via postMessage
// we handle the message and display a status bar on the top of the page
window.addEventListener('message', _event => {
  const webpackEventPrefix = 'webpack';
  const { type: eventType, data: eventData = {} } = _event.data;

  if (eventType && eventType.startsWith(webpackEventPrefix)) {
    const event = eventType.substr(webpackEventPrefix.length).toLowerCase();
    const progress = (event === 'progress') ? eventData.percent : 100;
    // const message = eventData.msg || '';
    incresePercent(progress);
  }
});
