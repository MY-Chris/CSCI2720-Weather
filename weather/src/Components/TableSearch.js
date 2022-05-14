// HUANG Kaining 1155141441
// HUANG Sida 1155124414
// MA Yuan 1155124344
// ZHANG Wenxuan 1155141413
// ZHAO Jinpei 1155124239
import React, { Component } from "react";
import {
  Link,
} from "react-router-dom";

export default class TableSearch extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '', value2: '', field: "", tableData: [], resData: [],
      columns: [
        { label: "City Name", accessor: "locName", sortable: true },
        { label: "Latitude", accessor: "latitude", sortable: true },
        { label: "Longitude", accessor: "longitude", sortable: true },
      ],};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
      let theme = "dark";
      let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
      (async () => {
        const data = await fetch(
          "http://localhost:80/users/theme/" + userid// GET theme path 
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
        //console.log(document.getElementById("App").classList);
    })();
  
  
    }


    handleChange(event) {
      this.setState({value: event.target.value});
      console.log(this.state.value);
    }

    handleChange2(event) {
      this.setState({value2: event.target.value});
      console.log(this.state.value);
    }

    handleRadio(e){
        console.log(e.target.value);
        this.setState({field: e.target.value})
    }
  
    handleSubmit(e) {
      //alert('A name was submitted: ' + this.state.tableData[0]['gender']);
      if(this.state.field == ""){
        window.alert("Please choose a field!")
      }
      else if(this.state.field == "city"){
        (async () => {
          const data = await fetch(
            "http://localhost:80/locations_search/locName/" + this.state.value
          )
          .then((res) => res.json())
          .then((data) => data);
          console.log(data);
          this.setState({tableData: data});
        })();
        console.log(this.state.tableData);
        //alert('A name was submitted: ' + this.state.resData);
        //console.log(this.state.value2);
        //event.preventDefault();
        //window.location.pathname = "/locations_search/locName/" + this.state.value;
      }
      else{
        (async () => {
          const data = await fetch(
            "http://localhost:80/locations_search/" + this.state.field + "/" + this.state.value + "/" + this.state.value2
          )
          .then((res) => res.json())
          .then((data) => data);
          console.log(data);
          this.setState({tableData: data});
        })();
        console.log(this.state.tableData);
        //window.location.pathname = "/locations_search/" + this.state.field + "/" + this.state.value + "/" + this.state.value2
      }
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

    handleSorting = (sortField, sortOrder) => {
      if (sortField) {
        const sorted = [...this.state.tableData].sort((a, b) => {
          if (a[sortField] === null) return 1;
          if (b[sortField] === null) return -1;
          if (a[sortField] === null && b[sortField] === null) return 0;
          return (
            a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
              numeric: true,
            }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
        //setTableData(sorted);
        this.setState({tableData: sorted});
      }
    };
  
    handleSortingChange = (accessor) => {
      const sortOrder =
        accessor === this.state.sortField && this.state.order === "asc" ? "desc" : "asc";
      //setSortField(accessor);
      this.setState({sortField: accessor});
      //setOrder(sortOrder);
      this.setState({order: sortOrder});
      //handleSorting(accessor, sortOrder);
      if (accessor) {
        const sorted = [...this.state.tableData].sort((a, b) => {
          if (a[accessor] === null) 
            return 1;
          if (b[accessor] === null) 
            return -1;
          if (a[accessor] === null && b[accessor] === null) 
            return 0;
          return (
            a[accessor].toString().localeCompare(b[accessor].toString(), "en", {
              numeric: true,
            }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
        //setTableData(sorted);
        this.setState({tableData: sorted});
      }
    };
  
  
    render() {
      let searchbox;
      let formaction;
      if(this.state.field == "latitude" || this.state.field == "longitude"){
        console.log("lat/lon");
        searchbox =
        <div>
        <small>Please input an interval:</small>&emsp;
        <input type="text" value={this.state.value} onChange={this.handleChange} />&emsp;
        <input type="text" value={this.state.value2} onChange={this.handleChange2} />
        </div>;
        //formaction = "/locations_search/" + this.state.field + "/" + this.state.value + "/" + this.state.value2;
        console.log(formaction)
      }
      else{
        searchbox =
        <div>
        <small>Please input a city:</small>&emsp;
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        </div>
        //formaction = "/locations_search/locName/" + this.state.value;
      }

      return (
        <div>
            <br></br>

        <form action={formaction}>           
            {searchbox}
            <input type="button" value="Submit" onClick={(e) => this.handleSubmit(e)}/>
            <p className="notice-start"> Please select a search field:</p>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="city" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by City Name</label>
            </div>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="latitude" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by Latitude Interval</label>
            </div>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="longitude" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by Longitude Interval</label>
            </div>
          
        </form>
        
        <div className="table_container">
      <br></br>
      <h3>Search Result</h3>
      <small>
        Please click the up / down arrow at a field head to sort the table with 
        that field in ascending / descending order.
      </small>
      <table className="table" id="table">
        <caption>
          Column headers are
          sortable.
        </caption>

        <thead>
          <tr>
            {this.state.columns.map(({ label, accessor, sortable }) => {
              const cl = sortable
                ? this.state.sortField && this.state.sortField === accessor && this.state.order === "asc"
                  ? "up"
                  : this.state.sortField && this.state.sortField === accessor && this.state.order === "desc"
                  ? "down"
                  : "default"
                : "";
              return (
                <th
                  key={accessor}
                  onClick={sortable ? () => this.handleSortingChange(accessor) : null}
                  className={cl}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        
        <tbody>
        {this.state.tableData.map((data) => {
          return (
            <tr key={data._id}>
              {this.state.columns.map(({ accessor }) => {
                console.log(accessor);
                if(accessor == "locName"){
                  const tData = data[accessor];
                  return (<td key={accessor}>
                            <Link as={Link} to={`/info/${data[accessor]}`}>{tData}</Link>
                            {/*<a href = {`http://localhost:3000/info/${data[accessor]}`}>*/}

                            {/*</a>*/}
                          </td>)
                }
                else{
                  const tData = data[accessor];
                  return <td key={accessor}>{tData}</td>
                }
              })}
            </tr>
          );
        })}
    </tbody>
    </table>
    </div>

        </div>
      );
    }
  };
