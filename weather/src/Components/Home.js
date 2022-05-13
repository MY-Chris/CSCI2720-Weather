import React, { Component } from "react";


export default class Home extends Component {

    componentDidMount() {

        let theme = "light";
        (async () => {
          const data = await fetch(
            "http://localhost:3001/users/theme/" + "627e5d8d2705fc491e64aa1a"// GET theme path 
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
      document.getElementById("App").classList.add(theme);
      
      }
    

   render(){
       return (
           <b id="header" className="header" style={{color: "#a0ccee"}}>Weathering With Me</b>
       )
   }


}