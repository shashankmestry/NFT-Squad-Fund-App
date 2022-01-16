import { Component } from "react";
import { Card, Col, ProgressBar, Row, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import squadService from "../services/squad.service";
import "../css/squad.css";
import Decimal from "decimal.js-light";
import { Link } from "react-router-dom";

class SquadCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            squadAddress: props.address,
            squad: null,
            loading: true,
        }
        this.loadSquad = this.loadSquad.bind(this);
    }

    loadSquad() {
        squadService.getSquadDetails(this.state.squadAddress).then((squadDetails) => {
            this.setState({
                squad: squadDetails,
                loading: false
            });
        });
    }

    componentDidMount() {
        this.loadSquad();
    }

    render() {
        const {metamask} = this.props;
        const squadStatus = {
            1: 'pending',
            2: 'live',
            3: 'expired',
            4: 'closed',
            5: 'acquired'
        }
        return(
            <Card className="rounded p-0 mb-4 shadow-lg">
                {
                    this.state.loading ? 
                    <Card.Body className="text-center">
                        Loading... <Spinner animation="border" size="sm" />
                    </Card.Body>:
                    <>
                        <div className={"squad-status "+squadStatus[this.state.squad.status]}>{squadStatus[this.state.squad.status]}</div>
                        <Card.Body>
                            <div className="squad-name squad-label">
                                <Link to={"/squad/"+this.state.squadAddress}>{this.state.squad.name}</Link><br />
                                { this.state.squad.twitterHandle && <small><a href={"https://twitter.com/"+this.state.squad.twitterHandle} target="_blank" rel="noreferrer" className="text-muted">@{this.state.squad.twitterHandle}</a></small> }
                            </div>
                            <div className="squad-symbol">{this.state.squad.symbol}</div>
                            <div className="mb-4 mt-4">
                                <ProgressBar style={{height: "10px"}}>
                                    <ProgressBar now={this.state.squad.currentInvstPercent} label={`${this.state.squad.currentInvstPercent}%`} key={1} />
                                </ProgressBar>
                                <p className="squad-progress-text">Remaining: {Decimal(this.state.squad.targetView).minus(this.state.squad.currentInvestmentView).toString()} {this.state.squad.investmentCurrency}</p>
                            </div>
                            <Row className="pb-4 pt-4 ">
                                <Col className="text-center" md="auto">
                                    <div className="squad-label">TOTAL HOLDERS</div>
                                    <div className="squad-holder-text">{this.state.squad.investorCount}</div>
                                </Col>
                                <Col className="text-center">
                                    <div className="squad-label">CONTRIBUTION RANGE</div>
                                    <Row>
                                        <Col>
                                            <div className="squad-range-text">{this.state.squad.minInvestmentView} {" "} {this.state.squad.investmentCurrency}</div>
                                            <div className="squad-range-label">Minimum</div>
                                        </Col>
                                        <Col>
                                            <div className="squad-range-text">{this.state.squad.maxInvestmentView} {" "} {this.state.squad.investmentCurrency}</div>
                                            <div className="squad-range-label">Maximum</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </>
                }
            </Card>
        );
    }
}

function mapStateToProps(state) {
    const { metamask } = state.metamask;
    return {
        metamask
    }
}

export default connect(mapStateToProps)(SquadCard);