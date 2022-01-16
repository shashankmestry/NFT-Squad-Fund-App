import { Component } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { createSquad } from "../actions/squad";
import { TRANSACTION_SUBMITTED } from "../actions/types";

class StartSquad extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initiated: false,
            initiateLoading: false,
            name: "",
            tokenSymbol: "",
            subFundCode: "",
            target: "",
            minInvestment: "",
            maxInvestment: "",
            totalSupply: "",
            purpose: "",
            startSpadLoading: false,
            errorMsg: "",
            viewSpadsRedirect: false,
            newSpadAddress: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.initiateSpadCreation = this.initiateSpadCreation.bind(this);
        this.handleCreateSpad = this.handleCreateSpad.bind(this);

    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value, errorMsg: "" });
    }

    initiateSpadCreation() {
        let error = this.showWarningModal();
        if(error) {
            return;
        }
    }

    async handleCreateSpad(event) {
        event.preventDefault();
        let error = this.showWarningModal();
        if(error) {
            return;
        }
        
        if(this.state.name === '' || this.state.tokenSymbol === '' || this.state.target === '' || this.state.minInvestment === '' || this.state.maxInvestment === '' || this.state.totalSupply === '') {
            this.setState({ errorMsg: "All fields are compulsory" });
            return;
        }
        if(this.state.minInvestment >= this.state.maxInvestment) {
            this.setState({ errorMsg: "Minimum investment amount should be less than maximum investment" });
            return;
        }
        if(this.state.maxInvestment >= this.state.target) {
            this.setState({ errorMsg: "Maximum investment amount should be less than SPAD size" });
            return;
        }
        if(this.state.isPrivate && this.state.passKey === '') {
            this.setState({ errorMsg: "Pass key is required for private SPADs" });
            return;
        }
        let _passKey = this.state.isPrivate ? this.state.passKey : "";

        this.setState({startSpadLoading: true});

        this.props.dispatch(
            createSquad(this.props.metamask.address, this.state.name, this.state.tokenSymbol, this.state.target, this.state.minInvestment, this.state.maxInvestment, this.state.totalSupply, _passKey)
        )
        .then((response) => {
            if(response !== 200) {
                this.setState({
                    initiateLoading: false,
                    initiated: true,
                    startSpadLoading: false,
                });
            }
        })
        .catch(() => {
            this.setState({
                initiateLoading: false,
                startSpadLoading: false,
            });
        });
    }

    addContractListener() {
        // spadFactoryContract.events.SPADCreated({
        //     filter: {initiator: this.props.metamask.address}
        // }, (error, data) => {
        //     if(error) {
        //         this.props.dispatch({
        //             type: NOTIFICATION_SUBMITTED,
        //             payload: {
        //                 show: true,
        //                 message: "SPAD creation failed.",
        //                 success: false
        //             },
        //         });
        //     } else {
        //         this.props.dispatch({
        //             type: NOTIFICATION_SUBMITTED,
        //             payload: {
        //                 show: true,
        //                 message: "SPAD created successfully.",
        //                 success: true
        //             },
        //         });
        //         this.setState({
        //             newSpadAddress: data.returnValues.spadAddress,
        //         });
        //         this.setState({
        //             viewSpadsRedirect: true,
        //         });
        //     }
        // });
    }

    showWarningModal() {
        let data = {
            show: true,
            message: "",
            code: 1000
        }
        let error = false;
        if(this.props.metamask.address === "") {
            data.message = "Please connect MetaMask"
            error = true;
        } else if(this.props.metamask.network !== 'Rinkeby') {
            data.message = "Please switch to Rinkeby Network"
            error = true;
        }
        if(error) {
            this.props.dispatch({
                type: TRANSACTION_SUBMITTED,
                payload: data
            });
            return true;
        } else {
            return false; 
        }
    }

    componentDidMount() {
        this.addContractListener();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.metamask.address !== this.props.metamask.address) {
            this.setState({
                initiateLoading: false,
                initiated: false,
            });
        }
    }

    render() {

        return(
            <div className="text-center mt-5">
                { this.state.viewSpadsRedirect && <Navigate to={'/spad/'+this.state.newSpadAddress} /> }
                <small className="text-light">LETS GET STARTED</small>
                <h1 className="text-primary">START A FUND</h1>
               
                <Card className="rounded shadow-lg mt-4 compact">
                    <Card.Body className="p-5">
                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label>
                                    NFT COLLECTION <br />
                                    (ONLY HOLDERS OF THIS NFT CAN CONTRIBUTE) 
                                </Form.Label>
                                <Form.Control type="text" placeholder="Name your Spad (10 characters)" 
                                    id="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>FUND SYMBOL</Form.Label>
                                <Form.Control type="text" placeholder="TOKEN SYMBOL (5 CHARACTERS MAX)" 
                                    id="tokenSymbol"
                                    value={this.state.tokenSymbol}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>MAX FUND SIZE</Form.Label>
                                <Form.Control type="number" min="1" placeholder="100 ETH" 
                                    id="target"
                                    value={this.state.target}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>FUND PURPOSE</Form.Label>
                                <Form.Control type="text" placeholder="BUY A LAND IN DECENTRALAND" 
                                    id="purpose"
                                    value={this.state.purpose}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>SUB-FUND CODE</Form.Label>
                                <Form.Control type="text" placeholder="FUND CODE (5 CHARACTERS MAX)" 
                                    id="subFundCode"
                                    value={this.state.subFundCode}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>MINIMUM PARTICIPATION AMOUNT</Form.Label>
                                <Form.Control type="number" min="1" placeholder="0.1 ETH" 
                                    id="minInvestment"
                                    value={this.state.minInvestment}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>MAXIMUM PARTICIPATION AMOUNT</Form.Label>
                                <Form.Control type="number" min="1" placeholder="5 ETH" 
                                    id="maxInvestment"
                                    value={this.state.maxInvestment}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>TOTAL SUPPLY OF {this.state.tokenSymbol ? this.state.tokenSymbol : 'TOKEN'}</Form.Label>
                                <Form.Control type="number" min="1" placeholder="100" 
                                    id="totalSupply"
                                    value={this.state.totalSupply}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            
                            <div className="start-spad-actions">
                                {
                                    this.state.initiateLoading ? 
                                    <Button className="rounded" disabled>
                                        CREATING NFT FUND <Spinner animation="border" size="sm" />
                                    </Button> :
                                    <Button className="rounded" onClick={this.initiateSpadCreation}>CREATE NFT FUND</Button>
                                }
                            </div>
                            <p className="text-danger">{this.state.errorMsg}</p>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { metamask } = state.metamask;
    const { spadToken } = state;
    return {
        metamask,
        spadToken
    }
}

export default connect(mapStateToProps)(StartSquad);