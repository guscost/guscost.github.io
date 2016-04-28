// revealing module for "the rest of the application"
var everythingElse = (function () {
  "use strict";
  
  var _state = {
    
    // "loading" state,
    loading: false,
    
    // "current slide" state
    currentSlide: 0,
    
    // slides (only "displayUpToLine" changes at runtime but all text is here too)
    slides: [{
      code: "instructions",
      title: "Instructions",
      displayUpToLine: 1,
      lines: [                  
        "- Advance list items with down arrow key",
        "- Navigate between slides with left/right arrow keys",
        "- Link to this page: http://guscost.github.io/react-intro",
        "- This page is a React application, try debugging it later"
      ]
    }, {
      code: "title",
      title: "Introduction to React",
      displayUpToLine: 2,
      lines: [
        "Gus Cost\r\n",
        "![React logo](images/React.js_logo.svg)"
      ]
    }, {
      code: "whatIsReact",
      title: "What is React and why use it?",
      displayUpToLine: 0,
      lines: [
        "- [React](https://facebook.github.io/react/) is a UI rendering engine",
        "- React renders a tree of customizable components",
        "- On the web, \"leaves\" are DOM primitives (`div`, `span`, `h2`)",
        "- Stateless UI is a first-class citizen"
      ]
    }, {
      code: "componentUI",
      title: "UI with components outlined",
      displayUpToLine: 2,
      lines: [
        "![An example UI with components outlined](images/thinking-in-react-components.png)",
        "\r\nFrom https://facebook.github.io/react/docs/thinking-in-react.html"
       ]
    }, {
      code: "statelessUI",
      title: "Stateless UI?",
      displayUpToLine: 0,
      lines: [
        "- UI state is any visible info that changes independently while using an app",
         "- Overwrite everything with new HTML on every update?",
         "- React allows us to *pretend* to overwrite everything",
         "- It transparently figures out which DOM elements to actually update",
         "- Much faster than overwriting all HTML or updating every DOM element",
         "- Components can be stateless (result only depends on *props* passed in)",
        "- Components can have their own state (but use discretion with this feature)"
       ]
    }, {
      code: "statelessComponentTree",
      title: "Stateless component tree",
      displayUpToLine: 2,
      lines: [
        "![A tree of components](images/data_flow1.svg)",
        "\r\nFrom http://aeflash.com/2015-02/react-tips-and-best-practices.html"
      ]
    }, {
      code: "exampleComponent",
      title: "Example component (this one does have internal state)",
      displayUpToLine: 1,
      lines: [
        "```javascript\r\n" +
        "var SimpleForm = React.createClass({\r\n" +
        "  \r\n" +
        "  displayName: \"SimpleForm\",\r\n" +
        "  \r\n" +
        "  propTypes: {\r\n" +
        "    buttonText: React.PropTypes.string,\r\n" +
        "    onSubmitValue: React.PropTypes.func.isRequired\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  getInitialState: function () {\r\n" +
        "    return { inputValue: \"\" };\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  _onChangeValue: function (event) {\r\n" +
        "    this.setState({ inputValue: event.target.value });\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  _onSubmitValue: function (event) {\r\n" +
        "    this.props.onSubmitValue(this.state.inputValue);\r\n" +
        "    this.setState({ inputValue: \"\" });\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  render: function () {\r\n" +
        "    return React.createElement(\"form\", {\r\n" + 
        "      className: \"form-inline\"\r\n" +
        "    },\r\n" +
        "      \r\n" +
        "      React.createElement(\"input\", {\r\n" +
        "        type: \"text\",\r\n" +
        "        className: \"form-control\",\r\n" +
        "        value: this.state.inputValue,\r\n" +
        "        onChange: this._onChangeValue\r\n" +
        "      }),\r\n" +
        "      \r\n" +
        "      React.createElement(\"div\", { \r\n" +
        "        className: \"btn btn-default\",\r\n" +
        "        onClick: this._onSubmitValue\r\n" +
        "      }, \r\n" +
        "        this.props.buttonText || \"Submit\"\r\n" +
        "      )\r\n" +
        "    );\r\n" +
        "  }\r\n" +
        "});" +
        "```"
       ]
    }, {
      code: "exampleComponentJSX",
      title: "Example component (JSX version)",
      displayUpToLine: 1,
      lines: [
        "```javascript\r\n" +
        "var SimpleForm = React.createClass({\r\n" +
        "  \r\n" +
        "  displayName: \"SimpleForm\",\r\n" +
        "  \r\n" +
        "  propTypes: {\r\n" +
        "    buttonText: React.PropTypes.string,\r\n" +
        "    onSubmitValue: React.PropTypes.func.isRequired\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  getInitialState: function () {\r\n" +
        "    return { inputValue: \"\" };\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  _onChangeValue: function (event) {\r\n" +
        "    this.setState({ inputValue: event.target.value });\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  _onSubmitValue: function (event) {\r\n" +
        "    this.props.onSubmitValue(this.state.inputValue);\r\n" +
        "    this.setState({ inputValue: \"\" });\r\n" +
        "  },\r\n" +
        "  \r\n" +
        "  render: function () {\r\n" +
        "    return <form className=\"form-inline\">\r\n" +
        "      \r\n" +
        "      <input\r\n" +
        "        type=\"text\"\r\n" +
        "        className=\"form-control\"\r\n" +
        "        value={this.state.inputValue}\r\n" +
        "        onChange={this._onChangeValue} />\r\n" +
        "      \r\n" + 
        "      <div\r\n" +
        "        className=\"btn btn-default\"\r\n" +
        "        onClick={this._onSubmitValue}>\r\n" +
        "        \r\n" +
        "        {this.props.buttonText || \"Submit\"}\r\n" +
        "        \r\n" +
        "      </div>\r\n" +
        "      \r\n" +
        "    </form>;\r\n" +
        "  }\r\n" +
        "});\r\n" +
        "```"
       ]
    }, {
      code: "jsxIntro",
      title: "A word about JSX",
      displayUpToLine: 0,
      lines: [
        "- JSX looks like HTML but is converted to JavaScript before running",
        "- Every \"tag\" is actually a call to `React.createElement()`",
        "- It's nice but requires toolchain support: " +
          "[Babel](https://facebook.github.io/react/docs/language-tooling.html) or " + 
          "[TypeScript](https://www.typescriptlang.org/docs/handbook/jsx.html) or " + 
          "[Visual Studio](https://www.microsoft.com/en-us/download/details.aspx?id=48593)",
        "- To just quickly transform some JSX paste it here: https://babeljs.io/repl/"
       ]
    }, {
      code: "demoTodoList",
      title: "Demo: Todo List",
      lines: []
    }, {
      code: "debugging",
      title: "Debugging React",
      displayUpToLine: 0,
      lines: [
        "- Use the dev tools! " +
          "([Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) " + 
          "works best with large apps, or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/))",
        "- Set breakpoints in `render()` or anywhere else",
        "- Set `displayName` on every component",
        "- Set `propTypes` on every component " +
          "([documentation](https://facebook.github.io/react/docs/reusable-components.html#prop-validation))",
        "- Use the development build in development",
        "- Watch the console for warnings"
       ]
    }, {
      code: "optimizing",
      title: "Optimizing React",
      displayUpToLine: 0,
      lines: [
        "- Use the production build of React in production",
        "- [Perf tools](http://facebook.github.io/react/docs/perf.html) are a good way to identify slow components",
        "- [Define `shouldComponentUpdate` to optimize components](https://facebook.github.io/react/docs/advanced-performance.html)",
        "- If `shouldComponentUpdate` returns `false`, the component will skip rendering",
        "- If the app is mysteriously not updating you might have messed this up",
        "- On updates you can increment a separate `version` to inspect in `shouldComponentUpdate`",
        "- Using [ImmutableJS](https://facebook.github.io/immutable-js/) makes it easier to implement `shouldComponentUpdate`"
      ]
    }, {
      code: "integrating",
      title: "Integrating React with other technology",
      displayUpToLine: 0,
      lines: [
        "- Define lifecycle methods like `componentDidMount` and `componentWillUnmount`",
        "- Check out the [component documentation](https://facebook.github.io/react/docs/component-specs.html)",
        "- Pass a `ref` prop to any component",
        "- `this.refs.{REFNAME}` will be the DOM element where the component is rendered",
        "- See my [Kendo wrapper library](http://guscost.github.io/kendo-react-wrappers/) for an example"
      ]
    }, {
      code: "demoItinerary",
      title: "Demo: Star Wars Itinerary",
      lines: []
    }, {
      code: "flux",
      title: "Flux and Redux",
      displayUpToLine: 0,
      lines: [
        "- Flux and Redux handle \"everything else\" in your frontend codebase",
        "- The [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html) pattern just means " +
          "passing Actions through a Dispatcher into Stores",
        "- Stores keep track of the application state and trigger a render on updates",
        "- The traditional implementations are event-based from the Dispatcher on",
        "- [Redux](https://github.com/reactjs/react-redux) is an implementation of Flux-like architecture with a single Store",
        "- Reducers extract specific data from the single Store",
        "- If in doubt about which Flux implementation, Redux is a good choice"
      ]
    }, {
      code: "reactNative",
      title: "React Native",
      displayUpToLine: 0,
      lines: [
        "- Initially React only worked in browsers, rendering to the DOM",      
        "- This version is now known as React-DOM",  
        "- React-DOM renders `div` elements at the tree leaves",
        "- React-iOS renders native `View` or `Text` elements",
        "- Front-end logic is still written in JavaScript or JSX",
        "- React has native support for " +
          "[iOS](https://facebook.github.io/react-native/), " +
          "[Android](https://facebook.github.io/react-native/), and " +
          "[Windows](https://blogs.windows.com/buildingapps/2016/04/13/react-native-on-the-universal-windows-platform/)",
        "- Much less mature than the DOM renderer"
      ]
    }, {
      code: "links",
      title: "Links",
      displayUpToLine: 0,
      lines: [
        "- http://jamesknelson.com/learn-raw-react-no-jsx-flux-es6-webpack/",
        "- https://facebook.github.io/react/docs/thinking-in-react.html",
        "- https://facebook.github.io/react/docs/tutorial.html",
        "- https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html",
        "- http://aeflash.com/2015-02/react-tips-and-best-practices.html",
        "- http://www.jchapron.com/2015/08/14/getting-started-with-redux/ (Node.js tooling and Redux)",
        "- https://reactforbeginners.com/ (paid course but well reviewed)",
        "- http://guscost.github.io/kendo-react-wrappers/",
        "- http://guscost.github.io/react-portable-grid/"
      ]
    }, {
      code: "thanks",
      title: "Thank you",
      displayUpToLine: 0,
      lines: [
        "- Questions?"
      ]
    }],
    
    // todo app state
    todos: [{
      id: 1,
      text: "Do item 1",
      done: false
    }, {
      id: 2,
      text: "Do item 2",
      done: false
    }],
    
    // star wars planets data loaded from star wars API: http://swapi.co
    planetsPage: 0,
    planets: [],
    
    // star wars planet itinerary
    itinerary: []
    
  };
  
  var getState = function () {
    return _state;
  };
  
  var render = function () {
    // render slideshow in #slideshow div
    ReactDOM.render(
      React.createElement(Slideshow, { 
        loading: _state.loading,
        currentSlide: _state.currentSlide,
        slides: _state.slides,
        todos: _state.todos,
        planetsPage: _state.planetsPage,
        planets: _state.planets,
        itinerary: _state.itinerary
      }), 
      document.getElementById("slideshow")
    );
  };
    
  // functions for navigating the slideshow
  var goToNextLine = function () {
    var slide = _state.slides[_state.currentSlide];
    slide.displayUpToLine = Math.min(slide.displayUpToLine + 1, slide.lines.length);
    render();
  };    
  var goToPreviousSlide = function () {
    _state.currentSlide = Math.max(_state.currentSlide - 1, 0);
    render();
  };    
  var goToNextSlide = function () {
    _state.currentSlide = Math.min(_state.currentSlide + 1, _state.slides.length - 1);
    render();
  };

  // functions for updating the todo app
  var addTodo = function (text) {
    _state.todos.push({
      id: Math.floor((Math.random() * 999999) + 1), // this is not actually a good idea
      text: text,
      done: false
    });
    render();
  };
  var toggleTodo = function (id) {
    var todo = _.find(_state.todos, { id: id });
    todo.done = !todo.done;
    render();
  };
  var removeTodo = function (id) {
    _.remove(_state.todos, { id: id });
    render();
  };
  var addOneHundredTodos = function () {
    for (var i = 0; i < 100; i++) {
      var newId = Math.floor((Math.random() * 999999) + 1);
      _state.todos.push({
        id: newId,
        text: "New todo " + newId,
        done: false
      });
    }
    render();
  };

  // functions for updating the star wars itinerary app
  var loadNextPlanetsPage = function () {
    
    // set loading indicator
    _state.loading = true;
    render();
    
    // increment planets page
    _state.planetsPage++;
    if (_state.planetsPage === 7) { _state.planetsPage = 1; }
    
    // get planets from star wars API
    $.ajax({
      method: "GET",
      url: "http://swapi.co/api/planets/?page=" + _state.planetsPage
    }).done(function (data) {
      
      // set planets list and end loading
      _state.planets = data.results;
      _state.loading = false;
      render();    
    });
  };
  
  var addPlanetToItinerary = function (url) {
    
    // find matching planet
    var planet = _.find(_state.planets, function (planet) {
      return planet.url === url;
    });    
    
    // copy planet into itinerary
    var planetCopy = JSON.parse(JSON.stringify(planet));
    planetCopy.scheduledVisit = null;
    _state.itinerary.push(planetCopy);
    
    // re-render
    render();
  };
  
  var removePlanetFromItinerary = function (url) {
    
    // delete matching stop
    _.remove(_state.itinerary, function (stop) {
      return stop.url === url;
    });    
    
    // re-render
    render();  
  };
  
  var changePlanetScheduledVisit = function (url, value) {
    
    // update matching stop in itinerary
    var stop = _.find(_state.itinerary, function (stop) {
      return stop.url === url;
    });      
    stop.scheduledVisit = value;
    
    // re-order itinerary by date
    _state.itinerary = _.sortBy(_state.itinerary, function (stop) {
      return stop.scheduledVisit;      
    });
    
    // re-render
    render();
  };
  
  return {
    getState: getState,
    render: render,
    
    goToNextLine: goToNextLine,
    goToPreviousSlide: goToPreviousSlide,
    goToNextSlide: goToNextSlide,
    
    addTodo: addTodo,
    toggleTodo: toggleTodo,
    removeTodo: removeTodo,
    addOneHundredTodos: addOneHundredTodos,
    
    loadNextPlanetsPage: loadNextPlanetsPage,
    addPlanetToItinerary: addPlanetToItinerary,
    removePlanetFromItinerary: removePlanetFromItinerary,
    changePlanetScheduledVisit: changePlanetScheduledVisit
  };
})();

// configure marked to highlight javascript code blocks
marked.setOptions({
  highlight: function (code) {
    return hljs.highlight("javascript", code).value;
  }
});

// do first render immediately 
everythingElse.render();
