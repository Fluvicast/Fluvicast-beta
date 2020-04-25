
class VideoVignette extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        return (
            <div class="content-instance">
                <div class="img">
                    <div class="d-flex align-items-center align-content-around">
                        <div class="mx-auto">
                            <button><i class="fas fa-play"></i></button>
                            <button><i class="fas fa-tools"></i></button>
                        </div>
                    </div>
                </div>
                <p class="p-2"><b>{this.props.title}</b></p>
            </div>
        );
    }
}

/*
const dashboard = document.querySelector('#dashboard-content');
for (var i = 0; i < 10; i++) {
    var node = document.createElement("div");
    ReactDOM.render((<VideoVignette title="Lorem Ipsum" />), node);
    dashboard.appendChild(node.firstChild);
}
*/