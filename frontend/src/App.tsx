import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import SignUpOrIn from './components/credentials/SignUpOrIn';

function App() {

  return (
      
    <div className="App">
      <Switch>
        <Route path="/" exact component={SignUpOrIn} />
      </Switch>
    </div>
  );
}

export default App;
