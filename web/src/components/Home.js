import React from "react";
import logo from "./shortLogo.png";
import qImg from "./qss.png";
//AIzaSyB4ccVNZXw8KZFWzAmju_6ZDQ_kTFOhMcg
class Home extends React.Component {
  state = {
    raw: "",
    current: "",
    gUrl: "",
    iUrl: "",
    message: "Begin query to see results below.",
    eKeys: "",
    time: 5,
    currentIndex: 0,
    pause: false,
  };
  onQueryChange(e) {
    this.setState({ raw: e.target.value });
  }
  onKeyChange(e) {
    this.setState({ eKeys: e.target.value });
  }
  onTimeChange(e) {
    this.setState({ time: e.target.value });
  }
  onIndexChange(e) {
    this.setState({ currentIndex: e.target.value });
  }
  handleStop() {
    this.setState({ pause: true, message: "pausing..." });
  }
  handleStart() {
    let sanitizeData = (input) => {
      return new Promise((resolve, reject) => {
        if (this.state.eKeys.length > 0) {
          var searchPhrase =
            input.trim().split(" ").join("+") +
            "+" +
            this.state.eKeys.trim().split(" ").join("+");
          resolve(searchPhrase);
        } else {
          var searchPhrase = input.trim().split(" ").join("+");
          resolve(searchPhrase);
        }
      });
    };
    let updateState = (sanitized) => {
      return new Promise((resolve, reject) => {
        this.setState({
          current: sanitized,
          disabled: true,
          pause: false,
          message: "searching...",
        });
      });
    };
    let updateStateFail = () => {
      return new Promise((resolve, reject) => {
        this.setState({
          message: "Index out of bounds, reset starting row num.",
        });
      });
    };
    let executeSearch = (searchPhrase) => {
      return new Promise((resolve, reject) => {
        this.setState({
          gUrl:
            "https://www.google.com/search?igu=1&ei=&q=" + this.state.current,
          iUrl: "https://www.bing.com/images/search?q=" + this.state.current,
        });
        // console.log(this.state.current);
        // resolve(searchPhrase);
      });
    };

    var sanitized = this.state.raw.split(/\r?\n/);
    var i = parseInt(this.state.currentIndex);
    if (this.state.currentIndex >= sanitized.length) {
      return updateStateFail();
    }
    let loop = () => {
      return new Promise((resolve, reject) => {
        try {
          sanitizeData(sanitized[this.state.currentIndex])
            .then((searchPhrase) => {
              updateState(searchPhrase);
            })
            .then(() => {
              executeSearch();
            })
            .then(() => {
              return this.setState({
                currentIndex: parseInt(this.state.currentIndex) + 1,
              });
            });
        } catch (err) {
          console.log("skipped invalid line");
        }
        setTimeout(() => {
          if (
            this.state.pause != true &&
            this.state.currentIndex < sanitized.length
          ) {
            resolve(loop());
          } else {
            resolve();
          }
        }, this.state.time * 1000);
      });
    };
    loop()
      .then(() => {
        console.log("done");
      })
      .then(() => {
        return this.setState({
          message: "Searching Complete",
          current: "",
          disabled: false,
        });
      });
    // for (var i = 0; i < sanitized.length; i++) {
    //   sanitizeData(sanitized[i])
    //     .then((searchPhrase) => {
    //       updateState(searchPhrase);
    //     })
    //     .then((data) => {
    //       executeSearch(data);
    //     })
    //     .then(() => {
    //       console.log("joe");
    //       delay(2000);
    //       console.log("jay");
    //     });
    // }
  }
  render() {
    return (
      <div>
        <img src={logo} className="logoImg" alt="logo" />
        <a
          href="https://youtu.be/0OZk5uGWZLM"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={qImg} className="qImg" alt="logo" />
        </a>

        <h1 className="emailTxt">
          for questions or to report bugs contact: simonm@uchicago.edu
        </h1>

        <div className="topDiv">
          <div className="marginDiv">
            <div className="form">
              <div className="leftForm">
                <p className="formInputTxt">
                  Extra words to add to each search.
                </p>
                <input
                  disabled={this.state.disabled ? "disabled" : ""}
                  placeholder="keys"
                  className="keyInput"
                  onChange={this.onKeyChange.bind(this)}
                  value={this.state.eKeys}
                ></input>
                <p className="formInputTxt">
                  How many seconds between each search.
                </p>
                <input
                  disabled={this.state.disabled ? "disabled" : ""}
                  placeholder="seconds"
                  className="timeInput"
                  type="number"
                  onChange={this.onTimeChange.bind(this)}
                  value={this.state.time}
                ></input>
                <p className="formInputTxt">What row to start at.</p>
                <input
                  disabled={this.state.disabled ? "disabled" : ""}
                  placeholder="start at"
                  className="startInput"
                  type="number"
                  onChange={this.onIndexChange.bind(this)}
                  value={this.state.currentIndex}
                ></input>
              </div>
              <div className="rightForm">
                <p className="formInputTxt">Search terms</p>
                <textarea
                  disabled={this.state.disabled ? "disabled" : ""}
                  onChange={this.onQueryChange.bind(this)}
                  name="Text1"
                  value={this.state.raw}
                ></textarea>
              </div>
            </div>

            <button onClick={() => this.handleStart()}>Begin Search</button>
            <button onClick={() => this.handleStop()}>Pause Search</button>
            <br />
            <code className="searchingTxt">
              currently searching: {this.state.current}
            </code>
            <p className="messageTxt">⋘ {this.state.message} ⋙</p>
            {/* <div className="messageDiv">
              <p className="messageTxt">{this.state.message}</p>
            </div> */}
          </div>
        </div>

        <div className="row">
          <div id="frameDiv" className="wrap">
            <iframe
              frameborder="0"
              name="X-Frame-Options"
              value="SAMEORIGIN"
              className="frame"
              src={this.state.gUrl}
            ></iframe>
          </div>
          <div id="frameDiv" className="right">
            <iframe
              frameborder="0"
              name="X-Frame-Options"
              value="SAMEORIGIN"
              className="frameB"
              src={this.state.iUrl}
            ></iframe>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
