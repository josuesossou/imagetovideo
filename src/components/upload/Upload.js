import React from 'react';
import ReactDOM from 'react-dom';
import logo from "../../logo.svg";
import {Tesseract} from "tesseract.ts";
import { Slide, Zoom } from 'react-slideshow-image';

export default class Upload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            img: null
        }
    }

    async getFile(e) {
        const files = e.target.files
        console.log(files);

        const tesseractRead = await Tesseract.recognize(files[0]).progress(console.log("123..."));

        console.log(files);
        const filesArray = Object.values(files);
        const images = []

        console.log(filesArray);
        // filesArray.forEach(file => {
        //     urlArray.push(
        //         URL.creatObjectURL(file)
        //     )
        // })

        // const reader = new FileReader();
        filesArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = () => {
                // this.setState({
                //     img: reader.result
                // })
                images.push(reader.result);
                this.setState({
                    images,
                })
                // console.log(url, 'url')
            }
        })

        console.log();

        // localStorage.setItem('images',)
    }
    render() {
        const zoomOutProperties = {
            duration: 5000,
            transitionDuration: 500,
            infinite: true,
            indicators: false,
            scale: 1,
            arrows: false
        }
        return (
            <div>
                <h2>Upload Images to create a movie</h2>
                <button>press to upload</button>
                {/* <img src={logo}/> */}
                <input type="file" name="Upload" multiple onChange={(e) => this.getFile(e)}/>

                <div>
                <Zoom {...zoomOutProperties}>
                    {
                        this.state.images.map((each, index) => {
                            return (
                                <div style={{height: 500, with: "100%"}} >
                                    <img key={index} style={{height: "100%"}} src={each} />
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

