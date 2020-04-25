
class NotLoadingAnymore extends React.Component {
    constructor(props) {
        super(props);
        this.state = { seconds: 0, id: (Math.random()+"").substr(2) };
    }

    timeSince(date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
          return interval + " year" + (interval == 1 ? "" : "s") + " ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          return interval + " month" + (interval == 1 ? "" : "s") + " ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          return interval + " day" + (interval == 1 ? "" : "s") + " ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          return interval + " hour" + (interval == 1 ? "" : "s") + " ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
          return interval + " minute" + (interval == 1 ? "" : "s") + " ago";
        }
        if (seconds >= 1) {
            return Math.floor(seconds) + " second" + (seconds == 1 ? "" : "s") + " ago";
        }
        return "just now";
    }

    tick() {
        if($('#notif-' + this.state.id + ".hide").length != 0) {
            this.componentWillUnmount();
        } else {
            this.setState(state => ({
                seconds: state.seconds + 1
            }));
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 5000);
        $('#notif-' + this.state.id).toast('show');
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
  
    render() {
        return (
            <div id={"notif-" + this.state.id} class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">
                <div class="toast-header bg-light">
                    <img src="..." class="rounded mr-2" alt="..."/>
                    <strong class="mr-auto">{this.props.title}</strong>
                    <small class="text-muted">{this.timeSince(this.props.time)}</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    {this.props.body}
                </div>
            </div>
        );
    }
}

const loader = document.querySelector('#notifs');
ReactDOM.render((<span>
    <NotLoadingAnymore title="Hello!" time={new Date()} body="This is a test message."/>
    <NotLoadingAnymore title="Hello 2!" time={new Date()} body="This is a second test message."/>
    </span>), loader);
