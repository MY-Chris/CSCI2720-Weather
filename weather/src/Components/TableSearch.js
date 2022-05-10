import React, { Component } from "react";
import mockdata from "../data.json";
import SearchField from "react-search-field";
import SelectSearch from 'react-select-search';
import SearchResult from "./SearchResult";

export default class TableSearch extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '', field: "", tableData: mockdata, resData: []};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleRadio(e){
        console.log(e.target.value);
        this.setState({field: e.target.value})
    }
  
    handleSubmit(event) {
      //alert('A name was submitted: ' + this.state.tableData[0]['gender']);
      for(var i = 0; i < this.state.tableData.length; i++){
        if(this.state.tableData[i][this.state.field] == this.state.value){
            //console.log(this.state.tableData[i]);
            this.state.resData.push(this.state.tableData[i]);
        }
      };
      //alert('A name was submitted: ' + this.state.resData);
      console.log(this.state.resData);
      //event.preventDefault();
    }

    findResult(e){
        console.log(this.state.field);
        for(var i = 0; i < this.state.tableData.length; i++){
            if(this.state.tableData[i][this.state.field] == this.state.value){
                this.state.resData.push(this.state.tableData[i]);
            }
        }
        
        e.preventDefault();
    }
  
    render() {
      return (
        <div>
            <br></br>

        <form>
            
            <div>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <input type="button" value="Submit" onClick={this.handleSubmit}/>
            </div>
            <p className="notice-start"> Please select a search field:</p>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="gender" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by City Name</label>
            </div>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="country" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by Country</label>
            </div>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="latitude" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by Latitude</label>
            </div>
          
        </form>
        
        <SearchResult resultData={this.state.resData} />
        </div>
      );
    }
  };
