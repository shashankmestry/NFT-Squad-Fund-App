import { Component } from "react";
import { Card, Col, Row, Spinner, ProgressBar } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "../css/squad.css";
import squadService from "../services/squad.service";
import SquadCard from "./SquadCard";

class ViewSquads extends Component {

    constructor(props) {
        super(props);

        this.state = {
            squadAddresses: [],
            loading: false,
        }
    }

    componentDidMount() {
        // squadService.getSquadAddresses().then((addresses) => {
        //     // this.setState({
        //     //     squadAddresses: addresses,
        //     //     //loading: false
        //     // });
        // });
    }

    render() {
        return(
            <>
                <h1 className="text-center text-light mt-5">VIEW SQUAD FUNDS</h1>
                {
                    this.state.loading ? 
                    <div className="text-center">
                        Loading...<Spinner animation="border" size="sm" /><br />
                    </div> :
                    <Row className="mt-5">
                        <Col xl="4" lg="6" md="6">
                            <Card className="rounded p-0 mb-4 shadow-lg">
                            <div className={"squad-status live"}>live</div>
                                <Card.Body>
                                    <div className="squad-name squad-label">
                                        <h3>OffChain Indian</h3><br />
                                    </div>
                                    <div className="squad-symbol">OCI</div>
                                    <div className="mb-4 mt-4">
                                        <ProgressBar style={{height: "10px"}}>
                                            <ProgressBar now="10" label={`10%`} key={1} />
                                        </ProgressBar>
                                        <p className="squad-progress-text">Remaining: 45 ETH</p>
                                    </div>
                                    <Row className="pb-4 pt-4 ">
                                        <Col className="text-center" md="auto">
                                            <div className="squad-label">TOTAL HOLDERS</div>
                                            <div className="squad-holder-text">1</div>
                                        </Col>
                                        <Col className="text-center">
                                            <div className="squad-label">CONTRIBUTION RANGE</div>
                                            <Row>
                                                <Col>
                                                    <div className="squad-range-text">1 {" "} ETH</div>
                                                    <div className="squad-range-label">Minimum</div>
                                                </Col>
                                                <Col>
                                                    <div className="squad-range-text">5 {" "} ETH</div>
                                                    <div className="squad-range-label">Maximum</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl="4" lg="6" md="6">
                            <Card className="rounded p-0 mb-4 shadow-lg">
                            <div className={"squad-status live"}>live</div>
                                <Card.Body>
                                    <div className="squad-name squad-label">
                                        <h3>Angel SF STARTUP</h3><br />
                                    </div>
                                    <div className="squad-symbol">ANGEL</div>
                                    <div className="mb-4 mt-4">
                                        <ProgressBar style={{height: "10px"}}>
                                            <ProgressBar now="20" label={`20%`} key={1} />
                                        </ProgressBar>
                                        <p className="squad-progress-text">Remaining: 80 ETH</p>
                                    </div>
                                    <Row className="pb-4 pt-4 ">
                                        <Col className="text-center" md="auto">
                                            <div className="squad-label">TOTAL HOLDERS</div>
                                            <div className="squad-holder-text">2</div>
                                        </Col>
                                        <Col className="text-center">
                                            <div className="squad-label">CONTRIBUTION RANGE</div>
                                            <Row>
                                                <Col>
                                                    <div className="squad-range-text">5 {" "} ETH</div>
                                                    <div className="squad-range-label">Minimum</div>
                                                </Col>
                                                <Col>
                                                    <div className="squad-range-text">20 {" "} ETH</div>
                                                    <div className="squad-range-label">Maximum</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                }
            </>
        )
    }
}

function mapStateToProps(state) {
    const { metamask } = state.metamask;
    return {
        metamask
    }
}

export default connect(mapStateToProps)(ViewSquads);