/** 步进器组件 **/
import React from 'react';
import P from 'prop-types';
import './index.scss';

class StepperLuo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        let v = Number(this.props.value) || 0;

        if (this.props.min) {
            v = Math.max(v, this.props.min);
        }
        if (this.props.max) {
            v = Math.min(v, this.props.max);
        }
        this.setState({
            value: v,
        });
    }

    UNSAFE_componentWillReceiveProps() {

    }

    onAdd() {
        let v = this.props.value + 1;
        if (this.props.min) {
            v = Math.max(v, this.props.min);
        }
        if (this.props.max) {
            v = Math.min(v, this.props.max);
        }
        this.onChange(v);
    }

    onClip() {
        let v = this.props.value - 1;
        if (this.props.min) {
            v = Math.max(v, this.props.min);
        }
        if (this.props.max) {
            v = Math.min(v, this.props.max);
        }
        this.onChange(v);

    }

    onChange(v) {
        this.props.onChange(v);
    }

    render() {
        return (
            <div className="stepper-luo">
                <div className="stepper-btn" onClick={() => this.onClip()}>
                    <div className="line-1"/>
                </div>
                <div className="stepper-value">{this.props.value}</div>
                <div className="stepper-btn" onClick={() => this.onAdd()}>
                    <div className="line-1"/>
                    <div className="line-2"/>
                </div>
            </div>
        );
    }
}

StepperLuo.propTypes = {
    min: P.number,
    max: P.number,
    value: P.number,
    onChange: P.func,
};

export default StepperLuo;
