// HUANG Kaining 1155141441
// HUANG Sida 1155124414
// MA Yuan 1155124344
// ZHANG Wenxuan 1155141413
// ZHAO Jinpei 1155124239
import React, { Component, Redirect } from "react";
import "./table.css";
import sun from '../images/sun.png';
import moon from '../images/moon.png'
import {
  Link,
} from "react-router-dom";

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = { tableData: [], columns:  [
      { label: "City Name", accessor: "locName", sortable: true },
      { label: "Latitude", accessor: "latitude", sortable: true },
      { label: "Longitude", accessor: "longitude", sortable: true },
    ],
    sortField: "", order: "asc", theme: "dark"};

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
      this.setState({theme: data.preference}, ()=>{console.log(this.state.theme)});
      theme = data.preference;
      console.log(theme);
      document.getElementById("table").classList.remove("dark");
      document.getElementById("table").classList.remove("light");
      document.getElementById("table").classList.add(theme);
      console.log(document.getElementById("App").classList);
      document.getElementById("App").classList.remove("dark");
      document.getElementById("App").classList.remove("light");
      document.getElementById("App").classList.add(theme);
  })();
  
  //console.log(document.getElementById("App").classList);
  console.log(sessionStorage.getItem('user'));
  console.log(sessionStorage.getItem('userid'));
  
    (async () => {
      const data = await fetch(
        "http://localhost:80/locations"
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({tableData: data});
      console.log(this.state.tableData)
    })();
  }

  setChecked(e){
    console.log(e.currentTarget.checked);
    //this.setState({favourite: e.currentTarget.checked});
    //console.log(this.state.favourite)
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



  render(){

  return (
    <div>
    <div className="table_container" id="table_container">
      <br></br>
      <h3>Location List</h3>
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
  )
  }
};

