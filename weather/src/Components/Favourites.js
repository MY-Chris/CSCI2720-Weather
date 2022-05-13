import React, { Component } from 'react'
import unfavourite from '../images/unfavourite.png'
import favourite from '../images/favourite.png'


export default class Favourites extends Component {
    constructor(props) {
        super(props);
        this.state = {favourites: ['London', 'Hong Kong']};
      }

      componentDidMount() {
        let theme = "dark";
        let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
        (async () => {
        const data = await fetch(
            "http://localhost:3001/users/theme/" + userid// GET theme path 
        )
        .then((res) => res.json())
        .then((data) => data);
        console.log(data);
        this.setState({theme: data.preference});
        theme = data.preference;
        document.getElementById("table").classList.remove("dark");
        document.getElementById("table").classList.remove("light");
        document.getElementById("table").classList.add(theme);
        //console.log(document.getElementById("App").classList);
        document.getElementById("App").classList.remove("dark");
        document.getElementById("App").classList.remove("light");
        document.getElementById("App").classList.add(theme);
  })();

  //console.log(document.getElementById("App").classList);


        (async () => {
          const data = await fetch(
            "http://localhost:3001/users/" + userid + "/favorites"
          )
          .then(res => res.json())
        .then(data => data);
          console.log(data);
          this.setState({favourites: data});
        })();
      }


    render() {
        return (
            <div className="table_container">
            <br></br>
            <h3>My Favourites</h3>
            <table className="table" id="table">
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
            </div>
        )
    }
}