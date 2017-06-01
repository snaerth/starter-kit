import React, { PropTypes } from 'react';
import MainHeading from '../mainheading';

const Banner = ({ text }) => {
  return (
    <div className="container">
      <MainHeading text={text} />
    </div>
  );
};

Banner.propTypes = {
  text: PropTypes.string
};

export default Banner;
