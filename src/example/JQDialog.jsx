import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import {renderToStaticMarkup} from 'react-dom/server';
import $ from 'jquery';
import createChildRoot from 'react-child-root';

export default class JQDialog extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        // just render an empty div.
        return <div></div>;
    }

    componentDidMount() {
        const {children, ...options} = this.props;

        // Insert a DIV inside our React-rendered div.  We will use give this new DIV to jQuery to use
        const rootElement = <div></div>;
        const rootElementMarkup = renderToStaticMarkup(rootElement);
        this.$rootElement = $(rootElementMarkup).appendTo($(findDOMNode(this)));

        // Create the window
        options.autoOpen = true;
        this.$rootElement.dialog(options);

        // Create the child react root
        this._childRoot = createChildRoot(this, this.$rootElement[0], children);
    }

    componentDidUpdate() {
        /*eslint no-unused-vars: 0 */
        const {children, ...options} = this.props;

        // Update the content in our childRoot
        this._childRoot.update(children);

        // apply the changed options
        this.$rootElement.dialog("option", options);
    }

    componentWillUnmount() {
        // destroy our child root
        this._childRoot.dispose();

        // destroy the Window
        this.$rootElement.dialog("destroy");
    }
}
