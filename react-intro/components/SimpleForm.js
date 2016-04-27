var SimpleForm = React.createClass({

  displayName: "SimpleForm",

  propTypes: {
    buttonText: React.PropTypes.string,
    onSubmitValue: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return { inputValue: "" };
  },

  _onChangeValue: function (event) {
    this.setState({ inputValue: event.target.value });
  },

  _onSubmitValue: function (event) {
    this.props.onSubmitValue(this.state.inputValue);
    this.setState({ inputValue: "" });
  },

  render: function () {
    return React.createElement("form", { className: "form-inline" },

      React.createElement("input", {
        type: "text",
        className: "form-control",
        value: this.state.inputValue,
        onChange: this._onChangeValue
      }),

      React.createElement("div", { 
        className: "btn btn-default",
        onClick: this._onSubmitValue
      }, 
        this.props.buttonText || "Submit"
      )
    );
  }
});