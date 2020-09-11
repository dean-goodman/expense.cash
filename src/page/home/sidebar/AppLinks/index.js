import React from 'react';
import {Platform} from 'react-native';

import styles from '../../../../style/StyleSheet';
import openURLInNewTab from '../../../../lib/openURLInNewTab';
import Text from '../../../../components/Text';

const AppLinks = () => (
    <>
        {Platform.OS === 'web' && (
            <Text
                style={[styles.sidebarFooterLink, styles.mr2]}
                onPress={() => openURLInNewTab('https://chat.expensify.com/Chat.dmg')}
            >
                Desktop
            </Text>
        )}
        {Platform.OS !== 'web' && (
            <Text
                style={[styles.sidebarFooterLink, style.mr2]}
                onPress={() => openURLInNewTab('https://chat.expensify.com')}
            >
                Web
            </Text>
        )}
        <Text
            style={[styles.sidebarFooterLink, styles.mr2]}
            onPress={() => openURLInNewTab('https://testflight.apple.com/join/ucuXr4g5')}
        >
            iOS
        </Text>
        <Text
            style={[styles.sidebarFooterLink, styles.mr2]}
            onPress={() => openURLInNewTab('https://play.google.com/apps/internaltest/4700657970395613233')}
        >
            Android
        </Text>
    </>
);

export default AppLinks;
