import React, { Component } from 'react';
import './Cards.css';

class Cards extends Component {
    constructor() {
        super();
        this.state = {
            uploading: false
        };
        this.likeClick = this.likeClick.bind(this);
        this.editClick = this.editClick.bind(this);
    }

    likeClick() {
        console.log("clicked");
        this.props.likeFun(this.props.data.key);
    }

    editClick = async () => {
        console.log("here");
        console.log(this.props.data.key);
        try {
            this.setState({ uploading: true });
            let { image } = this.state;
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: "LABEL_DETECTION", maxResults: 10 },
                            { type: "IMAGE_PROPERTIES", maxResults: 5 }
                        ],
                        image: {
                            source: {
                                imageUri: this.props.data.image_link
                            }
                        }
                    }
                ]
            });
            let response = await fetch(
                "https://vision.googleapis.com/v1/images:annotate?key=" + "AIzaSyBPcmNnZ0B35pE_nKAiamTyyJEpD0aP5bI",
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: body
                }
            );
            let responseJson = await response.json();
            console.log(responseJson);
            this.setState({
                googleResponse: responseJson,
                uploading: false
            });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const name = (this.props.data.item_name ? this.props.data.item_name : "unknown").substring(0, 20)
        const price = this.props.data.price ? this.props.data.price : "unknown"
        const store = this.props.data.store ? this.props.data.store : "unknown"
        var heartColor = null;
        var editButton = (
            <button className="like-button-grey"
                onClick={this.editClick}>
                <i className="fa fa-edit"></i>
            </button>
        );
        if (this.props.likes) {
            if (this.props.likes.includes(this.props.data.key)) {
                heartColor = (<button className="like-button-pink"
                    onClick={this.likeClick}>
                    <i className="fa fa-heart"></i>
                </button>)
            } else {
                heartColor = (<button className="like-button-grey"
                    onClick={this.likeClick}>
                    <i className="fa fa-heart"></i>
                </button>)
            }
        }
        else if (this.props.likesPage) {
            heartColor = (<button className="like-button-pink"
                onClick={this.likeClick}>
                <i className="fa fa-heart"></i>
            </button>)
        }
        else {
            heartColor = (<button className="like-button-grey"
                onClick={this.likeClick}>
                <i className="fa fa-heart"></i>
            </button>)
        }
        return (
            <div className="cards container">
                <img className="card-image" height="300" width="310" src={this.props.data.image_link} />
                <div className="middle">
                    <div className="text">{store}</div>
                </div>
                <div className="bottom-left">{name}</div>
                <div className="bottom-right">${price}</div>
                <div className="top-right">
                    {heartColor}
                </div>

            </div>
        );
    }
}

export default Cards;
