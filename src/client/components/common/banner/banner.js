import React from 'react';
import PropTypes from 'prop-types';
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
