/* eslint-disable react/no-danger */
import { enqueueSnackbar } from 'redux/modules/notifier';
import Typography from '@material-ui/core/Typography';
import SnackDropdown from 'components/Notifier/SnackDropdown';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

/**
 *
 * @param {Object} param0
 * @param {Object} param0.error
 * @param {string} param0.message
 * @param {('success'|'error'|'warning'|'info')} param0.severity
 * @param {('filled'|'outlined'|'standard')} param0.variant
 * @param {boolean} param0.persist
 * @param {(Object|string)} param0.extraContent
 * @param {function} param0.dispatch
 * @param {(number|boolean)} param0.autoHideDuration
 * @param {string} param0.key
 */
const snackbarHelper = ({
  error,
  message,
  severity = 'success',
  variant = 'filled',
  persist = true,
  extraContent,
  dispatch,
  autoHideDuration = false,
  key,
}) => {
  if (error) {
    severity = 'error';
  }

  let content = null;

  if (error) {
    const html = Prism.highlight(JSON.stringify(error, 0, 3), Prism.languages.json, 'json');
    const stackBeatify = Prism.highlight(error.stack, Prism.languages.javascript, 'javsacript');
    const htmlImproved = html && html.replaceAll('\\n', '<br>');
    content = (
      <Typography gutterBottom component="div">
        {error.message || error.toString()}
        {!!__DEVELOPMENT__ && (
          <pre>
            <code dangerouslySetInnerHTML={{ __html: stackBeatify }} />
          </pre>
        )}
        <pre>
          <code dangerouslySetInnerHTML={{ __html: htmlImproved }} />
        </pre>
      </Typography>
    );
  } else {
    content = extraContent;
  }

  dispatch(enqueueSnackbar({
    message,
    options: {
      key,
      persist,
      autoHideDuration,
      content: (_key, _message) => (
        <SnackDropdown
          id={_key}
          message={_message}
          severity={severity}
          variant={variant}
          content={content}
        />
      ),
      variant: severity,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
    }
  }));
};

export default snackbarHelper;
