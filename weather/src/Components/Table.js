import React, { Component } from "react";
import "./table.css";
import sun from '../images/sun.png';
import moon from '../images/moon.png'

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = { tableData: [], columns:  [
      { label: "City Name", accessor: "locName", sortable: true },
      { label: "Latitude", accessor: "latitude", sortable: true },
      { label: "Longitude", accessor: "longitude", sortable: true },
    ],
    sortField: "", order: "asc", theme: "dark"};

    this.handleTheme = this.handleTheme.bind(this);
  }

  componentDidMount() {
    (async () => {
      const data = await fetch(
        "http://localhost:3001/locations"
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({tableData: data});
      console.log(this.state.tableData)
    })();

    // fetch theme
    /*
    (async () => {
      const data = await fetch(
        "http://localhost:3001/" // GET path 
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({theme: data});
    })();
    */
  }

  setChecked(e){
    console.log(e.currentTarget.checked);
    //this.setState({favourite: e.currentTarget.checked});
    //console.log(this.state.favourite)
  }

  handleTheme(e){
    console.log(this.state.theme);
    if(this.state.theme == "dark"){
      this.setState({theme: "light"});
    }
    else{
      this.setState({theme: "dark"});
    }
    console.log(this.state.theme);
    let data = "userId=" + "627be65d731afd1b3293a027" + "&theme=" + this.state.theme;
    fetch('http://localhost:3001/users/theme', {
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            //mode: 'cors',
            method: 'PUT',
            body: data
        })
        .then(res => res.text())
        .then(data => {
            data.replace(/\n/g, "");
            console.log("put done!");
        })
        .catch((error) => {
          console.error('Error:', error);
        });
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
      <div className="toggle-container">
      <button onClick={this.handleTheme}>{this.state.theme == "dark"? 
        <img src={moon} width={50} /> 
      : <img src={sun} width={50} />}</button>
  </div>
    <div className="table_container">
      <br></br>
      <h3>Location List</h3>
      <small>
        Please click the up / down arrow at a field head to sort the table with 
        that field in ascending / descending order.
      </small>
      <table className="table">
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
                            <a href = {`http://localhost:3000/info/${data[accessor]}`}>
                              {tData}
                            </a>
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

