import React, { PropTypes, Component } from 'react';
import styles from './circleImage.scss';
import classnames from 'classnames';
import BrokenImage from '../../../common/svg/brokenImage.svg';

/**
 * CircleImage component
 */
class CircleImage extends Component {
  constructor() {
    super();

    this.state = {
      imageBroken: false
    };
  }

  componentWillMount() {
    const src = this.props.src;
    if (!src) {
      this.setState({ imageBroken: true });
    }

    let image = new Image();
    image.src = src;

    image.onerror = () => {
      this.setState({ imageBroken: true });
    };
  }

  render() {
    const { src, alt, className, onClick } = this.props;

    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${src})`
          }}
          role="img"
          aria-label={alt}
          onClick={onClick}
          className={classnames(className || '', styles.circle)}
        >
          {this.state.imageBroken
            ? <span className={styles.brokenImageContainer}>
                <BrokenImage
                  width="50"
                  height="50"
                  className={styles.brokenImage}
                />
              </span>
            : null}
        </div>
      </div>
    );
  }
}

CircleImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default CircleImage;
