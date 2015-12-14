// app component
"use strict";

var PortableGridTest = React.createClass({

    displayName: "PortableGridTest",

    getInitialState: function getInitialState() {
        return {
            currentPage: 1,
            data: testData,
            columns: [{
                field: "firstName",
                title: "First Name",
                width: "20%"
            }, {
                field: "lastName",
                title: "Last Name",
                width: "20%"
            }, {
                field: "email",
                title: "Email Address",
                width: "40%"
            }, {
                title: "Birthday",
                width: "15%",
                template: function template(item) {
                    return moment(item.birthday).format("MMM D");
                }
            }, {
                title: "",
                width: "5%",
                align: "center",
                template: function template(item) {
                    return React.createElement(
                        "a",
                        { href: "#", onClick: this._onClickRowDetail.bind(this, item) },
                        React.createElement("span", { className: "glyphicon glyphicon-info-sign" })
                    );
                }
            }]
        };
    },

    _onChangePage: function _onChangePage(value) {
        this.setState({ currentPage: value });
    },

    // the grid will pass in default functions here if we want to use them
    // defaultSotOrder is a standard function to update the sort order prop
    // using defaultSort can be super confusing but it might save some typing
    _onClickHeader: function _onClickHeader(column, defaultSortOrderUpdate, defaultSort) {
        if (column.field) {
            // copy arrays first and then do setState() if you want to follow the rules        
            var newSortOrder = defaultSortOrderUpdate(column.sort);
            this.state.columns.forEach(function (n) {
                delete n.sort;
            });
            this.state.data.sort(defaultSort.bind(null, column.field, newSortOrder));
            column.sort = newSortOrder;
            this.forceUpdate();
        }
    },

    _onClickRowDetail: function _onClickRowDetail(item) {
        item._rowSelected = !item._rowSelected;
        this.forceUpdate();
    },

    _onChangeEmail: function _onChangeEmail(item, event) {
        item.email = event.target.value;
        this.forceUpdate();
    },

    _onChangeZipCode: function _onChangeZipCode(item, event) {
        item.zipCode = event.target.value;
        this.forceUpdate();
    },

    render: function render() {
        return React.createElement(
            "div",
            { className: "col-xs-9" },
            React.createElement(
                "h2",
                null,
                "React Portable Grid demo (",
                React.createElement(
                    "a",
                    { href: "https://github.com/guscost/react-portable-grid" },
                    "github"
                ),
                ") (",
                React.createElement(
                    "a",
                    { href: "https://guscost.github.io/react-portable-grid/app.jsx" },
                    "demo source"
                ),
                ")"
            ),
            React.createElement(PortableGrid, {
                scope: this,
                data: this.state.data,
                columns: this.state.columns,
                detail: function (item) {
                    return React.createElement(
                        "div",
                        { className: "form form-horizontal", style: { paddingTop: 20 } },
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement(
                                "label",
                                { className: "col-xs-2 control-label" },
                                "Email:"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-9" },
                                React.createElement("input", {
                                    className: "form-control",
                                    value: item.email,
                                    onChange: this._onChangeEmail.bind(this, item) })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement(
                                "label",
                                { className: "col-xs-2 control-label" },
                                "Zip Code:"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-9" },
                                React.createElement("input", {
                                    className: "form-control",
                                    value: item.zipCode,
                                    onChange: this._onChangeZipCode.bind(this, item) })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement(
                                "label",
                                { className: "col-xs-2 control-label" },
                                "Summary:"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-9 form-control-static" },
                                item.summary
                            )
                        )
                    );
                },
                currentPage: this.state.currentPage,
                onChangePage: this._onChangePage,
                onClickHeader: this._onClickHeader,
                pageSize: 12 })
        );
    }
});

// start it up
ReactDOM.render(React.createElement(PortableGridTest, null), document.getElementById("app"));