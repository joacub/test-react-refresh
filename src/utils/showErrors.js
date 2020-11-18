const showErrors = (r, { dispatch, notifSend }) => {
  let errors = false;

  if (r.errors && r.errors.messages && Array.isArray(r.errors.messages) && r.errors.messages.length) {
    r.errors.messages.forEach((row, index) => {
      setTimeout(() => {
        dispatch(notifSend({
          message: `${row.message}`,
          kind: 'error',
          dismissAfter: 10000,
        }));
      }, index * 10);
    });
    errors = true;
    return errors;
  }

  if (r.errors) {
    Object.keys(r.errors).forEach((key, _index) => {
      if (key !== 'raw') {
        const meessage = r.errors[key];
        if (typeof meessage === 'object') {
          Object.keys(r.errors[key]).forEach((_key, __index) => {
            const _meessage = typeof r.errors[key][_key] === 'string'
              ? `${_key}: ${r.errors[key][_key]}`
              : Object.keys(r.errors[key][_key])
                .map(__key => `${key} ${_key}, ${r.errors[key][_key][__key]}`);

            setTimeout(() => {
              dispatch(notifSend({
                message: `Something went wrong, (${_meessage})`,
                kind: 'error',
                dismissAfter: 10000,
              }));
            }, __index * 10);
          });
        } else {
          setTimeout(() => {
            dispatch(notifSend({
              message: `Something went wrong, (${meessage})`,
              kind: 'error',
              dismissAfter: 10000,
            }));
          }, _index * 10);
        }
      }
    });
    errors = true;
  } else if (r.data.errors) {
    Object.keys(r.data.errors).forEach(key => {
      Object.keys(r.data.errors[key]).forEach((_key, _index) => {
        const meessage = Object.keys(r.data.errors[key][_key])
          .map(__key => `${key} ${_key}, ${r.data.errors[key][_key][__key]}`);

        setTimeout(() => {
          dispatch(notifSend({
            message: `Something went wrong, (${meessage})`,
            kind: 'error',
            dismissAfter: 10000,
          }));
        }, _index * 10);
      });
    });
    errors = true;
  }

  return errors;
};

export default showErrors;
