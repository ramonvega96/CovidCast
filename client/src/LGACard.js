import React from 'react';
import './App.css';
import LGACardMiniChart from './LGACardMiniChart';

class LGACard extends React.Component {

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
                                            <h5 className="stats-card-title">Total Cases</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
            </div>
        );
    }
    
}

export default LGACard;