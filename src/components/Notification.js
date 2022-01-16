import { Component } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { connect } from "react-redux";
import { CLOSE_NOTIFICATION } from "../actions/types";

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }

        this.handleClose = this.handleClose.bind(this);
        this.openNotification = this.openNotification.bind(this);
    }

    openNotification() {
        this.setState({show: true});
    }

    handleClose(e) {
        e.preventDefault();
        this.props.dispatch({
            type: CLOSE_NOTIFICATION,
            payload: null,
        });
    }

    render() {
        const { notification } = this.props.message;
        console.log(notification);
        return (
            <ToastContainer className="p-3" position="top-end" style={{marginTop: "35px", position: "fixed !important"}}>
                <Toast show={notification.show} onClose={this.handleClose}>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{notification.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        );
    }
}

function mapStateToProps(state) {
    const { message } = state;
    return {
        message
    }
}

export default connect(mapStateToProps)(Notification);