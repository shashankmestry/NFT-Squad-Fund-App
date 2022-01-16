import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import { connect } from "react-redux";

const Header = (props) => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Link to="/" className="navbar-brand">
                    SQUAD.fund
                </Link>
                
                <Nav id="main-menu" className="justify-content-center">
                    <NavLink to="/start" className="nav-link">Start</NavLink>
                    <NavLink to="/view-funds" className="nav-link">View NFT Funds</NavLink>
                    <NavLink to="/contributions" className="nav-link">Your Contributions</NavLink>
                </Nav>
                <WalletConnect />
            </Container>
        </Navbar>
    );
}

function mapStateToProps(state) {
    const { metamask } = state.metamask;
    return {
        metamask
    }
}

export default connect(mapStateToProps)(Header);