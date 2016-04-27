var TodoApp = React.createClass({
  
  displayName: "TodoApp",
  
  propTypes: {
    visible: React.PropTypes.bool.isRequired,
    todos: React.PropTypes.array.isRequired
  },
  
  _onAddTodo: function (text) {
    everythingElse.addTodo(text);  
  },
  
  render: function render() {
    var el = React.createElement;
    var cmp = this;
    
    // keep track of how many incomplete todos we have
    var totalIncomplete = 0;
  
    return el("div", {
      style: { 
        display: cmp.props.visible ? null : "none",
        fontSize: "24px" 
      }
    },
    
      el(SimpleForm, {
        buttonText: "Add",
        onSubmitValue: cmp._onAddTodo
      }),
      
      el("div", {
        className: "row"
      },
        el("div", {
          className: "col-xs-6"
        },
          _.map(cmp.props.todos, function (todo, index) {
            
            // aggregate incomplete todos here too to save CPU cycles
            if (!todo.done) { totalIncomplete++; }
            
            // return a "Todo" element for this todo
            return el(Todo, {
              key: todo.id,
              id: todo.id,
              text: todo.text,
              done: todo.done  
            });
            
          })
        ),
        el("div", {
          className: "col-xs-6"
        },
          el("div", {
            style: { 
              color: totalIncomplete > 10 ? "red" : "black" 
            }
          },
            "Remaining: ",
            totalIncomplete
          )
        )
      )
    );
  }
});