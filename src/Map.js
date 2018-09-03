import React, { Component } from 'react'
import Styles from "./Style"
import scriptLoader from 'react-async-script-loader'

class Map extends Component {

    state = {
        map: null,
        bounds: null,
        markers: [],
        mapReady: false,
        google: null
    }

    //start map.google and handel error 
    componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
        // Check if script is loaded and if map is defined
        if (isScriptLoaded && !this.state.mapReady) {
            if (isScriptLoadSucceed) {
                // create map
                var map = new window.google.maps.Map(document.getElementById('map'), {
                    zoom: 11,
                    center: { lat: 30.063294, lng: 31.337169 },
                    styles: Styles.mapStyles,
                    disableDefaultUI: true
                });

                var bounds = new window.google.maps.LatLngBounds();

                this.setState({ map: map, bounds: bounds, google: window.google.maps, mapReady: true  })

            } else if (!this.state.mapReady) {
                console.log("Map did not load");
                alert("Unable to load Google Maps");
            } 
        }
    }

    //  set Markers  
    updateMarkers = function (foods) {

        this.state.markers.map(marker => marker.setMap(null))
        // eslint-disable-next-line
        this.state.markers = []

        let marker;

        foods.forEach(food => {
            marker = new this.state.google.Marker({
                position: food.location,
                animation: this.state.google.Animation.DROP,
                map: this.state.map,
                foodId: food.foodId
            })

            marker.addListener('click', () => this.selectFoods(food))

            this.state.bounds.extend(food.location)

            this.state.markers.push(marker)
        })

        this.state.map.fitBounds(this.state.bounds)
        this.state.map.setCenter(this.state.bounds.getCenter())

    }

    selectFoods(food) {
        if (food !== this.props.selected) this.props.selectFoods(food)
    }

    
    recenterMap = function (location) {
        this.state.map.setZoom(15)
        this.state.map.setCenter(location)
    }

    
    componentDidUpdate(prevProps, prevState) {

        if (this.state.google !== prevState.google) {
            this.updateMarkers(this.props.filteredFoods)
        }

        if (this.state.google !== null && this.props.filteredFoods.length !== prevProps.filteredFoods.length) {
            this.updateMarkers(this.props.filteredFoods)
        }

        this.state.markers.map(marker => marker.setAnimation(null))

        if (this.props.selected !== null && this.state.markers) {

            const activeMarkerIndex = this.state.markers.map(marker => marker.foodId).indexOf(this.props.selected.foodId)
            this.state.markers[activeMarkerIndex].setAnimation(this.state.google.Animation.BOUNCE)

            this.recenterMap(this.props.selected.location)
        } else if (this.state.google !== null && this.props.selected === null) {

            this.state.map.fitBounds(this.state.bounds)
            this.state.map.setCenter(this.state.bounds.getCenter())
        }

    }

    render() {


        return (
            <div id='map' role="application" aria-roledescription="map for foods list">
                Loading map...
            </div>
        )
    }
}

export default scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyDn2s334QIw7M-gKe44GSBZRrAGzTHmpyI')(Map)