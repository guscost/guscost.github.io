// app component
var PortableGridTest = React.createClass({

    displayName: "PortableGridTest",

    getInitialState: function () {
        return {    
            data: testData,
            currentPage: 1
        };
    },

    _onChangePage: function (value) {
        this.setState({ currentPage: value })
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
            <h2>Portable Grid Demo</h2>
            <PortableGrid 
                scope={this}
                data={this.state.data}
                columns={[{
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
                    title: " ",
                    width: "5%",
                    align: "center",
                    template: function (item) {
                        return <a href="#" onClick={this._onClickRowDetails.bind(this, item)}>
                            <span className="glyphicon glyphicon-info-sign"></span>
                        </a>;                
                    }
                }]}
                details={function (item) {                
                    return <div className="form form-horizontal" style={{ paddingTop: 10 }}>
						<div className="form-group">
                            <label className="col-xs-2 control-label">Email:</label>
                            <div className="col-xs-6">
								<input 
									className="form-control" 
									value={item.email} 
									onChange={this._onChangeEmail.bind(this, item)} />
							</div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-2 control-label">Zip Code:</label>
                            <div className="col-xs-6">
								<input 
									className="form-control" 
									value={item.zipCode} 
									onChange={this._onChangeZipCode.bind(this, item)} />
							</div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-2 control-label">Summary:</label>
                            <div className="col-xs-10 form-control-static">{item.summary}</div>
                        </div>
                    </div>;
                }}
                currentPage={this.state.currentPage}
                onChangePage={this._onChangePage}
                pageSize={12} />
        </div>;
    }
});

// start it up
ReactDOM.render(<PortableGridTest />, document.getElementById("app"));
