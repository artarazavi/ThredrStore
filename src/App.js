import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import Cards from './Cards/Cards';


class App extends Component {
  constructor() {
    super();
    this.state = {
      clothes: [],
      likes: [],
      tags: [],
      pageHome: true,
      pageLikes: false,
      pageReccomend: false,
    };
    this.snapshotToArray = this.snapshotToArray.bind(this);
    this.snapshotToArrayLikes = this.snapshotToArrayLikes.bind(this);
    this.likeAccumulate = this.likeAccumulate.bind(this);
    this.updateStateLikes = this.updateStateLikes.bind(this);
    this.updateStateHome = this.updateStateHome.bind(this);
    this.updateStateReccomend = this.updateStateReccomend.bind(this);
  }
  snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };

  snapshotToArrayLikes(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      returnArr.push(item);
    });

    return returnArr;
  };

  componentDidMount() {
    const rootRef = firebase.database().ref().child("items");
    rootRef.on('value', snap => {
      this.setState({ clothes: this.snapshotToArray(snap) });
    });
    const tagsRef = firebase.database().ref().child("labels");
    tagsRef.on('value', snap => {
      this.setState({ tags: this.snapshotToArray(snap) });
    });
  }

  likeAccumulate(key) {
    console.log(key);
    console.log(key);
    const likesRef = firebase.database().ref().child("users/1/likes");
    var oldLikes = [];
    likesRef.on('value', snap => {
      oldLikes = this.snapshotToArrayLikes(snap);
    });
    console.log(oldLikes);
    if (oldLikes.includes(key.toString())) {
      oldLikes = oldLikes.filter(function (item) {
        return item !== (key.toString());
      })
    } else {
      oldLikes.push(key.toString());
    }
    console.log(oldLikes);
    firebase.database().ref().child("users/1").set(
      {
        "likes": oldLikes
      }
    ).then(() => {
      console.log("updated");
    }).catch((error) => {
      console.log("error");
    });
    this.setState({ likes: oldLikes });
  }

  updateStateLikes() {
    this.setState({
      pageLikes: true,
      pageHome: false,
      pageReccomend: false
    });
  }
  updateStateHome() {
    this.setState({
      pageLikes: false,
      pageHome: true,
      pageReccomend: false
    });
  }

  updateStateReccomend() {
    this.setState({
      pageLikes: false,
      pageHome: false,
      pageReccomend: true
    });
  }


  render() {
    var populate = [];
    const likesRef = firebase.database().ref().child("users/1/likes");
    var allLikes = [];
    likesRef.on('value', snap => {
      allLikes = this.snapshotToArrayLikes(snap);
    });
    if (this.state.pageHome) {
      populate = this.state.clothes.map((clothes, index) => {
        return (<Cards key={index} data={clothes} likes={allLikes} likeFun={this.likeAccumulate} />);
      });
    }
    if (this.state.pageLikes) {
      populate = allLikes.map((like, index) => {
        return (<Cards key={index} likesPage={true} data={this.state.clothes[(like - 1)]} likeFun={this.likeAccumulate} />);
      });
    }
    if (this.state.pageReccomend) {
      var tagsArray = allLikes.map((like, index) => {
        return (this.state.tags[(like - 1)]);
      });
      const tagsArrayFlat = [...new Set(tagsArray.flat())];
      var tupples = this.state.tags.map((tags, index) => {
        return [index + 1, (tags.filter(value => -1 !== tagsArrayFlat.indexOf(value)))];
      });
      var newtupples = tupples.filter((tupple) => {
        return (tupple[1].length > 6);
      });
      var tupplekeys = newtupples.map((tupple) => {
        return tupple[0].toString();
      });
      let difference = tupplekeys.filter(x => !allLikes.includes(x));
      populate = difference.map((like, index) => {
        return (<Cards key={index} data={this.state.clothes[(like - 1)]} likeFun={this.likeAccumulate} />);
      });
    }
    return (
      <div>
        <h1 className="page-titel">Thredr Store</h1>
        <nav className="navbar">
          <div>
            <button onClick={this.updateStateHome} className="navbutton">Discover  <i className="fa fa-search"></i></button>
            <button onClick={this.updateStateLikes} className="navbutton">Likes  <i className="fa fa-heart"></i></button>
            <button onClick={this.updateStateReccomend} className="navbutton">Reccomended  <i className="fa fa-shopping-cart"></i></button>
          </div>
        </nav>
        <div className="cards-container">
          {populate}
        </div>
      </div>
    );
  }
}

export default App;
