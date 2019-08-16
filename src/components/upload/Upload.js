import React from 'react';
import {Tesseract} from "tesseract.ts";
import { Slide, Zoom } from 'react-slideshow-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import Speech from 'speak-tts'
import './upload.css'

export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.speech = new Speech() // will throw an exception if not browser supported

        this.state = {
            videoData: [],
            numberOfFiles: null,
            pause: false,
            play: false,
        }
    }

    componentWillMount() {
        if(this.speech.hasBrowserSupport()) { // returns a boolean
            console.log("speech synthesis supported")
        }
        const options = {
            'volume': 1,
            'lang': 'en-GB',
            'rate': 1,
            'pitch': 1,
            'voice':'Google UK English Male',
            'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices) => {
                    console.log("Event voiceschanged", voices)
                }
            }
        }
        this.speech.init(options).then((data) => {
            // The "data" object contains the list of available voices and the voice synthesis params
            console.log("Speech is ready, voices are available", data)
        }).catch(e => {
            console.error("An error occured while initializing : ", e)
        })
    }
    play() {
        this.setState((prev) => ({
            play: !prev.play
        }))
    }

    pause() {
        this.setState((prev) => ({
            pause: !prev.pause
        }))
    }

    async getFile(e) {
        const files = e.target.files
        const filesArray = Object.values(files);
        const videoData = [];

        const _ = this;

        this.setState({
            numberOfFiles: filesArray.length
        })

        filesArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = async () => {
                Tesseract.recognize(file).progress(console.log("123..."))
                .then((words) => {
                    videoData.push({
                        image: reader.result,
                        words,
                    });
                    if (videoData.length === filesArray.length) {
                        console.log(videoData, 'videoData');
                        _.setState({
                            videoData
                        })
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
            }
        })
        console.log();
    }
    render() {
        const zoomOutProperties = {
            duration: 5000,
            transitionDuration: 500,
            infinite: false,
            indicators: false,
            scale: 1,
            autoplay: true,
            arrows: false,
            onChange: (o, newIndex) => {
                this.speech.speak({
                    text: this.state.videoData[newIndex].words.text,
                }).then(() => {
                    console.log("Success !")
                }).catch(e => {
                    console.error("An error occurred :", e)
                })
            }
        }
        return (
            <div>
                <h2>Upload Images to create a movie</h2>
                {/* <img src={logo}/> */}
                <label className="labelWrapper">
                    <FontAwesomeIcon icon={faUpload} size="10x" color="#aaaaaa"/> <br />
                    <input type="file" name="Upload" multiple onChange={(e) => this.getFile(e)} />
                    {this.state.numberOfFiles ? (
                        <span>{this.state.numberOfFiles} Uploaded</span>
                    ) : null}
                </label>
                <div>
                    <Zoom {...zoomOutProperties}>
                        {
                            this.state.videoData.map((each, index) => {
                                return (
                                    <div key={index} style={{height: 500, with: "100%"}} >
                                        <img  style={{height: "100%"}} src={each.image} />
                                        {/* <button onClick={this.play()}>play</button> */}
                                    </div>
                                )
                            })
                        }
                    </Zoom>
                </div>
            </div>
        )
    }
}

