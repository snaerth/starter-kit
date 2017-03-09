import React, { PropTypes, Component } from 'react';
import ReactCrop from 'react-image-crop';
import s from './imageCrop.scss';

/**
 * ImageCrop component
 */
class ImageCrop extends Component {
    render() {
        const {handleSubmit, errorMessage} = this.props;

        const crop = {
            x: 20,
            y: 10,
            width: 30,
            height: 10
        }

        return (
            <div>
               <ReactCrop src={this.props.image.preview} crop={crop} />
            </div>
        );
    }
}

export default connect()(ImageCrop);
