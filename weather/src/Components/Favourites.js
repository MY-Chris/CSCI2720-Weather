import React, { Component } from 'react'
import unfavourite from '../images/unfavourite.png'
import favourite from '../images/favourite.png'


export default class Favourites extends Component {
    constructor(props) {
        super(props);
        this.state = {favourites: ['London', 'Hong Kong'], unfavourite: false};

        this.unFavourite = this.unFavourite.bind(this);
      }

    unFavourite(data){
        this.setState({unfavourite: !this.state.unfavourite});
        console.log(this.state.unfavourite);
        //window.location.reload(false);
        console.log(data);
    }

    render() {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>
                        City
                    </th>
                    <th>
                        Status
                    </th>
                </tr>
                </thead>
                
                <tbody>
                {this.state.favourites.map((data) => {
                return (
                    <tr key={data.id}>
                    
                        <td>
                            {data}
                        </td>
                        <td>
                        <button onClick={ () => this.unFavourite(data)}>{this.state.unfavourite? <img src={unfavourite} width={25} /> 
                            : <img src={favourite} width={25} />}</button>
                        </td>
                    
                    </tr>
                );
                })}
            </tbody>
            </table>
        )
    }
}