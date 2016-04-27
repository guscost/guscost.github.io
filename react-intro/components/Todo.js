var Todo = React.createClass({
  
  displayName: "Todo",
  
  propTypes: {
    id: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    done: React.PropTypes.bool.isRequired
  },
  
  _onChangeStatus: function (event) {
    everythingElse.toggleTodo(this.props.id);  
  },
  
  _onClickRemove: function (event) {
    everythingElse.removeTodo(this.props.id);  
  },
  
  render: function render() {
    var el = React.createElement;
    var cmp = this;
  
    return el("div", { 
      key: cmp.props.id,
      className: "row"
    }, 
    
      el("div", {
        className: "col-xs-6"
      }, 
        cmp.props.text
      ),
      
      el("div", {
        className: "col-xs-2"
      },
        el("input", {
          type: "checkbox",
          value: cmp.props.done,
          onChange: cmp._onChangeStatus
        })
      ),
                
      el("div", {
        className: "col-xs-2"
      },          
        cmp.props.done ? 
        
          el("span", { 
            className: "glyphicon glyphicon-trash",
            style: { fontSize: "12px", cursor: "pointer" },
            onClick: cmp._onClickRemove
          }) : 
          
          null            
      )
    );
  }
});