import React from 'react';
import PropTypes from 'prop-types';
import mapValues from 'lodash/mapValues';

/**
 * Creates a component which can act as the root node of the new render context.
 * @returns {Root}
 */
export default function createRootComponent() {
    class Root extends React.Component {
        static propTypes = {
            context: PropTypes.object,
            content: PropTypes.node,
        };

        static childContextTypes = {};

        state = { childContext: {} };

        getChildContext() {
            return this.state.childContext;
        }

        updateContext(context) {
            this.setState({ childContext: context });

            // Update childContextTypes
            Root.childContextTypes = mapValues(context, x => PropTypes.any);
        }

        componentWillMount() {
            this.updateContext(this.props.context);
        }

        componentWillReceiveProps(nextProps) {
            this.updateContext(nextProps.context);
        }

        render () {
            return this.props.content;
        }
    }

    return Root;
}
