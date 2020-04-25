class NotLoadingAnymore extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
        return (
            <div style={{display: "none"}}></div>
        );
    }
}

const loader = document.querySelector('#Loader');
ReactDOM.render(e(NotLoadingAnymore), loader);