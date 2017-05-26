import React from 'react';
import PropTypes from 'prop-types';
import createChildRoot from 'react-child-root';
import uniqueId from 'lodash/uniqueId';

export default class ChildWindow extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        title: PropTypes.string.isRequired,
    };

    render() {
        // do not render anything in our parent component
        return false;
    }

    /**
     * Copies the stylesheet links from the parent window to the child window
     */
    copyStyleSheets(doc) {
        const links = document.getElementsByTagName('link');
        for (let i = 0; i < links.length; ++i) {
            const link = links[i];
            if (link.rel === 'stylesheet') {
                var thestyle = doc.createElement('link');
                var attribs = link.attributes;
                for (let j = 0; j < attribs.length; ++j) {
                    const {nodeName, nodeValue} = attribs[j];
                    let value = nodeValue;
                    thestyle.setAttribute(nodeName, value);
                }

                doc.documentElement.appendChild(thestyle);
            }
        }
    }

    renderWindowContents(children, title) {
        const wnd = this._window;
        if (wnd) {
            const doc = wnd.document;
            this.copyStyleSheets(doc);

            // Create an element inside the child window that will hold the React children
            const root = doc.createElement("div");
            doc.body.innerHTML = "";
            doc.body.appendChild(root);
            this.setTitle(title);

            // Create the child React root to render inside
            this._childRoot = createChildRoot(this, root, children);
        }
    }

    componentDidMount() {
        const {children, title} = this.props;
        this._window = window.open("", uniqueId("win"), "close=no,scrollbars,resizable,dependent,height=400,width=400");
        this.renderWindowContents(children, title);
    }

    componentDidUpdate() {
        if (this._window) {
            const {children, title} = this.props;

            // Update the content in our childRoot
            this._childRoot.update(children);
            this.setTitle(title);
        }
    }

    setTitle(title) {
        this._window.document.title = title;
    }

    componentWillUnmount() {
        if (this._window) {
            // destroy our child root
            this._childRoot.dispose();

            // destroy the Window
            this._window.close();

            this._window = undefined;
        }
    }
}
