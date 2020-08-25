import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../../style/StyleSheet';
import SidebarBottom from './SidebarBottom';
import SidebarLinks from './SidebarLinks';
import SafeAreaInsetPropTypes from '../../SafeAreaInsetPropTypes';

const propTypes = {
    // Toggles the hamburger menu open and closed
    onLinkClick: PropTypes.func.isRequired,

    // Safe area insets required for mobile devices margins
    insets: SafeAreaInsetPropTypes.isRequired,
};

const SidebarView = ({insets, onLinkClick}) => (
    <View style={[styles.flex1, styles.sidebar]}>
        <SidebarLinks onLinkClick={onLinkClick} />
        <SidebarBottom insets={insets} />
    </View>
);

SidebarView.propTypes = propTypes;

export default SidebarView;
