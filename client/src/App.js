import React from "react";
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
    fetch(process.env.REACT_APP_SERVER_URL + "/api/infections-count")
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
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div> ;
    
    return (
      <div>
        <div className='lga-search-bar'>
          <input className='lga-input' placeholder='LGA name' value={this.state.input} type="text" onChange={this.onChangeHandler.bind(this)}/>
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
