'use strict';

$(function () {
    //$('[data-toggle="tooltip"]').tooltip()
    $(document).tooltip({
        selector: '.ttr',
        placement: 'right'
    });
    $(document.body).tooltip({
        selector: '.ttl',
        placement: 'left'
    });

    $('body').on('click', function (e) {
        $('[data-toggle=popover-emotes]').each(function () {
            // hide any open popovers when the anywhere else in the body is clicked
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $('[data-toggle="popover"]').popover()

    $('.toast').toast('show')
})

const e = React.createElement;

class Reactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { starred: false, reactions: this.props.reactions };
    this.toggleStar = this.toggleStar.bind(this);
    this.toggleEmote = this.toggleEmote.bind(this);
  }

  toggleStar() {
      this.setState({starred: !this.state.starred});
  }

  componentDidMount() {
    $("#btnemotes_" + this.props.id).popover({content: $("#emotes_" + this.props.id)})
    $('[rel=tooltip]').tooltip({ trigger: "hover" });
  }

  toggleEmote(e) {
      e.preventDefault();
      var emote = e.currentTarget.dataset.emote;
      var newstate = this.state;
      newstate.reactions[emote] = !this.state.reactions[emote]
      this.setState(newstate);

      $.ajax('/api/reactions/' + ctxId + "/" + this.props.id, {
        method: "POST",
        data: JSON.stringify({emote: emote, toggle: newstate.reactions[emote]}),
        contentType: "application/json"
      });
  }

  render() {

    $('[data-toggle="tooltip"]').tooltip("hide");

    var hasReacted = false;
    for (var val in this.state.reactions) {
        hasReacted = hasReacted || this.state.reactions[val];
    }

    return (
        <div id={"actions_" + this.props.id} style={{display: "inline-block", ["padding-left"]: "15px"}}>
            <button id={"btnemotes_" + this.props.id} type="button" class="btn btn-light" data-toggle="popover-emotes" data-container="body" data-html="true" data-placement="right">
                { hasReacted ? <i class="fas fa-heart"></i> : <i class="far fa-heart"></i> }
            </button>
            <button type="button" class="btn btn-light">
                <i class="fas fa-reply fa-flip-horizontal"></i>
            </button>
            <button type="button" class="btn btn-light" onClick={this.toggleStar}>
                {this.state.starred ? <i class="fas fa-star"></i> : <i class="far fa-star"></i> }
            </button>
            <button type="button" class="btn btn-light">
                <i class="far fa-flag"></i>
            </button>
            <div style={{display: "none"}}>
                <div id={"emotes_" + this.props.id}>
                    <a href='#' onClick={this.toggleEmote} data-emote="funny" class='ttl tticon' data-toggle='tooltip' data-placement='left' title='Haha!'><i class={'fa' + (this.state.reactions.funny ? "s" : "r") + ' fa-grin-squint-tears'}></i></a>
                    <a href='#' onClick={this.toggleEmote} data-emote="sad" class='ttr tticon' data-toggle='tooltip' data-placement='right' title='Sorry'><i class={'fa' + (this.state.reactions.sad ? "s" : "r") + ' fa-sad-tear'}></i></a>
                    <br />
                    <a href='#' onClick={this.toggleEmote} data-emote="love" class='ttl tticon' data-toggle='tooltip' data-placement='left' title='Wholesome!'><i class={'fa' + (this.state.reactions.love ? "s" : "r") + ' fa-grin-hearts'}></i></a>
                    <a href='#' onClick={this.toggleEmote} data-emote="angry" class='ttr tticon' data-toggle='tooltip' data-placement='right' title='Annoying...'><i class={'fa' + (this.state.reactions.angry ? "s" : "r") + ' fa-angry'}></i></a>
                    <br />
                    <a href='#' onClick={this.toggleEmote} data-emote="like" class='ttl tticon' data-toggle='tooltip' data-placement='left' title='I agree'><i class={'fa' + (this.state.reactions.like ? "s" : "r") + ' fa-thumbs-up'}></i></a>
                    <a href='#' onClick={this.toggleEmote} data-emote="dislike" class='ttr tticon' data-toggle='tooltip' data-placement='right' title='I disagree'><i class={'fa' + (this.state.reactions.dislike ? "s" : "r") + ' fa-thumbs-down'}></i></a>
                    <br />
                    <a href='#' onClick={this.toggleEmote} data-emote="hmm" class='ttl tticon' data-toggle='tooltip' data-placement='left' title='Thought-provoking'><i class={'fa' + (this.state.reactions.hmm ? "s" : "r") + ' fa-question-circle'}></i></a>
                    <a href='#' onClick={this.toggleEmote} data-emote="meh" class='ttr tticon' data-toggle='tooltip' data-placement='right' title='Boring...'><i class={'fa' + (this.state.reactions.meh ? "s" : "r") + ' fa-meh'}></i></a>
                    <br />
                    <a href='#' onClick={this.toggleEmote} data-emote="wtf" class='ttl tticon' data-toggle='tooltip' data-placement='left' title='What the...'><i class={'fa' + (this.state.reactions.wtf ? "s" : "r") + ' fa-flushed'}></i></a>
                    <a href='#' onClick={this.toggleEmote} data-emote="kidding" class='ttr tticon' data-toggle='tooltip' data-placement='right' title='Not serious'><i class={'fa' + (this.state.reactions.kidding ? "s" : "r") + ' fa-grin-tongue-squint'}></i></a>
                </div>
            </div>
        </div>
    );
  } // <a href='#' class='ttr tticon' data-toggle='tooltip' data-placement='right' title='Yeah, yeah...'><i class='far fa-meh-rolling-eyes'></i></a>
}


class Comment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={"comment_" + this.props.messageid} class="card-body">
                <div class="media">
                    <img src="..." class="mr-3" alt="..."/>
                    <div class="media-body">
                    <h5 class="mt-0">{this.props.title}<Reactions id={this.props.messageid} reactions={this.props.reactions}/></h5>
                    {this.props.content}
                    </div>
                </div>
            </div>
        );
    }
}

class HR extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
  
      return (
        <hr style={{"margin-top":"0","margin-bottom":"0"}} />
      );
    }
}

const react = document.querySelector('#comments');
var i = 0;
var commentList = (<p>Loading...</p>)
$.ajax('/api/comments/' + ctxId, {method: "GET", success: ((data) => {
        commentList = 
                (<div class="card">
                    {data.map((val, key) => {
                        //i++;
                        return (<span><Comment messageid={val.id} title={val.author} content={val.content} reactions={ (val["reactions"] != undefined) ? val["reactions"][me] || {} : {} }/><HR/></span>);
                    })}
                    <small class="text-muted p-3 text-center">That's it.</small>
                </div>)

        ReactDOM.render(commentList, react);

    }), error: ((a, b, c, d) => {
        commentList = (<p>Whoops, something went wrong...</p>)

        ReactDOM.render(commentList, react);
    })
})

function sendComment() {
    $.ajax({
        url: '/api/comments/' + ctxId,
        type: "POST",
        data: JSON.stringify({content: $('#newComment').val()}),
        contentType: "application/json",
    });
    var myElem = $("<div id='myComment' class='rounded border shadow mt-3 mb-3'></div>");
    myElem.insertBefore('#comments');
    ReactDOM.render(<Comment messageid={++i} title="My comment" content={$('#newComment').val()} reactions={{}}/>, document.querySelector('#myComment'));
    $('#addComment').reset();
}

$("#postComment").click(sendComment);
