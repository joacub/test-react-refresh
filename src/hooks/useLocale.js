import * as React from 'react';
import LocaleContext from 'components/Context/LocaleContext';

const { useContext } = React;

const useLocale = () => useContext(LocaleContext);

export default useLocale;
