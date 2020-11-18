import loadable from '@loadable/component';

const HomeLoadable = loadable(() => import(/* webpackChunkName: 'home' */ './Home'));

const Home = props => <HomeLoadable {...props} />;

export default Home;
