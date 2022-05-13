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
           <b id="header" className="header" style={{color: "#a0ccee"}}>Weathering With Me</b>
       )
   }


}