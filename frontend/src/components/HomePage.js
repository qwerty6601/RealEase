import ListOfHouses from "./ListOfHouses";
import {Link, Routes, useNavigate} from 'react-router-dom';
import './HomePage.css'
import logo from "../img/logo.png";

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

    return (<div className="homepage">
                <div className="header">
                    <img className="logo" src={logo} alt="logo" />
                    <button className="loginBtn">LOGIN</button>
                </div>
                <div className="home-info">
                    <p className="home-title">Invest smarter, not harder</p>
                    <p className="home-description">Access a wealth of data and analysis to identify the best investment opportunities for you,
                        based on your goals and risk tolerance. Build a profitable portfolio with confidence,
                        no matter your level of experience.</p>
                </div>
                {/*<p className="search">Search: </p> <input type="text"/>*/}
                {/*<button className="enterBtn" onClick={(event) => {*/}
                {/*    getSearchResults(event);*/}
                {/*    goToListOfHouses();*/}
                {/*}}>Enter</button>*/}
    </div>)
}

export default HomePage;
