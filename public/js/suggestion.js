
class Suggestion extends React.Component {
    constructor(props) {
      super(props);
      this.redirect = this.redirect.bind(this);
    }

    redirect() {
        console.log("Hey there!");
    }
  
    render() {
  
      return (
        <li class="media p-3 suggestion border" onClick={this.redirect}>
            <img class="mr-3" src="/i/mov_bbb.jpg" alt="..." />
            <div class="media-body">
                <b>Lorem ipsum dolor sit amet</b>
                <br/>
                <small class="text-muted">VideoAuthor123 &nbsp;&bull;&nbsp; 17,2M views</small>
            </div>
        </li>
      );
    }
}

const loader = document.querySelector('#recommendations');
ReactDOM.render(<ul class="list-unstyled">
        <Suggestion />
        <Suggestion />
        <Suggestion />
        <Suggestion />
        <Suggestion />
        <Suggestion />
        <Suggestion />
        <Suggestion />
    </ul>, loader);