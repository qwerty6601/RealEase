import { Routes, Route, useParams } from 'react-router-dom';
import axios from "axios";

function ListOfHouses() {
    // { } must be around city bc useParams() returns an object, not a string!
    const {city} = useParams()
    const cityStr = JSON.stringify(city)
    console.log(city)
    console.log("params: " + cityStr)

    const getHouses = () => {
        console.log('inside getHouses')
        const url = 'https://www.zillow.com/' + city + '-ga'
        const options = {
            method: 'GET',
            url: 'https://zillow-com1.p.rapidapi.com/searchByUrl',
            params: {
                url: url
            },
            headers: {
                'X-RapidAPI-Key': 'API-KEY',
                'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
        };
        console.log(url)


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