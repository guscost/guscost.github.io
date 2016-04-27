var Slideshow = React.createClass({
  
  displayName: "Slideshow",
  
  propTypes: {
    slides: React.PropTypes.array,
    items: React.PropTypes.array,
    planets: React.PropTypes.array,
    itinerary: React.PropTypes.array
  },

  componentDidMount: function() {
    window.addEventListener('keyup', this._onKeyUp);
    },

    componentWillUnmount: function() {
    window.removeEventListener('keyup', this._onKeyUp);
    },
  
  _onKeyUp: function (event) {
    switch (event.key) {
      case "ArrowDown":
        everythingElse.goToNextLine();
        break;
      case "ArrowLeft":
        everythingElse.goToPreviousSlide();
        break;
      case "ArrowRight":
        everythingElse.goToNextSlide();
        break;
    }
  },
  
  render: function render() {
    var el = React.createElement;
    var cmp = this;
    
    var slide = cmp.props.slides[cmp.props.currentSlide];
  
    return el("div", {
      onKeyUp: cmp._onKeyUp
    },  
      el(Slide, {
        title: slide.title,
        lines: slide.lines,
        displayUpToLine: slide.displayUpToLine  
      }),

      // todo list example "sub-app"
      el(TodoApp, {
        visible: slide.code === "exampleTodoList",
        todos: cmp.props.todos
      }),

      // star wars itinerary example "sub-app"
      el(ItineraryApp, {
        visible: slide.code === "exampleItinerary",
        planetsPage: cmp.props.planetsPage,
        planets: cmp.props.planets,
        itinerary: cmp.props.itinerary
      }),
      
      // popup window to indicate "loading" status
      el("div",  { 
        className: "modal loadingWindow", 
        role: "dialog", 
        id: "loadingPopup", 
        style: { 
          display: cmp.props.loading ? null : "none" 
        }
      },
        el("div", { 
          className: "modal-dialog modal-sm loadingDialog" 
        },
          el("div", { 
            className: "modal-content loadingContent" 
          },
            el("div", { 
              style: { 
                textAlign: 'center', 
                padding: '80px 32px' 
              }, 
              className: "modal-body loadingBody" 
            },
              "LOADING"
            )
          )
        )
      )
      
    );
  }
});
