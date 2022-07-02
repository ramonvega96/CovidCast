import './App.css';
import LGACard from './LGACard';
import Data from './mock-data.json'
import LGACardMiniChart from './LGACardMiniChart';


function App() {
  return (
    <div>
      <div className='lga-search-bar'>
        <input className='lga-input' placeholder='LGA name'/>
      </div>
      <div className="cards-section row row-cols-1 row-cols-md-4 g-4">
      {
        Data.map((lga) => (
          <LGACard data={lga} key={lga.lga_name}/> 
        ))
      }       
      </div>
    </div>
  );
}

export default App;
