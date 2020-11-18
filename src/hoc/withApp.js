import { Consumer as AppConsumer } from 'contexts/App';

export default function withApp(Component) {
  return props => <AppConsumer>{app => <Component {...props} app={app} />}</AppConsumer>;
}
