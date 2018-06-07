import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import DynamicImport from './DynamicImport';
import Loading from './Loading';
import Navbar from './Navbar';

const Home = (props) => (
  <DynamicImport load={() => import('./Home')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Players = (props) => (
  <DynamicImport load={() => import('./Players')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Teams = (props) => (
  <DynamicImport load={() => import('./Teams')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const TeamPage = (props) => (
  <DynamicImport load={() => import('./TeamPage')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Articles = (props) => (
  <DynamicImport load={() => import('./Articles')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

class App extends Component {
  render() {
    return (
      <Router basename={'/chat'}>
        <div>
          <Navbar />

          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/feedback' component={Players} />
            <Route path='/stats' component={Teams} />
            <Route path='/charts' component={Articles} />
            <Route path='/:teamId' exact component={TeamPage} />
            <Route render={() => <h1 className='text-center'>Four oh Four.</h1>} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App