import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import $ from 'jquery';
import './example.scss';
import JQDialog from './JQDialog';
import ChildWindow from './ChildWindow';

class InfoPanel extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        numDialogs: PropTypes.number.isRequired,
        numPopups: PropTypes.number.isRequired,
        onClose: PropTypes.func,
    };

    render() {
        const {name, numDialogs, numPopups, onClose} = this.props;

        return (
            <div>
                <h2>{name}</h2>
                <p>There are currently {numDialogs} jQuery dialogs and {numPopups} popup windows</p>
                {onClose && <button type="button" onClick={onClose}>Close {name}</button>}
            </div>
        );
    }
}

let nextId = 1;

class Example extends React.Component {
    state = {
        dialogs: [],
        windows: [],
    };

    onNewJQueryDialog = () => {
        const name = `jquery dialog ${nextId++}`;
        const newDialogs = [...this.state.dialogs, name];
        this.setState({dialogs: newDialogs});
    };

    onNewWindow = () => {
        const name = `child window ${nextId++}`;
        const newDialogs = [...this.state.windows, name];
        this.setState({windows: newDialogs});
    };

    onCloseItem = (name, group) => {
        const g = this.state[group];
        const i = g.indexOf(name);
        if (i !== -1) {
            const newg = g.slice();
            newg.splice(i, 1);
            this.setState({ [group]: newg });
        }
    };

    renderDialog = name => {
        const onClose = () => this.onCloseItem(name, "dialogs");
        return (
            <JQDialog key={name} open title={name}>
                <InfoPanel
                    name={name}
                    numDialogs={this.state.dialogs.length}
                    numPopups={this.state.windows.length}
                    onClose={onClose}
                />
            </JQDialog>
        );
    };

    renderWindow = name => {
        const onClose = () => this.onCloseItem(name, "windows");
        return (
            <ChildWindow key={name} open title={name}>
                <InfoPanel
                    name={name}
                    numDialogs={this.state.dialogs.length}
                    numPopups={this.state.windows.length}
                    onClose={onClose}
                />
            </ChildWindow>
        );
    };

    render() {
        const {dialogs, windows} = this.state;
        return (
            <div>
                <h1>react-child-root Demo</h1>
                <p>
                    This demo shows how you can use react-child-root to create React rendering roots that are not direct
                    descendants of React-rendered DOM elements, yet still behave as child React components.
                </p>
                <p>
                    Clicking on the JQuery Dialog button will render
                    a <a href="https://jqueryui.com/dialog/">JQuery UI Dialog</a>.  jQuery owns the DOM within the
                    dialog element, yet we are able to establish a new React render root within the dialog contents
                    and render continue to render our React content within the dialog.
                </p>
                <p>
                    There are currently {dialogs.length} jQuery dialogs and {windows.length} popup windows
                </p>
                <p>
                    <button type="button" onClick={this.onNewJQueryDialog}>
                        Create JQuery Dialog
                    </button>
                </p>
                <p>
                    <button type="button" onClick={this.onNewWindow}>
                        Create popup window
                    </button>
                    <em>(remember to allow popups in your browser)</em>
                    <br />
                    <strong>Note: popup window demo does not work in IE</strong>
                </p>

                {dialogs.map(this.renderDialog)}
                {windows.map(this.renderWindow)}
            </div>
        );
    }
}

$(() => {
    render(<Example />, document.getElementById("root"));
});
