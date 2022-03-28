import Login from './Components/Login/Login';
import Home from "./Home";
import './App.css';
import { BrowserRouter as Router , Route , Switch , Redirect } from "react-router-dom";
import { store } from "./store";



function App() {


  return (
    <Router>
      <div className="App">
        <Switch>
          <Redirect exact from="/" to="/app/"/>
          <Route exact path="/auth" >
            <Login />
          </Route>
          <Route path="/app/*">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
