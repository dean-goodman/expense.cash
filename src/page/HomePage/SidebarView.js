import React from 'react';
import {View} from 'react-native';
import _ from 'underscore';
import styles from '../../style/StyleSheet';
import WithStoreSubscribeToState from '../../components/WithStoreSubscribeToState';
import STOREKEYS from '../../store/STOREKEYS';
import {fetchAll} from '../../store/actions/ReportActions';
import SidebarLink from './SidebarLink';

class SidebarView extends React.Component {
    render() {
        const reports = this.state && this.state.reports;
        return (
            <View style={[styles.flexGrow1, styles.p1]}>
                {_.map(reports, report => (
                    <SidebarLink key={report.reportID} reportID={report.reportID} reportName={report.reportName} />
                ))}
            </View>
        );
    }
}

export default WithStoreSubscribeToState({
    reports: {key: STOREKEYS.REPORTS, loader: fetchAll},
})(SidebarView);
