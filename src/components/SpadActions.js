import { useEffect, useState } from "react";
import { Button, FormControl, InputGroup, Modal, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { activateSpad, claimInvestment, contribute } from "../actions/spad";
import { NOTIFICATION_SUBMITTED, TRANSACTION_SUBMITTED, TWITTER_HANDLE_VERIFIED } from "../actions/types";
import spadService, { spadActionsContract } from "../services/spad.service";
import PassKeyModal from "./PassKeyModal";
import TwitterVerification from "./TwitterVerification";

const SpadActions = (props) => {
    const [activating, setActivating] = useState(false);
    const [isContribute, setIsContribute] = useState(false);
    const [contributing, setContributing] = useState(false);

    const [activationPitch, setActivationPitch] = useState("");
    const [activationModalShow, setActivationModalShow] = useState(false);

    const [contribution, setContribution] = useState("");
    const [contributionAmount, setAmount] = useState("");

    const [passKey, setPassKey] = useState("");
    const [passKeyModalShow, setPassKeyModalShow] = useState(false);

    const [isClaimed, setIsClaimed] = useState(false);
    const [claimProcessing, setClaimProcessing] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const handleActivate = async() => {
        let error = showWarningModal();
        if(error) {
            return;
        }
        if(props.spad.isPrivate) {
            setActivationModalShow(true);
        } else {
            setActivating(true);
            props.dispatch(
                activateSpad(props.metamask.address, props.spadAddress, props.spad.targetView*0.1, activationPitch, props.twitter.handle)
            )
            .then((response) => {
                if(response !== 200) {
                    setActivating(false);
                }
            })
            .catch(() => {
                setActivating(false);
            });
        }
    }

    const handlePitchActivation = async() => {
        let error = showWarningModal();
        if(error) {
            return;
        }
        setActivating(true);
        if(activationPitch !== "") {
            setActivationModalShow(false);
            props.dispatch(
                activateSpad(props.metamask.address, props.spadAddress, props.spad.targetView*0.1, activationPitch)
            )
            .then((response) => {
                if(response !== 200) {
                    setActivating(false);
                }
            })
            .catch(() => {
                setActivating(false);
            });
        } else {
            setActivating(false);
        }
    }

    const handleContribute = async() => {
        let error = showWarningModal();
        if(error) {
            return;
        }
        let amount = parseFloat(contributionAmount);
        if(!isNaN(amount)) {
            let totalContribution = amount + contribution;
            if(totalContribution >= props.spad.minInvestmentView && totalContribution <= props.spad.maxInvestmentView) {
                
                if(props.spad.isPrivate) {
                    setPassKeyModalShow(true);
                } else {
                    setContributing(true);
                    props.dispatch(
                        contribute(props.metamask.address, props.spadAddress, amount, passKey)
                    )
                    .then((response) => {
                        if(response !== 200) {
                            setContributing(false);
                        }
                    })
                    .catch(() => {
                        setContributing(false);
                    });
                }
            } else {
                setErrorMsg('Contribution must be inside the allowed Range');
                setContributing(false);
            }
        } else {
            setErrorMsg('Please enter valid contribution amount');
            setContributing(false);
        }
    }

    const handlePassKeyContribute = async() => {
        let error = showWarningModal();
        if(error) {
            return;
        }
        setPassKeyModalShow(false);
        setContributing(true);
        props.dispatch(
            contribute(props.metamask.address, props.spadAddress, contributionAmount, passKey)
        )
        .then((response) => {
            if(response !== 200) {
                setContributing(false);
            }
        })
        .catch(() => {
            setContributing(false);
        });
    }

    const handleClaim = async () => {
        let error = showWarningModal();
        if(error) {
            return;
        }
        setErrorMsg("");
        setClaimProcessing(true);
        props.dispatch(
            claimInvestment(props.metamask.address, props.spadAddress)
        )
        .then((response) => {
            if(response !== 200) {
                setClaimProcessing(false);;
            }
        })
        .catch(() => {
            setClaimProcessing(false);
        });
    }

    const addContractListener = () => {
        spadActionsContract.events.SpadActivated({
            filter: {spadAddress: props.spadAddress}
        }, (error, data) => {
            if(error) {
                props.dispatch({
                    type: NOTIFICATION_SUBMITTED,
                    payload: {
                        show: true,
                        message: "SPAD activation failed.",
                        success: false
                    },
                });
            } else {
                props.dispatch({
                    type: NOTIFICATION_SUBMITTED,
                    payload: {
                        show: true,
                        message: "SPAD activation successful.",
                        success: true
                    },
                });
                props.loadSpad();
                setActivating(false);
            }
        });

        spadActionsContract.events.Contributed({
            filter: {spadAddress: props.spadAddress, contributor: props.metamask.address}
        }, (error, data) => {
            if(error) {
                setContributing(false);
                props.dispatch({
                    type: NOTIFICATION_SUBMITTED,
                    payload: {
                        show: true,
                        message: "Problem with contributing for SPAD",
                        success: false
                    },
                });
            } else {
                props.dispatch({
                    type: NOTIFICATION_SUBMITTED,
                    payload: {
                        show: true,
                        message: "Contributed for SPAD",
                        success: true
                    },
                });
                props.loadSpad();
                fetchData();
                setContributing(false);
            }
        });

        spadActionsContract.events.InvestmentClaimed({
            filter: {spadAddress: props.spadAddress, contributor: props.metamask.address}
        }, (error, data) => {
            if(error) {
                props.dispatch({
                    type: NOTIFICATION_SUBMITTED,
                    payload: {
                        show: true,
                        message: "Problem with claiming investment for SPAD",
                        success: false
                    },
                });
                setClaimProcessing(false);
            } else {
                props.dispatch({
                    type: NOTIFICATION_SUBMITTED,
                    payload: {
                        show: true,
                        message: "Claimed investment for SPAD",
                        success: true
                    },
                });
                props.loadSpad();
                fetchData();
                setClaimProcessing(false);
            }
        });
    }

    function showWarningModal() {
        let data = {
            show: true,
            message: "",
            code: 1000
        }
        let error = false;
        if(props.metamask.address === "") {
            data.message = "Please connect MetaMask"
            error = true;
        } else if(props.metamask.network !== 'Ropsten') {
            data.message = "Please switch to Ropsten Network"
            error = true;
        }
        if(error) {
            props.dispatch({
                type: TRANSACTION_SUBMITTED,
                payload: data
            });
            return true;
        } else {
            return false; 
        }
    }

    async function fetchData() {
        const contri = await spadService.getContribution(props.metamask.address, props.spadAddress);
        setContribution(contri);
        if(props.spad.status === 5 && contri > 0) {
            const isClaimed = await spadService.isInvestmentClaimed(props.metamask.address, props.spadAddress);
            setIsClaimed(isClaimed);
        }
        const handle = await spadService.getTwitterHandle(props.metamask.address);
        props.dispatch({
            type: TWITTER_HANDLE_VERIFIED,
            payload: handle,
        });
    }

    useEffect(() => {
        if(props.metamask.address !== '') {
            fetchData();
            addContractListener();
        }
    }, [props.metamask]);

    return(
        <div className="spad-actions text-center">
            {
                props.spad.status === "1" && props.spad.spadInitiator.toLowerCase() === props.metamask.address ? 
                <div>
                    {
                        activating ? 
                        <Button className="rounded" disabled>ACTIVATING <Spinner animation="border" size="sm" /></Button> : 
                        <>
                        { 
                            props.twitter.handle === "" ? 
                            <>
                                <TwitterVerification />
                                <p className="mt-3 mb-3">OR</p>
                                <span className="text-primary" style={{cursor: "pointer"}} onClick={handleActivate}>Activate without Twitter Verificaton</span>
                            </> :
                            <>
                            <Button className="rounded" onClick={handleActivate}>ACTIVATE</Button>
                            </>
                        }
                            
                        </>
                        
                    }
                    {
                        props.spad.isPrivate &&
                        <Modal show={activationModalShow} centered={true} size="md" onHide={() => setActivationModalShow(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Activation Pitch</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <label>Enter Your Activation Pitch for the SPAD</label>
                                <FormControl
                                    placeholder="Your Activation Pitch"
                                    as="textarea"
                                    rows={5}
                                    value={activationPitch}
                                    onChange={(e) => setActivationPitch(e.target.value)}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setActivationModalShow(false)}>
                                    Cancel
                                </Button>
                                {
                                    activationPitch ? 
                                    <Button variant="primary" onClick={handlePitchActivation}>
                                        Proceed
                                    </Button> :
                                    <Button variant="primary" disabled>
                                        Proceed
                                    </Button>
                                }
                                
                            </Modal.Footer>
                        </Modal>
                    }
                </div> :
                <div>
                    {
                        contribution > 0 &&
                        <>
                            <div className="spad-label">YOUR CONTRIBUTION</div>
                            <p className="text-muted">{contribution} {" "} {props.spad.investmentCurrency}</p>
                        </>
                    }
                    {
                        props.spad.status === "2" ? 
                        <div>
                            {
                                isContribute ? 
                                <div>
                                    {
                                        contributing ?
                                        <div>
                                            <InputGroup>
                                                <FormControl type="number" min="1" placeholder="Enter Amount" 
                                                    value={contributionAmount} readOnly
                                                />
                                                <Button variant="primary rounded" disabled>
                                                    CONTRIBUTING { ' ' } <Spinner animation="border" size="sm" />
                                                </Button>
                                            </InputGroup>
                                        </div> :
                                        <div>
                                            <InputGroup>
                                                <FormControl type="number" min="1" placeholder="Enter Amount" 
                                                    onChange={(e) => {setErrorMsg(""); setAmount(e.target.value);}} 
                                                    value={contributionAmount}
                                                />
                                                <Button variant="primary rounded" onClick={handleContribute}>CONTRIBUTE</Button>
                                            </InputGroup>
                                            <div className="mt-1 text-end">
                                                <span style={{cursor: "pointer"}} onClick={() => setIsContribute(false)}>Cancel</span>
                                            </div>
                                        </div>
                                    }
                                    {
                                        props.spad.isPrivate &&
                                        <PassKeyModal show={passKeyModalShow} setShow={setPassKeyModalShow} passKey={passKey} setPassKey={setPassKey} handleAction={handlePassKeyContribute} />
                                    }
                                </div> :
                                <div>
                                    {
                                        (contribution < props.spad.maxInvestmentView) &&
                                        <Button variant="primary" className="rounded" onClick={() => setIsContribute(true)}>CONTRIBUTE</Button>
                                    }
                                </div>
                            }
                        </div> :
                        <div>{
                            props.spad.status === "4" ?
                            <div>
                                {
                                    contribution === 0 &&
                                    <Link to={"/pitch-spad/"+props.spadAddress} className="btn btn-primary rounded">PITCH</Link>
                                }
                            </div> : <div>
                            { props.spad.status === "5" && <div>
                                <div className="spad-label">ACQUIRED BY</div>
                                <p className="text-muted"><small>{props.spad.acquiredBy}</small></p>
                            </div> }
                            {
                                contribution > 0 &&
                                <div>
                                {
                                    isClaimed ?
                                    <p className="text-success">You have claimed your tokens</p> :
                                    <div>
                                    {
                                        claimProcessing ?
                                        <Button variant="primary" className="rounded" disabled>
                                            Claiming Tokens { ' ' } <Spinner animation="border" size="sm" />
                                        </Button> :
                                        <Button variant="primary" className="rounded" onClick={handleClaim}>
                                            Claim Tokens
                                        </Button>   
                                    }
                                    </div>
                                }</div>
                            }
                            </div> 
                        }</div>
                    }
                </div> 
            }
            { errorMsg && 
            <p className="text-danger">{errorMsg}</p>
            }
        </div>
    );
}

function mapStateToProps(state) {
    const { metamask } = state.metamask;
    const { twitter } = state
    return {
        metamask,
        twitter
    }
}

export default connect(mapStateToProps)(SpadActions);