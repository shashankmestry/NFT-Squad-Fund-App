import { faUnlink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import { Badge, Button, Nav, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import { connectWallet, loadWallet } from "../actions/wallet";

class WalletConnect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        }

        this.handleConnect = this.handleConnect.bind(this);
    }

    handleConnect(e) {
        e.preventDefault();
        
        this.setState({
            loading: true,
        });
        this.props.dispatch(
            connectWallet()
        )
        .then(() => {
            this.setState({
                loading: false,
            });
        })
        .catch(() => {
            this.setState({
                loading: false,
            });
        });
    }

    loadCurrentWallet() {
        this.setState({
            loading: true,
        });
        this.props.dispatch(
            loadWallet()
        )
        .then(() => {
            this.setState({
                loading: false,
            });
        })
        .catch(() => {
            this.setState({
                loading: false,
            });
        });
    }

    addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                this.loadCurrentWallet();
            });
            window.ethereum.on("chainChanged", (chainId) => {
                this.loadCurrentWallet();
            });
        }
    }

    componentDidMount() {
        this.loadCurrentWallet();
        this.addWalletListener();
    }

    render() {
        const {metamask} = this.props;
        return (
            <Nav id="nav-wallet">
            {
                metamask.address !== "" ? 
                <>
                <Badge pill bg="light" className={"network "+metamask.network}>{metamask.network}</Badge>
                {
                    metamask.network === 'Rinkeby' ?
                    <>
                        <Badge pill bg="light">{
                            String(metamask.address).substring(0, 6) +
                            "..." +
                            String(metamask.address).substring(38)
                        }</Badge>
                    </> :
                    <>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>Connect to Rinkeby Network</Tooltip>}
                        >
                            <Badge pill bg="danger" text="light">
                                <FontAwesomeIcon icon={faUnlink} /> { " " }
                                Wrong Network
                            </Badge>
                        </OverlayTrigger>
                    </>
                }
                    
                </> :
                <>
                    {
                        this.state.loading ? 
                        <Button className="rounded" disabled>Connecting Wallet <Spinner animation="border" size="sm" /></Button> :
                        <Button className="rounded" onClick={this.handleConnect}>Connect Wallet</Button>
                    }
                </>
            }
            
            </Nav>
        );
    }
}

function mapStateToProps(state) {
    const { metamask } = state.metamask;
    return {
        metamask
    }
}

export default connect(mapStateToProps)(WalletConnect);