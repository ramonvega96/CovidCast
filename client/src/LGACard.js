import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './App.css';
import LGACardMiniChart from './LGACardMiniChart';
import LGAForecastChart from './LGAForecastChart';

class LGACard extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            showModal: false,
            periodsRangeValue: 5,
            forecast_chart_data: {}
        };
    }

    handleShow(){
        fetch("/api/forecast?lga="+this.props.data.lga_name.replace(" ","%20")+ "&periods=5")
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                showModal: true,
                forecast_chart_data: json
            });
        });
    }
    
    handleClose(){
        this.setState({
            showModal: false,
            periodsRangeValue: 5,
            forecast_chart_data: {}
        })
    }

    handlePeriodsRangeChange(e){
        this.setState({
            periodsRangeValue: e.target.value
        });

        fetch("/api/forecast?lga="+this.props.data.lga_name.replace(" ","%20")+ "&periods=" + e.target.value)
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                forecast_chart_data: json
            });
        });
    }

    render(){
        return (
            <div className="col">
                <div className="card mb-3">
                    <div className="card-header bg-transparent">
                        <h5 className="card-title">{this.props.data.lga_name}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <LGACardMiniChart data={this.props.data.mini_chart_data}/>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="stats-card">
                                    <div className="card text-bg-danger">
                                        <div className="card-body">
                                            <h1 className="stats-card-content">{
                                                this.props.data.infections_count
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </h1>
                                            <h5 className="stats-card-title">Total Cases Count</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6" onClick={() => this.handleShow()}>
                                <div className="stats-card forecast-button-card">
                                    <div className="card text-bg-info">
                                        <div className="card-body">
                                            <img src={require('./img/coding.png')} alt='CovidCast Logo'/>
                                            <h5 className="stats-card-title">Forecast</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                    </div>
                </div>
                <Modal show={this.state.showModal} onHide={() => this.handleClose()} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.data.lga_name + ' Covid Cases Forecast'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LGAForecastChart data={this.state.forecast_chart_data}/>
                        Forecasted Periods: {this.state.periodsRangeValue}
                        <Form.Range min="5" max="15" step="5" value={this.state.periodsRangeValue} onChange={this.handlePeriodsRangeChange.bind(this)}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
    
}

export default LGACard;