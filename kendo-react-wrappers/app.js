// app component
var KendoWidgetTest = React.createClass({

    displayName: "KendoWidgetTest",

    getInitialState: function () {
        return {    
            options: [{
                value: "a",
                nato: "Alfa",
                lapd: "Adam"
            },{
                value: "b",
                nato: "Bravo",
                lapd: "Boy"
            },{
                value: "c",
                nato: "Charlie",
                lapd: "Charles"
            }],             
            alphabet: "nato",
            selectedOption: "a",
            selectedDate: moment().toISOString(),
            selectedNumber: 214
        };
    },

    _onChangeAlphabet: function (value) {             
        this.setState({ alphabet: value });
    },

    _onChangeSelectedOption: function (value) {             
        this.setState({ selectedOption: value });
    },

    _onChangeSelectedDate: function (value) {
        this.setState({ selectedDate: value });
    },

    _onChangeSelectedNumber: function (value) {                
        this.setState({ selectedNumber: value });
    },

    render: function () {
        return <div className="col-xs-12">
            <h2>
                Kendo React Wrappers demo 
                (<a href="https://github.com/guscost/kendo-react-wrappers">github</a>)
                (<a href="https://guscost.github.io/kendo-react-wrappers/app.js">demo source</a>)
            </h2>
            <div className="panel panel-default">
                <div className="panel-heading">Value binding</div>
                <div className="panel-body content-box">

                    <KW.DatePicker
                        value={this.state.selectedDate}
                        onChange={this._onChangeSelectedDate} />
                    {" "}
                    <KW.DatePicker
                        value={this.state.selectedDate}
                        onChange={this._onChangeSelectedDate} />
                    {" "}
                    <span>{this.state.selectedDate}</span>
                </div>
            </div>
            <div className="panel panel-default">
                <div className="panel-heading">Some updates might rebuild widget</div>
                <div className="panel-body content-box">
                    <KW.DropDownList
                        data={this.state.options}
                        value={this.state.selectedOption}
                        dataTextField={this.state.alphabet}
                        dataValueField="value"
                        onChange={this._onChangeSelectedOption} />
                    {" "}
                    <div className="btn btn-default" onClick={this._onChangeAlphabet.bind(this, "nato")}>
                        Use NATO alphabet
                    </div>
                    {" "}
                    <div className="btn btn-default" onClick={this._onChangeAlphabet.bind(this, "lapd")}>
                        Use LAPD alphabet
                    </div>
                </div>
            </div>
            <div className="panel panel-default">
                <div className="panel-heading">Unconventional bindings</div>
                <div className="panel-body content-box">
                    <KW.NumericTextBox
                        value={this.state.selectedNumber}
                        onChange={this._onChangeSelectedNumber}
                        step={3}
                        style={{ backgroundColor: "hsl(" + this.state.selectedNumber%360 + ", 40%, 90%)" }} />
                </div>
            </div>
        </div>;
    }
});

// start it up
ReactDOM.render(<KendoWidgetTest />, document.getElementById("app"));