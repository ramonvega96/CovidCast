import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import './App.css';
import LGACardMiniChart from './LGACardMiniChart';
import LGAForecastChart from './LGAForecastChart';

class LGACard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            periodsRangeValue: 5,
            forecast_chart_data: {},
            face_mask_filter: false
        };
    }

    handleShow(){
        this.setState({
            showModal: true
        });
        fetch("/api/forecast?lga="+this.props.data.lga_name.replace(" ","%20")+ "&periods=5")
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                forecast_chart_data: json
            });
        });
    }
    
    handleClose(){
        this.setState({
            showModal: false,
            periodsRangeValue: 5,
            forecast_chart_data: {},
            face_mask_filter: false
        })
    }

    handlePeriodsRangeChange(e){
        this.setState({
            periodsRangeValue: e.target.value,
            forecast_chart_data: {},
            face_mask_filter: false
        });
        fetch("/api/forecast?lga="+this.props.data.lga_name.replace(" ","%20")+ "&periods=" + e.target.value)
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                forecast_chart_data: json
            });
        });
    }

    handleMaskFilterChange(e){
        if(Object.keys(this.state.forecast_chart_data).length > 0){
            let tempData = JSON.parse(JSON.stringify(this.state.forecast_chart_data));
            for(let i = 0; i < Object.keys(this.state.forecast_chart_data.forecast).length; i++){
                const k = Object.keys(this.state.forecast_chart_data.forecast)[i]
                tempData["forecast"][k]["yhat"] = e.currentTarget.checked ? tempData["forecast"][k]["yhat"] * 0.8 : tempData["forecast"][k]["yhat"] / 0.8;
            }
            this.setState({
                face_mask_filter: e.currentTarget.checked,
                forecast_chart_data: tempData
            });
        }
    }

    render(){
        return (
            <div className="col">
                <div className="card mb-3">
                    <div className="card-header bg-transparent">
                        <h5 className="card-title">{this.props.data.lga_name}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row" style={{height:'250px'}}>
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
                        {Object.keys(this.state.forecast_chart_data).length === 0 ? <div className='loading-wait'>
                                <h2>Preparing Forecast - Please wait</h2> 
                                <Spinner animation="grow" variant="primary" />
                                <Spinner animation="grow" variant="secondary" />
                                <Spinner animation="grow" variant="success" />
                                <Spinner animation="grow" variant="warning" />
                                <Spinner animation="grow" variant="info" />
                            </div> : <div style={{height:'300px'}}> <LGAForecastChart data={this.state.forecast_chart_data}/> </div>}                        
                        <p>
                            <strong>Forecasted Periods: </strong>{this.state.periodsRangeValue}
                        </p>
                        <div>
                            <Form.Range style={{width: '100%', paddingLeft:"15px", paddingRight:"15px"}} min="5" max="30" step="5" value={this.state.periodsRangeValue} onChange={this.handlePeriodsRangeChange.bind(this)}/>
                        </div>
                        <p>
                            <strong>80% Facemask Usage Filter:</strong>
                        </p>
                        <div style={{marginBottom:"10px", textAlign:"center"}}>
                            <label className="switch">
                                <input type="checkbox" onChange={this.handleMaskFilterChange.bind(this)} checked={this.state.face_mask_filter}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div style={{overflow: 'scroll', height:'200px'}}> 
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Date</th>
                                        <th>Forecast</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.forecast_chart_data.forecast && Object.keys(this.state.forecast_chart_data.forecast).map((k, index)=>{
                                        const today = new Date();
                                        today.setDate(today.getDate() + index);
                                        const dd = String(today.getDate()).padStart(2, '0');
                                        const mm = String(today.getMonth() + 1).padStart(2, '0');
                                        const yyyy = today.getFullYear();
                                        const d = mm + '/' + dd + '/' + yyyy;
                                        return <tr key={k}>
                                            <td>{index + 1}</td>
                                            <td>{d}</td>
                                            <td>{this.state.forecast_chart_data.forecast[k]["yhat"] > 0 ? Math.round(this.state.forecast_chart_data.forecast[k]["yhat"]) : 0}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </div>
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