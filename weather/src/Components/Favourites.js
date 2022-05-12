import React, { Component } from 'react'
import unfavourite from '../images/unfavourite.png'
import favourite from '../images/favourite.png'


export default class Favourites extends Component {
    constructor(props) {
        super(props);
        this.state = {favourites: ['London', 'Hong Kong']};
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
                    <tr key={data}>
                    
                        <td>
                            <a href = {`http://localhost:3000/info/${data}`}>
                              {data}
                            </a>
                        </td>
                        <td>
                        <button>{<img src={favourite} width={25} />}</button>
                        </td>
                    
                    </tr>
                );
                })}
            </tbody>
            </table>
        )
    }
}