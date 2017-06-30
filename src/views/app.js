import React from 'react';
import createReactClass from 'create-react-class';
import './assets/style.css';
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Container, Row, Col, Jumbotron, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import BPM from './components/bpm.js';

const Intro = createReactClass({
  render: function () {
    return (
      <div>
        <h1 className="jumbotron-heading display-4 mb-3">BPM-Node</h1>
        <p className="lead">BPM detection application built with Node.js</p>
      </div>
    );
  }
});

const Spinner = createReactClass({
  render: function () {
    return (
      <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle className="path" fill="none" strokeWidth="6" strokeMiterlimit="10" cx="33" cy="33" r="30"></circle>
      </svg>
    );
  }
});

const Result = createReactClass({
  render: function () {
    return (
      <div>
        <h2 className="jumbotron-heading display-4 mb-3">Result</h2>
        <h3 className="lead">{tempoValue} BPM</h3>
      </div>
    );
  }
});

let change = [
  { "ActiveComponent": <Intro /> },
  { "ActiveComponent": <Spinner /> },
  { "ActiveComponent": <Result /> }
]

var that;
var mt, fileInput, pars, refreshCalculationStatus, tempoValue;

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.toggleAboutModal = this.toggleAboutModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      navbar: false,
      modal: false,
      intro: change[0],
      shown: true
    };
  }

  toggleNavbar() {
    this.setState({
      navbar: !this.state.navbar
    });
  }

  toggleAboutModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  hide() {
    this.setState({
      shown: !this.state.shown
    });
  }

  doCalculate() {
    this.hide();
    setTimeout(() => {
      this.setState({
        intro: change[1],
        shown: true
      })
    }, 500);
    var BI = document.querySelector('input[name="tempo"]:checked');
    pars = {
      min: BI.dataset.min,
      max: BI.dataset.max
    }
    fileInput = document.getElementById("audioFile");
    mt = new BPM(fileInput, pars);
    mt.doCalculate();
    that = this;
    refreshCalculationStatus = setInterval(function () {
      if (mt.getTempoValue()) {
        clearInterval(refreshCalculationStatus);
        that.getResult();
      }
    }, 1);
  }

  getResult() {
    tempoValue = mt.getTempoValue();
    this.hide();
    setTimeout(() => {
      this.setState({
        intro: change[2],
        shown: true
      })
    }, 500);
  }

  handleSubmit = function (event) {
    event.preventDefault();
    this.doCalculate();
  }

  render() {
    const pointerCursor = { cursor: 'pointer' };
    const classes = this.state.shown ? 'intro' : 'intro hide';
    return (
      <div className="wrapper">
        <Modal className="modal-lg" isOpen={this.state.modal} toggle={this.toggleAboutModal}>
          <ModalHeader toggle={this.toggleAboutModal}>About</ModalHeader>
          <ModalBody>
            <p>BPM-Node is a BPM detection application built with Node.js. This project was bootstrapped with <a href="https://github.com/facebookincubator/create-react-app" target="_blank" rel="noopener noreferrer">Create React App</a>.</p>
            <h5>Usage</h5>
            <p>Select the audio file which to process, then choose the tempo estimation range. The BPM will be displayed after the calculation is complete.</p>
            <h5>License</h5>
            <p><a href="https://github.com/prasiman/bpm-node/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a></p>
          </ModalBody>
        </Modal>
        <Navbar className="header bg-faded" light toggleable full>
          <Container>
            <NavbarToggler right onClick={this.toggleNavbar} />
            <NavbarBrand href="/">BPM-Node</NavbarBrand>
            <Collapse isOpen={this.state.navbar} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink style={pointerCursor} onClick={this.toggleAboutModal}>About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/prasiman/bpm-node" target="_blank">Github</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <div>
          <Jumbotron className="jumbotron-header text-center mb-3">
            <Container>
              <Row>
                <Col>
                  <div className={classes}>
                    {this.state.intro.ActiveComponent}
                  </div>
                </Col>
              </Row>
            </Container>
          </Jumbotron>
          <Container id="content">
            <Row>
              <Col sm={8} className="offset-sm-3">
                <Form className="form-horizontal">
                  <FormGroup className="row">
                    <Label className="control-label" for="audioFile" sm={2}>Select File</Label>
                    <Col sm={10}>
                      <Input type="file" name="file" id="audioFile" />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label>Tempo Estimation Range</Label>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="tempo" data-min="0.3" data-max="1" />{' '}
                        60-200 BPM (default)
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="tempo" data-min="0.6" data-max="1" />{' '}
                        60-100 BPM
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="tempo" data-min="0.4" data-max="0.8" />{' '}
                        75-150 BPM
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="tempo" data-min="0.3" data-max="0.6" />{' '}
                        100-200 BPM
                      </Label>
                    </FormGroup>
                  </FormGroup>
                  <Button color="primary" onClick={this.handleSubmit}>Calculate</Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}