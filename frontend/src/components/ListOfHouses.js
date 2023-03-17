import { Routes, Route, useParams } from 'react-router-dom';
import axios from "axios";

function ListOfHouses() {
    // { } must be around city bc useParams() returns an object, not a string!
    const {city} = useParams()
    const cityStr = JSON.stringify(city)
    console.log("params: " + cityStr)

    const getHouses = () => {
        const options = {
            method: 'GET',
            url: 'https://zillow-com1.p.rapidapi.com/searchByUrl',
            params: {
                url: 'https://www.zillow.com/' + cityStr
            },
            headers: {
                'X-RapidAPI-Key': '02639e1c5cmsh7ab396edd816371p1d73b7jsn7e8eebed8bfa',
                'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
        };


        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
    getHouses()
    return (<div>{'List of houses is to be returned here for ' + city}
    </div>)

}

export default ListOfHouses