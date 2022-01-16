import { faCheckCircle, faExclamationCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { CLOSE_TRANSACTION_MODAL } from "../actions/types";

class TransactionModal extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(e) {
        e.preventDefault();
        this.props.dispatch({
            type: CLOSE_TRANSACTION_MODAL,
            payload: null,
        });
    }

    render() {
        const { transaction } = this.props.message;
        return (
            <Modal
                show={transaction.show}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                
                <Modal.Body className="p-5 text-center">
                    {
                        transaction.code === 200 ? 
                        <div>
                            <FontAwesomeIcon icon={faCheckCircle} style={{fontSize: "35px"}} className="text-success" />
                            <h3 className="mt-3">Your transaction has been sent...</h3>
                            <p>See on etherscan: <a href={`https://ropsten.etherscan.io/tx/${transaction.message}`} rel="noreferrer" target="_blank"> here </a></p>
                        </div> :
                        <>
                        {
                            transaction.code === 1000 ?
                            <div>
                                <FontAwesomeIcon icon={faExclamationCircle} style={{fontSize: "35px"}} className="text-warning" />
                                <h4 className="mt-3 mb-3">{transaction.message}</h4>
                            </div> :
                            <div>
                                <FontAwesomeIcon icon={faTimesCircle} style={{fontSize: "35px"}} className="text-danger" />
                                <h3 className="mt-3">Your transaction has been cancelled</h3>
                                <p>{transaction.message}</p>
                            </div>
                        }
                        
                        </>
                    }
                    
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Body>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    const { message } = state;
    return {
        message
    }
}

export default connect(mapStateToProps)(TransactionModal);