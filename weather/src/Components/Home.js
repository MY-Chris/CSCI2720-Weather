import React, { Component } from "react";


export default class Home extends Component {

    componentDidMount() {

        let theme = "light";
        console.log(userid);
        let userid = sessionStorage.getItem('userid');
        console.log("http://localhost:80/users/theme/" + userid)
        
        if(userid != undefined){
            userid = userid.toString().substring(1, 25);
            (async () => {
            const data = await fetch(
                "http://localhost:80/users/theme/" + userid// GET theme path 
            )
            .then((res) => res.json())
            .then((data) => data);
            console.log(data);
            theme = data.preference;
        })();
        
        document.getElementById("header").classList.remove("dark");
        document.getElementById("header").classList.remove("light");
        document.getElementById("header").classList.add(theme);
        document.getElementById("App").classList.remove("dark");
        document.getElementById("App").classList.remove("light");
        document.getElementById("App").classList.add(theme);}
      
      }
    

   render(){
        
       return (
           <div>
               <b id="header" className="header" style={{color: "#a0ccee"}}>Weathering With Me</b>
                <div style={{display: "flex"}}>
                <div id = "graphql" style={{color: "#a0ccee", textAlign: "left", margin: "auto"}}>
                    <h4> Weathering With Me provides a <b>Graphql API</b> at endpoint <b>/graphql</b> </h4>
                    <p>These queries are availiable:<br></br></p>
                    <p><b>locations</b></p>
                    <p>List all location details (including DB data, API data, and user comments)</p>
                    <p><b>location(locName: &lt;your_location_name&gt;)</b></p>
                    <p>Single location with details (including DB data, API data, and user comments)</p>
                    <p>These fields are availiable:<br></br></p>
                    <p>locName <br></br>  comments (commentUser commentLoc content) <br></br>latitude longitude<br></br> temp_c wind_kph wind_dir humidity precip_mm vis_km</p>
                    
                    
                </div>
                </div>
                
           </div>
           
       )
   }


}