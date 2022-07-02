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
                            <h5 className="card-title">Cases Trend</h5>
                            <LGACardMiniChart data={this.props.data.minichart_data}/>
                        </div>
                        <div className="stats-card">
                            <div className="card text-bg-danger">
                                <div className="card-body">
                                    <h5 className="card-title">Total Cases</h5>
                                    <h1 className="card-text">{this.props.data.infections_count}</h1>
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