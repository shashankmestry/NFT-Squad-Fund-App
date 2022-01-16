import { connect } from "react-redux";

const Home = (props) => {
   
    return (
        <div className="mt-5">
            <h2 className="text-center text-light">FUND TOGETHER</h2>
        </div>
    );
}

function mapStateToProps(state) {
    const { metamask } = state.metamask;
    return {
        metamask
    }
}

export default connect(mapStateToProps)(Home);