import Login from './Components/Login/Login';
import Home from "./Home";
import './App.css';
import { BrowserRouter as Router , Route , Switch } from "react-router-dom";
import { store } from "./store";



function App() {


  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" >
            <Login />
          </Route>
          <Route path="*">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
