// app component
var PortableGridTest = React.createClass({

	displayName: "PortableGridTest",

	getInitialState: function () {
		return {    
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
				title: " ",
				width: "5%",
				align: "center",
				template: function (item) {
					return <a href="#" onClick={this._onClickRowDetails.bind(this, item)}>
						<span className="glyphicon glyphicon-info-sign"></span>
					</a>;				
				}
			}],
			currentPage: 2
		};
	},

	_onChangePage: function (value) {
		this.setState({ currentPage: value })
	},	
	
	_onClickRowDetails: function (item) {
		alert(item.summary);
	},
	
	render: function () {
		return <div className="col-xs-9">
			<h2>Portable Grid Demo</h2>
			<PortableGrid 
				parent={this}
				data={this.state.data}
				columns={this.state.columns}
				currentPage={this.state.currentPage}
				pageSize={12}
				onChangePage={this._onChangePage} />
		</div>;
	}
});

// start it up
ReactDOM.render(<PortableGridTest />, document.getElementById("app"));
