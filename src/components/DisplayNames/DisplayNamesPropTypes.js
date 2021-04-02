import PropTypes from 'prop-types';

const propTypes = {
    // The full title of the DisplayNames component (not split up)
    fullTitle: PropTypes.string,

    // Array of objects that map display names to their corresponding tooltip
    displayNameToTooltipMap: PropTypes.object,

    // Number of lines before wrapping
    numberOfLines: PropTypes.number,

    // Is tooltip needed?
    // When true, triggers complex title rendering
    tooltipEnabled: PropTypes.bool,

    // Arbitrary styles of the displayName text
    textStyle: PropTypes.arrayOf(PropTypes.any),
};

const defaultProps = {
    numberOfLines: 1,
    tooltipEnabled: false,
    titleStyles: [],
};

export {propTypes, defaultProps};
