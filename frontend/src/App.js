import "@aws-amplify/ui-react/styles.css";
import {
    withAuthenticator,
    Button,
    Heading,
    Image,
    View,
    Card,
} from "@aws-amplify/ui-react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import HomePage from './components/HomePage'
import ListOfHouses from './components/ListOfHouses'


function App({ signOut }) {
    var city = ''
    const saveCityDataHandler = (enteredCityData) => {
        city = enteredCityData
        console.log("City data from HomePage -> App: " + city)
    }
    return (
        <View className="App">
            <Routes>
                <Route path="/" element={<HomePage cityData={saveCityDataHandler} />} />
                <Route path="/ListOfHouses/:city" element={<ListOfHouses />} />
            </Routes>
            <Button onClick={signOut}>Sign Out</Button>
        </View>

    );
}

export default withAuthenticator(App);
