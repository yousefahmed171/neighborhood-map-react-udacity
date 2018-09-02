import React, { Component } from 'react';

class ListPlaces extends Component {

    filter(query) {
        this.props.filter(query)

        this.props.selectFoods(null)
    }

    hideInfo() {
        let selected = document.getElementsByClassName('selected')

        if (selected.length !== 0) {
            selected[0].classList.remove('selected')
        }
    }

    //fatch data by fourSquare use Link https://api.foursquare.com/v2/venues/
    fetchFourSquare(id) {
        fetch(`https://api.foursquare.com/v2/venues/${id}?client_id=FTKQEIGHDP1QSIAYNT5O2PDH2E13EIABT1JT5KFA0M52CBKL&client_secret=B5IDX2VNW4YYKQN5F2T2GU1FDKN5DVQ1E4FVJRC2WE3VURDI&v=20180510`)
            .then(res => res.json())
            .then(data => this.detailsOutput(data))
            .catch(err => alert(`Unable to get data from FourSquare (${err})`))   //handel erroe fetch 
    }

    detailsOutput(details) {
        if (details.response.venue) {

            const food = details.response.venue

            const markup = `
                <img class="photo" src="${food.bestPhoto.prefix}500x300${food.bestPhoto.suffix}" alt="${food.name}">
                <div class="rating" style="color: #${food.ratingColor};">${food.rating}</div>
                <div class="address"><svg><use xlink:href="./icons.svg#marker"></use></svg>${food.location.formattedAddress[0]}</div>
                <div class="status"><svg><use xlink:href="./icons.svg#like"></use></svg>Liked by ${food.likes.count} user</div>
                <a class="link" href="${food.canonicalUrl}" target="_blank" rel="noopener noreferrer">More on FourSquare<svg><use xlink:href="./icons.svg#link"></use></svg></a>
            `
            setTimeout(() => {
                document.querySelector(`#fs${food.id} .details`).innerHTML = markup
            }, 500);
        } else {
            alert(`Unable to get details from FourSquare (${details.meta.errorDetail})`)
        }

    }

    componentDidUpdate(prevProps) {

        if (prevProps.selected === this.props.selected) {
            return false
        } else {
            this.hideInfo()

            if (this.props.selected !== null) {

                this.fetchFourSquare(this.props.selected.foodId)

                document.getElementById('fs' + this.props.selected.foodId).classList.add('selected')
            }
        }
    }


    selectFoods(food, target) {

        if (target === 'SPAN') {
            this.props.selectFoods(null)
        } else if (this.props.selected === food) {
            return false
        } else {
            this.props.selectFoods(food)
        }
    }


    render() {

        return (
            <section className="sidebar">
                <header className="header">
                    <div className="brand">
                        <h1>Neighborhood Map</h1>
                    </div>
                </header>

                <input
                    type="text"
                    className="filter"
                    placeholder="search"
                    aria-label="Filter"
                    onChange={e => this.filter(e.target.value)}
                />

                <ol className="places">
                    {this.props.filteredFoods.map(food => (
                        <li
                            key={food.foodId}
                            className="place"
                            role="button"
                            tabIndex="0"
                            id={`fs${food.foodId}`}
                            onClick={(e) => this.selectFoods(food, e.target.tagName)}
                            onKeyPress={(e) => this.selectFoods(food, e.target.tagName)}
                        >

                            <h4 className="name">{food.name}</h4>
                            <span className="close" aria-label="Close" role="button" tabIndex="0" >X</span>
                            <div className="details">Loading details...</div>

                        </li>
                    ))}
                </ol>

            </section>
        );
    }
}

export default ListPlaces;