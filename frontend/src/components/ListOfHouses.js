import { Routes, Route, useParams } from 'react-router-dom';
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import {useState} from "react";

const houseUrls = [];
// TODO: initialize by retrieving urls from API
houseUrls[0] = 'https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg' ;
houseUrls[1] = 'https://s42814.pcdn.co/wp-content/uploads/2020/09/iStock_185930591-scaled.jpg.webp'

const imagesArr = houseUrls.map((url, index) => ({
    src: url,
    width: 320,
    height: 174,
    isSelected: false,
    caption: `House ${index + 1}` // use houseDesc[i]
}));

function ListOfHouses() {

    // { } must be around city bc useParams() returns an object, not a string!
    const {city} = useParams()
    console.log(city)
    console.log("params: " + city)


    // const getHouses = () => {
    //     console.log('inside getHouses')
    //     const url = 'https://www.zillow.com/' + city + '-ga'
    //     const options = {
    //         method: 'GET',
    //         url: 'https://zillow-com1.p.rapidapi.com/searchByUrl',
    //         params: {
    //             url: url
    //         },
    //         headers: {
    //             'X-RapidAPI-Key': 'API-KEY',
    //             'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
    //         }
    //     };
    //     console.log(url)
    //
    //
    //     axios.request(options).then(function (response) {
    //         console.log(response.data);
    //     }).catch(function (error) {
    //         console.error(error);
    //     });
    // }
    // getHouses()

    const [images, setImages] = useState(imagesArr);
    const hasSelected = images.some((image) => image.isSelected);

    // TODO: use ML to output predicted price of the selected house
    const handleSelect = (index) => {
        console.log('index: ' + index.toString())
        const newImages = [...images];
        newImages[index] = {
            ...newImages[index],
            isSelected: !newImages[index].isSelected
        };
        setImages(newImages);
    };

    const clearAll = () => {
        const nextImages = images.map((image) => ({
            ...image,
            isSelected: false
        }));
        setImages(nextImages);
    };

    return (
        <div>
            <div className="clearAll">
                <button onClick={clearAll}>
                    {hasSelected ? "Clear selection" : "Select all"}
                </button>
            </div>
            <Gallery images={images} onSelect={handleSelect} />
        </div>
    );
};


export default ListOfHouses