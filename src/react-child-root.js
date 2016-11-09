import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import getParentContext from './getParentContext';
import createRootComponent from './createRootComponent';

function renderElement(Root, content, instance, container) {
    const context = getParentContext(instance);
    const props = {context, content};
    const element = React.createElement(Root, props);
    render(element, container);
}

export default function createChildRoot(parentReactComponentInstance, element, reactContent) {
    // this will be what we render in $element with reactChildElement as its content
    const Root = createRootComponent();

    // do the first render
    renderElement(Root, reactContent, parentReactComponentInstance, element);

    // return an update and a destroy method
    return {
        update(reactContent) {
            renderElement(Root, reactContent, parentReactComponentInstance, element);
        },
        dispose() {
            unmountComponentAtNode(element);
        }
    };
}
