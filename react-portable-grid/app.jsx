// app component
var PortableGridTest = React.createClass({

    displayName: "PortableGridTest",

    getInitialState: function () {
        return {    
            currentPage: 1,
            data: testData,
            columns: [{
                field: "firstName",
                title: "First Name",
                width: "20%"
            },{
                field: "lastName",
                title: "Last Name",
                width: "20%"
            },{
                field: "email",
                title: "Email Address",
                width: "40%"
            },{
                title: "Birthday",
                width: "15%",
                template: function (item) {
                    return moment(item.birthday).format("MMM D");                
                }
            },{
                title: "",
                width: "5%",
                align: "center",
                template: function (item) {
                    return <a href="#" onClick={this._onClickRowDetails.bind(this, item)}>
                        <span className="glyphicon glyphicon-info-sign"></span>
                    </a>;                
                }
            }]
        };
    },

    _onChangePage: function (value) {
        this.setState({ currentPage: value });
    },

    // the grid will pass in default functions here if we want to use them
    // defaultSotOrder is a standard function to update the sort order prop
    // using defaultSort can be super confusing but it might save some typing
    _onClickHeader: function (column, defaultSortOrderUpdate, defaultSort) {
        if (column.field) {
            // copy arrays first and then do setState() if you want to follow the rules         
            var newSortOrder = defaultSortOrderUpdate(column.sort);   
            this.state.columns.forEach(function (n) { delete n.sort; });     
            this.state.data.sort(defaultSort.bind(null, column.field, newSortOrder));
            column.sort = newSortOrder;
            this.forceUpdate();
        }
    }, 
    
    _onClickRowDetails: function (item) {
        item._rowSelected = !item._rowSelected;
        this.forceUpdate();
    },
    
    _onChangeEmail: function (item, event) {
        item.email = event.target.value;
        this.forceUpdate();
    },
    
    _onChangeZipCode: function (item, event) {
        item.zipCode = event.target.value;
        this.forceUpdate();
    },
    
    render: function () {
        return <div className="col-xs-9">
            <h2>
                React Portable Grid demo 
                (<a href="https://github.com/guscost/react-portable-grid">github</a>)
                (<a href="https://guscost.github.io/react-portable-grid/app.jsx">demo source</a>)
            </h2>
            <PortableGrid 
                scope={this}
                data={this.state.data}
                columns={this.state.columns}
                details={function (item) {                
                    return <div className="form form-horizontal" style={{ paddingTop: 20 }}>
                        <div className="form-group">
                            <label className="col-xs-2 control-label">Email:</label>
                            <div className="col-xs-9">
                                <input 
                                    className="form-control" 
                                    value={item.email} 
                                    onChange={this._onChangeEmail.bind(this, item)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-2 control-label">Zip Code:</label>
                            <div className="col-xs-9">
                                <input 
                                    className="form-control" 
                                    value={item.zipCode} 
                                    onChange={this._onChangeZipCode.bind(this, item)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-2 control-label">Summary:</label>
                            <div className="col-xs-9 form-control-static">{item.summary}</div>
                        </div>
                    </div>;
                }}
                currentPage={this.state.currentPage}
                onChangePage={this._onChangePage}
                onClickHeader={this._onClickHeader}
                pageSize={12} />
        </div>;
    }
});

// start it up
ReactDOM.render(<PortableGridTest />, document.getElementById("app"));
