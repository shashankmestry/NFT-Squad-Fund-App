import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { history } from './helpers/history';
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Alert, Container } from "react-bootstrap";
import StartSquad from "./components/StartSquad";
import TransactionModal from "./components/TransactionModal";
import Notification from "./components/Notification";
import Home from "./components/Home";
import ViewSquads from "./components/ViewSquads";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showWarning: true
    }
    this.closeWarning = this.closeWarning.bind(this);
  }

  closeWarning() {
    this.setState({
      showWarning: false
    });
  }

  render() {
    return (
      <Router history={history}>
        <main className="flex-shrink-0">
          <Header />
          <Container className="mt-3">
            <Alert show={this.state.showWarning} 
              variant="warning" 
              dismissible={true} 
              className="text-center"
              onClose={this.closeWarning}
            >
              <strong>Warning: </strong> NFT Sqaud Fund is not yet live on Mainnet. Currently in Beta on Rinkeby
            </Alert>
            <TransactionModal />
            <Notification /> 
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/view" element={<ViewSquads />} />
              <Route exact path="/start" element={<StartSquad />} />
            </Routes >
          </Container>
        </main>
        <Footer></Footer>
      </Router>
    );
  }
  
}

function mapStateToProps(state) {
  // const { user } = state.auth;

  // return {
  //     user,
  // };
  return {}
}

export default connect(mapStateToProps)(App);
