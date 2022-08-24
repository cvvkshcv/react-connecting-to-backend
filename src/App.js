import { useState } from 'react';
import './App.css';
import axios from 'axios';
import allCountries from './json/county-abbr.json';


function App() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);

  const search = (e) => {
    e.preventDefault();
    setLoading(true);
    if (name === '') return;
    axios.get('https://api.nationalize.io/?name=' + name)
      .then(res => {
        const obj = {};
        const countries = res.data.country;

        res.data.country.forEach((c, i) => { // 3
          obj[c.country_id] = i;
        });


        allCountries.forEach(c => { // 245
          if (obj[c.abbreviation] >= 0) {
            countries[obj[c.abbreviation]].fullName = c.country;
          }
        });

        setResponse(countries);
        setLoading(false);
      })
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card border-0" style={{width: '25rem'}}>

        {/* Header start */}
        <nav className="navbar navbar-dark bg-dark rounded">
          <div className="container-fluid">
            <form className="d-flex w-100" onSubmit={search}>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value === '') {
                    setResponse(null);
                  }
                }}
                type="search"
                aria-label="Search"
                className="form-control me-2"
                placeholder="Enter your name..."
              />
              <button className="btn btn-outline-light" type="submit">Predict</button>
            </form>
          </div>
        </nav>
        {/* Header end */}

        {/* User image */}
        {
          (response === null) ? 
              <img
              src="https://pluspng.com/img-png/png-user-icon-person-icon-png-people-person-user-icon-2240.png"
              className="card-img-top w-50 mx-auto p-3" alt="User profile"
            /> :
            <img
              src="https://media4.giphy.com/media/VDMaWsMMU8yEryB1fQ/giphy.gif"
              className="card-img-top w-50 mx-auto p-3 rounded-circle" alt="User profile"
            />
        }

        {/* Card body start */}
        <div className="card-body">
          <h5 className="card-title">Your name is {name}</h5>

          <ul className="list-group">
            {
              loading ?
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
                :
                (
                  (response?.length === 0) ?
                    <div className="alert alert-danger text-center" role="alert">
                      No result found
                    </div>
                  :
                  (
                    response?.map(country => {
                      return (
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{ country.fullName }</div>
                          </div>
                          <span className="badge bg-primary rounded-pill">{ (country.probability * 100).toFixed(2) }%</span>
                        </li>
                      )
                    })
                  )
                )
            }
          </ul>
      
        </div>
        {/* Card body end */}

      </div>
    </div>
  );
}

export default App;
