import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import './App.css';
import LGACard from './LGACard';
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        items: [],
        DataisLoaded: false,
        input: ''
    };
  }

  onChangeHandler(e){
    this.setState({
      input: e.target.value,
    })
  }

  componentDidMount() {    
    fetch("/api/infections-count")
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                items: json['data'],
                DataisLoaded: true
            });
        });
  }
  
  render(){
    const { DataisLoaded, items } = this.state;
        if (!DataisLoaded) return <div className='loading-wait'>
            <h1>Loading data - Please wait</h1> 
            <Spinner animation="grow" variant="primary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="warning" />
            <Spinner animation="grow" variant="info" />
          </div> ;
    
    return (
      <div>
        <div className='lga-search-bar'>
          <input className='lga-input' placeholder='Local Government Area Name' value={this.state.input} type="text" onChange={this.onChangeHandler.bind(this)}/>
        </div>
        <div className="cards-section row row-cols-1 row-cols-md-4 g-4">
        {
          items.filter(d => this.state.input === '' || d.lga_name.toLowerCase().includes(this.state.input.toLowerCase())).map((lga) => (
            <LGACard data={lga} key={lga.lga_name}/> 
          ))
        } 
        </div>
      </div>
    );
  }
}

export default App;
