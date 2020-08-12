/**
 * This is a higher order component that provides the ability to map a state property directly to
 * something in Ion (a key/value store). That way, as soon as data in Ion changes, the state will be set and the view
 * will automatically change to reflect the new data.
 */
import React from 'react';
import _ from 'underscore';
import get from 'lodash.get';
import has from 'lodash.has';
import Ion from '../lib/Ion';

export default function (mapIonToState) {
    return WrappedComponent => class WithIon extends React.Component {
        constructor(props) {
            super(props);

            this.connectionIDs = {};
            this.connectionIDsWithPropsData = {};

            // Initialize the state with each of the property names from the mapping
            this.state = _.reduce(_.keys(mapIonToState), (finalResult, propertyName) => ({
                ...finalResult,
                [propertyName]: null,
            }), {});
        }

        componentDidMount() {
            // Subscribe each of the state properties to the proper store key
            _.each(mapIonToState, (mapping, propertyName) => {
                this.connectSingleMappingToIon(mapping, propertyName, this.wrappedComponent);
            });
        }

        componentDidUpdate(prevProps) {
            // If any of the mappings use data from the props, then when the props change, all the
            // connections need to be rebound with the new props
            _.each(mapIonToState, (mapping, propertyName) => {
                if (has(mapping, 'pathForProps')) {
                    const prevPropsData = get(prevProps, mapping.pathForProps);
                    const currentPropsData = get(this.props, mapping.pathForProps);
                    if (prevPropsData !== currentPropsData) {
                        Ion.disconnect(this.connectionIDsWithPropsData[mapping.pathForProps]);
                        this.connectSingleMappingToIon(mapping, propertyName, this.wrappedComponent);
                    }
                }
            });
        }

        componentWillUnmount() {
            this.disconnect();
        }

        /**
         * Takes a single mapping and binds the state of the component to the store
         *
         * @param {object} mapping
         * @param {string} statePropertyName
         * @param {object} reactComponent
         */
        connectSingleMappingToIon(mapping, statePropertyName, reactComponent) {
            // Bind to the store and keep track of the connectionID
            if (mapping.pathForProps) {
                // If there is a path for props data, then the data needs to be pulled out of props and parsed
                // into the key
                const dataFromProps = get(this.props, mapping.pathForProps);
                const keyWithPropsData = mapping.key.replace('%DATAFROMPROPS%', dataFromProps);
                const mappingConfig = {
                    keyPattern: keyWithPropsData,
                    path: mapping.path,
                    defaultValue: mapping.defaultValue,
                    addAsCollection: mapping.addAsCollection,
                    collectionId: mapping.collectionId,
                    statePropertyName,
                    reactComponent,
                };
                const connectionID = Ion.connect(mappingConfig);

                // Store the connectionID it with a key that is unique to the data coming from the props
                this.connectionIDsWithPropsData[mapping.pathForProps] = connectionID;
            } else {
                const mappingConfig = {
                    keyPattern: mapping.key,
                    path: mapping.path,
                    defaultValue: mapping.defaultValue,
                    addAsCollection: mapping.addAsCollection,
                    collectionId: mapping.collectionId,
                    statePropertyName,
                    reactComponent
                };
                const connectionID = Ion.connect(mappingConfig);
                this.connectionIDs[connectionID] = connectionID;
            }

            // Pre-fill the state with any data already in the store
            if (mapping.prefillWithKey) {
                let prefillKey = mapping.prefillWithKey;

                // If there is a path for props data, then the data needs to be pulled out of props and parsed
                // into the key
                if (mapping.pathForProps) {
                    const dataFromProps = get(this.props, mapping.pathForProps);
                    prefillKey = mapping.prefillWithKey.replace('%DATAFROMPROPS%', dataFromProps);
                }

                Ion.get(prefillKey, mapping.path, mapping.defaultValue)
                    .then(data => reactComponent.setState({[mapping.statePropertyName]: data}));
            }

            // Load the data from an API request if necessary
            if (mapping.loader) {
                const paramsForLoaderFunction = _.map(mapping.loaderParams, (loaderParam) => {
                    // Some params might com from the props data
                    if (loaderParam === '%DATAFROMPROPS%') {
                        return get(this.props, mapping.pathForProps);
                    }
                    return loaderParam;
                });
                mapping.loader(...paramsForLoaderFunction || []);
            }
        }

        /**
         * Disconnect everything from Ion
         */
        disconnect() {
            _.each(this.connectionIDs, Ion.disconnect);
            _.each(this.connectionIDsWithPropsData, Ion.disconnect);
        }

        render() {
            // Spreading props and state is necessary in an HOC where the data cannot be predicted
            return (
                <WrappedComponent
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...this.props}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...this.state}
                    ref={el => this.wrappedComponent = el}
                />
            );
        }
    };
}
