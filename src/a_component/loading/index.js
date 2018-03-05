import React from "react";
import "./index.scss";
import ImgLoading from "../../assets/loading.gif";
export default class Footer extends React.PureComponent {
    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="loading">
                <img src={ImgLoading} />
                <div>请稍后…</div>
            </div>
        );
    }
}