import ListOfHouses from "./ListOfHouses";
import {Link, Routes, useNavigate} from 'react-router-dom';
import './HomePage.css'

// props here is used to send city info back to parent (not to receive info from parent)
function HomePage(props){
    var city = ''
    const getSearchResults = (event) => {
        city = event.target.previousSibling.value
        console.log("city: " + city)
        props.cityData(city)
    }

    const navigate = useNavigate();

    const goToListOfHouses = () => {
        console.log("inside goToListOfHouses")
        navigate("./ListOfHouses/" + city);
        // window.location.href = '/ListOfHouses/' + city;
    };

    return (<div>
            <h2 className="homepage">
                HomePage!
                <p className="search">Search: </p> <input type="text"/>
                <button className="enterBtn"
                         onClick={(event) => {
                    getSearchResults(event);
                    goToListOfHouses();
                }}>
                    Enter
                </button>

            </h2>
    </div>)
}

export default HomePage;