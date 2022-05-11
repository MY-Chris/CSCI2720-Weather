import React, { Component } from "react";
import mockdata from "../data.json";

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = { tableData: mockdata, columns:  [
      { label: "Full Name", accessor: "full_name", sortable: true },
      { label: "Email", accessor: "email", sortable: false },
      { label: "Gender", accessor: "gender", sortable: true },
      { label: "Age", accessor: "age", sortable: true },
      { label: "Start date", accessor: "start_date", sortable: true },
    ],
    sortField: "", order: "asc"};
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

  redirect(e){
    window.location.pathname = `http://localhost:3000/`
  }

  render(){
  return (
    <div>
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
            <tr key={data.id}>
              {this.state.columns.map(({ accessor }) => {
                if(accessor == "full_name"){
                  const tData = data[accessor] ? data[accessor] : "——";
                  return (<td key={accessor}>
                            <a href = {`http://localhost:3000/info/${data[accessor]}`}>
                              {tData}
                            </a>
                          </td>)
                }
                else{
                  const tData = data[accessor] ? data[accessor] : "——";
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

