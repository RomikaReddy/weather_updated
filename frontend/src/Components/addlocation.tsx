import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AiFillStepBackward } from 'react-icons/ai';
import '../Assets/Styles/addlocation.css';

interface weatherdata {
  id: number;
  city: string;
}

export default function AddLocation() {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(false);
  const [searchParams] = useSearchParams();
  const [cityNameInput, setCityNameInput] = useState('');
  const [placesdata, setPlacesData] = useState<weatherdata[]>([]);
  const [temperatures, setTemperatures] = useState<{ [key: string]: number | null }>({});
  const [description, setdescription] = useState<{ [key: string]: string | null }>({});
  const [toggle,istoggle]=useState(false);
  const [edit,isedit]=useState(true);

  const checkbox=()=>
  {
    istoggle(!toggle);
  }
const editfunc=()=>
{
  istoggle(!toggle);
  isedit(!edit);
}
  // const cityName = searchParams.get('city');
  const addFunc = () => {
    setVisibility(!visibility);
  };
  const navfunc = () => {
    navigate('/');
  };
  const fetchTemperature = async (cityName: string) => {
    try {
      const api_key = 'aad849d5829fc98bd221b8069576fceb';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`
      );
      // return response.data.main.temp; 
      // Extract the temperature from the API response
      // console.log("lkjhg",response.data)
      // console.log("lkjhg",response.data.weather[0].description)
      return response.data;
      
    } catch (error) {
      console.error('Error fetching temperature:', error);
      return null; // Handle errors gracefully
    }
  };
  useEffect(() => {
    const getcitydata = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/api/getdata');
        setPlacesData(response.data);
        const temperaturePromises = response.data.map(async (placedatas: { city: string; }) => {
          const temperaturedata = await fetchTemperature(placedatas.city);
          const temperature=temperaturedata.main.temp;
          const description1=temperaturedata.weather[0].description;
          console.log("ghjk",description1)
          return { city: placedatas.city, temperature ,description1};
        });
        const temperatureData = await Promise.all(temperaturePromises);
        const temperatureMap: { [key: string]: number | null } = {};
        temperatureData.forEach((data) => {
          temperatureMap[data.city] = data.temperature;
        });

        const descriptionData = await Promise.all(temperaturePromises);
        const descriptionMap: { [key: string]: string | null } = {};
        descriptionData.forEach((data) => {
          descriptionMap[data.city] = data.description1;
          
        });
        console.log("12345",descriptionMap)
        setTemperatures(temperatureMap);
        setdescription(descriptionMap);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };
    getcitydata();
  }, []);

  const saveCity = async () => {
    console.log('city name', cityNameInput);
    try {
      const response = await axios.post('http://localhost:5000/users/api/saveCity', {
        cityName: cityNameInput,
      });
      if (response.data.message === 'Data Inserted') {
        alert('Data inserted');
      } else {
        alert('City already exists');
      }
      console.log(response.status);
      console.log('response111', response.data.message);
    } catch (error) {
      console.error('Error sending city name:', error);
    }
  };

  return (
    <div className="card-container">
      <div className="top-bar">
        <button className="back-arrow" onClick={navfunc}>
          <AiFillStepBackward />
        </button>
        <div className="city-management">city-management</div>
        <div className="addicon">
          <button className="addicon" onClick={addFunc}>
            +
          </button>
        </div>
        <div>
          {edit?(<button className='edit' onClick= {editfunc}>Edit</button>):(<button className='edit' >Select All</button>)}
          
        </div>
      </div>
      {visibility && (
        <div className="search">
          <input
            type="text"
            value={cityNameInput}
            onChange={(e) => {
              setCityNameInput(e.target.value);
            }}
          />
          <button onClick={saveCity}>Save City</button>
        </div>
      )}
      <div>
        {placesdata.map((placedatas) => (
          
          <div className='checkbox' key={placedatas.id}>
            {toggle && <input type="checkbox" value="checked"></input>}
            
            <div className="card">
              <table>
                <tr>
                <th></th>
                <th></th>
                </tr>
                
                <tr>
                  <td><span className='citynames'>{placedatas.city}</span></td>
                  <td className='temp-desc'>
                  {temperatures[placedatas.city] !== null ? (
                <div >
                  <span className='temp'>{temperatures[placedatas.city]}°C</span>
                  <p><span className='name-temp'>{description[placedatas.city]}</span></p>
                </div> 
      ) : (
        <span className='name-temp'>N/A</span>
      )}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
