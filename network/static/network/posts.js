"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim(); // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

const data = document.getElementById('post-data');
const value = JSON.parse(data.textContent);
data.parentNode.removeChild(data);

const log = document.getElementById('loggedIn');
const loggedIn = log.textContent === "true";
log.parentNode.removeChild(log);

class Textarea extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleChange", e => {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + 5 + "px";
      this.setState({
        editText: e.target.value
      }, () => {
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      });
    });

    this.myRef = React.createRef();
    this.state = {
      editText: this.props.description
    };
  }

  componentDidMount() {
    const txt = this.myRef.current;
    txt.style.height = "auto";
    txt.style.height = txt.scrollHeight + 5 + "px";
  }

  render() {
    return /*#__PURE__*/React.createElement("textarea", {
      ref: this.myRef,
      class: "card-text edit textarea form-control",
      onChange: this.handleChange,
      value: this.state.editText
    });
  }

}

class Post extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "updateEdit", data => {
      this.setState({
        editText: data["editText"]
      });
    });

    _defineProperty(this, "editToggle", () => {
      this.setState({
        edit: !this.state.edit
      });
    });

    _defineProperty(this, "updateDesc", () => {
      if (this.state.editText === "") {
        this.setState({
          error: true,
          errtext: "Post cannot be empty"
        });
        return;
      }

      let csrftoken = getCookie('csrftoken');
      fetch('/edit', {
        method: 'POST',
        body: JSON.stringify({
          description: this.state.editText,
          id: this.state.id
        }),
        headers: {
          "X-CSRFToken": csrftoken
        }
      }).then(response => {
        if (!response.ok) {
          response.json().then(data => {
            this.setState({
              error: true,
              errtext: data.error
            });
          });
        } else {
          this.setState({
            error: false,
            edit: false,
            description: this.state.editText
          });
        }
      });
    });

    _defineProperty(this, "liking", () => {
      let csrftoken = getCookie('csrftoken');
      fetch('/like', {
        method: 'POST',
        body: JSON.stringify({
          id: this.state.id,
          liked: !this.state.liked
        }),
        headers: {
          "X-CSRFToken": csrftoken
        }
      }).then(response => {
        if (!response.ok) {
          response.json().then(data => {
            console.log(data);
            this.setState({
              error: true,
              errtext: data.error
            });
          });
        } else {
          this.setState({
            error: false,
            liked: !this.state.liked,
            likes: this.state.liked ? this.state.likes - 1 : this.state.likes + 1
          });
        }
      });
    });

    this.state = {
      description: this.props.description,
      editText: this.props.description,
      likes: this.props.likeCount,
      liked: this.props.liked,
      edit: false,
      id: this.props.id,
      error: false,
      errtext: ""
    };
  }

  render() {
    if (!loggedIn) {
      return /*#__PURE__*/React.createElement("div", {
        class: "card marginall border-dark mb-3"
      }, /*#__PURE__*/React.createElement("div", {
        class: "card-header"
      }, /*#__PURE__*/React.createElement("h5", {
        class: "card-title d-inline"
      }, /*#__PURE__*/React.createElement("a", {
        class: "text-decoration-none",
        href: "/profile/" + this.props.username
      }, this.props.username))), /*#__PURE__*/React.createElement("div", {
        class: "card-body"
      }, this.state.error && /*#__PURE__*/React.createElement("div", {
        class: "alert alert-danger",
        role: "alert"
      }, this.state.errtext), /*#__PURE__*/React.createElement("div", {
        class: "card-text"
      }, this.state.description)), /*#__PURE__*/React.createElement("div", {
        class: "card-footer text-muted"
      }, /*#__PURE__*/React.createElement("div", {
        class: "cursor-no d-inline"
      }, /*#__PURE__*/React.createElement("i", {
        onClick: this.liking,
        class: "pointer-no far fa-heart text-danger"
      }, " ")), " " + this.state.likes, /*#__PURE__*/React.createElement("div", {
        class: "d-inline float-right"
      }, this.props.timestamp)));
    }

    if (this.props.isMine) {
      return /*#__PURE__*/React.createElement("div", {
        class: "card marginall border-dark mb-3"
      }, /*#__PURE__*/React.createElement("div", {
        class: "card-header"
      }, /*#__PURE__*/React.createElement("h5", {
        class: "card-title d-inline"
      }, /*#__PURE__*/React.createElement("a", {
        class: "text-decoration-none",
        href: "/profile/" + this.props.username
      }, this.props.username)), this.state.edit ? /*#__PURE__*/React.createElement("div", {
        class: "d-inline float-right"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: this.updateDesc,
        class: "d-inline btn btn-primary btn-sm cursor-pointer"
      }, "Save"), "\xA0\xA0\xA0", /*#__PURE__*/React.createElement("button", {
        onClick: this.editToggle,
        class: "d-inline btn btn-sm btn-danger cursor-pointer"
      }, "Esc")) : /*#__PURE__*/React.createElement("button", {
        onClick: this.editToggle,
        class: "d-inline btn btn-primary btn-sm cursor-pointer float-right"
      }, "Edit ", /*#__PURE__*/React.createElement("i", {
        class: "fas fa-edit"
      }))), /*#__PURE__*/React.createElement("div", {
        class: "card-body"
      }, this.state.error && /*#__PURE__*/React.createElement("div", {
        class: "alert alert-danger",
        role: "alert"
      }, this.state.errtext), this.state.edit ? /*#__PURE__*/React.createElement(Textarea, {
        description: this.state.editText,
        onChange: this.updateEdit
      }) : /*#__PURE__*/React.createElement("div", {
        class: "card-text"
      }, this.state.description)), /*#__PURE__*/React.createElement("div", {
        class: "card-footer text-muted"
      }, this.state.liked ? /*#__PURE__*/React.createElement("i", {
        onClick: this.liking,
        class: "cursor-pointer fas fa-heart text-danger"
      }, " ") : /*#__PURE__*/React.createElement("i", {
        onClick: this.liking,
        class: "cursor-pointer far fa-heart text-danger"
      }, " "), " " + this.state.likes, /*#__PURE__*/React.createElement("div", {
        class: "d-inline float-right"
      }, this.props.timestamp)));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        class: "card marginall border-dark mb-3"
      }, /*#__PURE__*/React.createElement("div", {
        class: "card-header"
      }, /*#__PURE__*/React.createElement("h5", {
        class: "card-title"
      }, /*#__PURE__*/React.createElement("a", {
        class: "text-decoration-none",
        href: "/profile/" + this.props.username
      }, this.props.username))), /*#__PURE__*/React.createElement("div", {
        class: "card-body"
      }, this.state.error && /*#__PURE__*/React.createElement("div", {
        class: "alert alert-danger",
        role: "alert"
      }, this.state.errtext), /*#__PURE__*/React.createElement("div", {
        class: "card-text"
      }, this.state.description)), /*#__PURE__*/React.createElement("div", {
        class: "card-footer text-muted"
      }, this.state.liked ? /*#__PURE__*/React.createElement("i", {
        onClick: this.liking,
        class: "cursor-pointer fas fa-heart text-danger"
      }, " ") : /*#__PURE__*/React.createElement("i", {
        onClick: this.liking,
        class: "cursor-pointer far fa-heart text-danger"
      }, " "), " " + this.state.likes, /*#__PURE__*/React.createElement("div", {
        class: "d-inline float-right"
      }, this.props.timestamp)));
    }
  }

}

class App extends React.Component {
  render() {
    let app = [];
    value.map(post => app.push( /*#__PURE__*/React.createElement(Post, post)));
    return /*#__PURE__*/React.createElement("div", null, app);
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector('#card-holder'));

// /** Source React */
// function getCookie(name) {
//   var cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//       var cookies = document.cookie.split(';');
//       for (var i = 0; i < cookies.length; i++) {
//           var cookie = cookies[i].trim();
//           // Does this cookie string begin with the name we want?
//           if (cookie.substring(0, name.length + 1) === (name + '=')) {
//               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//               break;
//           }
//       }
//   }
//   return cookieValue;
// }


// const data = document.getElementById('post-data');
// const value = JSON.parse(data.textContent);
// data.parentNode.removeChild(data);

// const log = document.getElementById('loggedIn');
// const loggedIn = log.textContent === "true";
// log.parentNode.removeChild(log);

// class Textarea extends React.Component {
//   constructor(props) {
//       super(props);
//       this.myRef = React.createRef();
//       this.state = {
//           editText: this.props.description,
//       }
//   }

//   componentDidMount() {
//       const txt = this.myRef.current;
//       txt.style.height = "auto";
//       txt.style.height = (txt.scrollHeight + 5) + "px";
//   }

//   render() {
//       return (
//           <textarea ref={this.myRef} class="card-text edit textarea form-control" onChange={this.handleChange} value={ this.state.editText }></textarea>
//       )
//   }

//   handleChange = e => {
//       e.target.style.height = "auto";
//       e.target.style.height = (e.target.scrollHeight + 5) + "px";
//       this.setState({ editText : e.target.value }, () => {
//           if (this.props.onChange) {
//               this.props.onChange(this.state);
//           }
//       })
//   }
// }

// class Post extends React.Component {

//   constructor(props) {
//       super(props);
//       this.state = {
//           description: this.props.description,
//           editText: this.props.description,
//           likes: this.props.likeCount,
//           liked: this.props.liked,
//           edit: false,
//           id: this.props.id,
//           error: false,
//           errtext: "",
//       }
//   }

//   render() {
//       if (!loggedIn) {
//           return (
//               <div class="card marginall border-dark mb-3">
//                   <div class="card-header">
//                       <h5 class="card-title d-inline"><a class="text-decoration-none" href={"/profile/" + this.props.username }>{ this.props.username }</a></h5>
//                   </div>
//                   <div class="card-body">
//                     { (this.state.error) &&
//                         <div class="alert alert-danger" role="alert">
//                           {this.state.errtext}
//                         </div>
//                     }
//                     <div class="card-text">{ this.state.description }</div>
//                   </div>
//                   <div class="card-footer text-muted">
//                       <div class="cursor-no d-inline"><i onClick={this.liking} class="pointer-no far fa-heart text-danger"> </i></div>
//                       { " " + this.state.likes }
//                       <div class="d-inline float-right">{ this.props.timestamp }</div>
//                   </div>
//               </div>
//           )
//       }
//       if (this.props.isMine) {
//           return (
//               <div class="card marginall border-dark mb-3">
//                   <div class="card-header">
//                       <h5 class="card-title d-inline"><a class="text-decoration-none" href={"/profile/" + this.props.username }>{ this.props.username }</a></h5>
//                       {this.state.edit ? (
//                           <div class="d-inline float-right">
//                               <button onClick={this.updateDesc} class="d-inline btn btn-primary btn-sm cursor-pointer">Save</button>
//                               &nbsp;&nbsp;&nbsp;
//                               <button onClick={this.editToggle} class="d-inline btn btn-sm btn-danger cursor-pointer">Esc</button>
//                           </div>
//                       ) : (
//                           <button onClick={this.editToggle} class="d-inline btn btn-primary btn-sm cursor-pointer float-right">Edit <i class="fas fa-edit"></i></button>
//                       )}
                      
//                   </div>
//                   <div class="card-body">
//                     { (this.state.error) &&
//                         <div class="alert alert-danger" role="alert">
//                           {this.state.errtext}
//                         </div>
//                     }
//                     {this.state.edit ? (
//                             <Textarea description={ this.state.editText } onChange={this.updateEdit} />
//                     ) : (
//                         <div class="card-text">{ this.state.description }</div>
//                     )}
//                   </div>
//                   <div class="card-footer text-muted">
//                       {this.state.liked ? (
//                           <i onClick={this.liking} class="cursor-pointer fas fa-heart text-danger"> </i>
//                       ) : (
//                           <i onClick={this.liking} class="cursor-pointer far fa-heart text-danger"> </i>
//                       )}
//                       { " " + this.state.likes }
//                       <div class="d-inline float-right">{ this.props.timestamp }</div>
//                   </div>
//               </div>
//           )
//       }
//       else {
//           return (
//               <div class="card marginall border-dark mb-3">
//                   <div class="card-header">
//                       <h5 class="card-title"><a class="text-decoration-none" href={"/profile/" + this.props.username }>{ this.props.username }</a></h5>
//                   </div>
//                   <div class="card-body">
//                     { (this.state.error) &&
//                         <div class="alert alert-danger" role="alert">
//                           {this.state.errtext}
//                         </div>
//                     }
//                     <div class="card-text">{ this.state.description }</div>
//                   </div>
//                   <div class="card-footer text-muted">
//                       {this.state.liked ? (
//                           <i onClick={this.liking} class="cursor-pointer fas fa-heart text-danger"> </i>
//                       ) : (
//                           <i onClick={this.liking} class="cursor-pointer far fa-heart text-danger"> </i>
//                       )}
//                       { " " + this.state.likes }
//                       <div class="d-inline float-right">{ this.props.timestamp }</div>
//                   </div>
//               </div>
//           )
//       }
//   }

//   updateEdit = data => {
//       this.setState({
//           editText: data["editText"],
//       })
//   }

//   editToggle = () => {
//       this.setState({
//           edit: !this.state.edit,
//       })
//   }

//   updateDesc = () => {
//       if (this.state.editText === "") {
        // this.setState({
        //   error: true,
        //   errtext: "Post cannot be empty"
        // });
//           return
//       }
//       let csrftoken = getCookie('csrftoken');
//       fetch('/edit', {
//           method: 'POST',
//           body: JSON.stringify({
//               description: this.state.editText,
//               id: this.state.id,
//           }),
//           headers: { "X-CSRFToken": csrftoken },
//       })
//       .then(response => {    
//         if (!response.ok) {
//           response.json().then(data => {
//             this.setState({
//               error: true,
//               errtext: data.error,
//             })
//           })
//         }
//         else {
//           this.setState({
//             error: false,
//             edit: false,
//             description: this.state.editText,
//           })
//         }
//       })
//   }

//   liking = () => {
//       let csrftoken = getCookie('csrftoken');
//       fetch('/like', {
//           method: 'POST',
//           body: JSON.stringify({
//               id: this.state.id,
//               liked: !this.state.liked,
//           }),
//           headers: { "X-CSRFToken": csrftoken },
//       })
//       .then(response => {
//           if (!response.ok) {
//             response.json().then(data => {
//               console.log(data);
//               this.setState({
//                 error: true,
//                 errtext: data.error,
//               })
//             })
//           }
//           else {
//             this.setState({
//                 error: false,
//                 liked: !this.state.liked,
//                 likes: this.state.liked ? this.state.likes - 1 : this.state.likes + 1,
//             })
//           }
//       });       
//   }

// }

// class App extends React.Component {

//   render() {
//       let app = []
//       value.map(post => app.push(<Post {...post} />))
//       return (
//           <div>
//               {app}
//           </div>
//       )
//   }

// }

// ReactDOM.render(<App />, document.querySelector('#card-holder'));