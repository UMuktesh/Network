"use strict";

function _defineProperty(obj, key, v) { if (key in obj) { Object.defineProperty(obj, key, { v: v, enumerable: true, configurable: true, writable: true }); } else { obj[key] = v; } return obj; }

const datau = document.getElementById('user-data');
const v = JSON.parse(datau.textContent);
datau.parentNode.removeChild(datau);

class Follow extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "updateFollow", () => {
      let csrftoken = getCookie('csrftoken');
      fetch('/follow', {
        method: 'POST',
        body: JSON.stringify({
          user: v.username,
          follow: !this.state.follow
        }),
        headers: {
          "X-CSRFToken": csrftoken
        }
      }).then(response => {
        if (response.status == 200) {
          this.setState(state => ({
            followers: state.follow ? state.followers - 1 : state.followers + 1,
            follow: !state.follow
          }));
        }
      });
    });

    this.state = {
      followers: v.followersCount,
      following: v.following,
      follow: v.follow
    };
  }

  render() {
    if (v.isme) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, v.username), "Followers: ", this.state.followers, /*#__PURE__*/React.createElement("br", null), "Following: ", this.state.following, /*#__PURE__*/React.createElement("br", null));
    }

    if (this.state.follow) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, v.username), "Followers: ", this.state.followers, /*#__PURE__*/React.createElement("br", null), "Following: ", this.state.following, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
        onClick: this.updateFollow,
        class: "btn-sm btn btn-danger"
      }, " Unfollow "));
    } else {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, v.username), "Followers: ", this.state.followers, /*#__PURE__*/React.createElement("br", null), "Following: ", this.state.following, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
        onClick: this.updateFollow,
        class: "btn btn-sm btn-success"
      }, " Follow "));
    }
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(Follow, null), document.querySelector('#follow'));

/* Source React */
// const data = document.getElementById('user-data');
// const value = JSON.parse(data.textContent);
// data.parentNode.removeChild(data);

// class Follow extends React.Component {

// constructor(props) {
//   super(props);
//   this.state = {
//   followers: value.followersCount,
//   following: value.following,
//   follow: value.follow,
//   }
// }

// render() {
//   if (value.isme) {
//       return (
//           <div>
//               <h1>{value.username}</h1>
//               Followers: {this.state.followers}
//               <br />
//               Following: {this.state.following}
//               <br />
//           </div>)
//   }
//   if (this.state.follow) {
//       return (
//           <div>
//               <h1>{value.username}</h1>
//               Followers: {this.state.followers}
//               <br />
//               Following: {this.state.following}
//               <br />
//               <button onClick={this.updateFollow} class="btn-sm btn btn-danger"> Unfollow </button>
//           </div>
//       )
//   }
//   else {
//       return (
//           <div>
//               <h1>{value.username}</h1>
//               Followers: {this.state.followers}
//               <br />
//               Following: {this.state.following}
//               <br />
//               <button onClick={this.updateFollow} class="btn btn btn-success"> Follow </button>
//           </div>
//       )
//   }
// }

// updateFollow = () => {
//   let csrftoken = getCookie('csrftoken');
//   fetch('/follow', {
//       method: 'POST',
//       body: JSON.stringify({
//           user: value.username,
//           follow: !this.state.follow,
//       }),
//       headers: { "X-CSRFToken": csrftoken },
//   })
//   .then(response => {
//   if (response.status == 200) {
//       this.setState(state => ({
//       followers: state.follow ? state.followers - 1 : state.followers + 1,
//       follow: !state.follow,
//       }));
//   }
//   });
// }
// }

// ReactDOM.render(<Follow />, document.querySelector('#follow'));