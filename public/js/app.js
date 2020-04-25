'use strict';

const e = React.createElement;

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0, max: 7 };
    this.addToLoad = this.addToLoad.bind(this);
  }

  addToLoad(ev) {
    this.setState(state => ({
      value: state.value + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.addToLoad(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={this.state.value} aria-valuemin="0" aria-valuemax={this.state.max} style={{width: this.state.value / this.state.max * 100 + "%"}}></div>
      </div>
    );
  }
}


const domContainer = document.querySelector('#loading');
ReactDOM.render(e(ProgressBar), domContainer);