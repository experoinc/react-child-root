**Note: this library is obsolete with the release of the [React Portals API](https://reactjs.org/docs/portals.html).  Use that API instead of this library unless you are using an old version of React which pre-dates the Portals API.**

# react-child-root

Creates a new child React rendering context within any DOM element you wish.  This new rendering context acts as a child of the parent React rendering context.

This essentially lets you render child React components in areas of your page that are outside your root React component.  All information flows from the parent components to the child components through `props` and `context` like normal.  And information flows from child components back to parent components through prop `callbacks`.

## How is this different than React Gateway?

[React Gateway](https://github.com/cloudflare/react-gateway) also creates a new React context to redirect child rendering elsewhere in the page.  However, React Gateway requires that the new rendering location is somewhere else within the same React root.  Gateway doesn't allow you to seemlessly hop your React rendering across non-React boundaries.

## Demo

[View](https://rawgit.com/experoinc/react-child-root/master/dist/example.html) the Demo.

[View](https://github.com/experoinc/react-child-root/tree/master/src/example) the demo code.

# Uses

## Integrate with 3rd party widgets

Let's say you are building a React application and you want to use [jQuery UI Dialog](https://jqueryui.com/dialog/) widget.  That widget does not know anything about React and would be unable to render your React Children elements.  Once you use React to render your container element and then give this element to jQuery, you are forced to use jQuery to render the dialog contents.

In other words, you'd like to be able to do something like this:

```jsx
class JQDialog extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        // render a DIV which will be our dialog and render our children inside it
        return <div>{this.props.children}</div>;
    }

    componentDidMount() {
        const {children, ...options} = this.props;
        // turn the DIV into a jQuery dialog
        $(findDOMNode(this)).dialog(options);
    }
}


// some component's render method:
return (
    <JQDialog>
        <div>Hello, {this.props.name}</div>
        <button onClick={this.props.onClose}>close me</button>
    </JQDialog>
);
```

But that does not work:

jQuery Dialog actually moves the DIV you give it to some other location in the document.  It also inserts some extra DOM elements to render the dialog UI.  When your component updates, React will not be able to find the root element and even if it did, it would find a bunch of extra HTML that it did not expect. And so you'll get some errors.

`react-child-root` can be used to solve that problem.  We can use it to improve our `JQDialog` component to intercept React renders and "jump" into the Dialog's container element to continue the React rendering of the children.

See the [demo](https://rawgit.com/experoinc/react-child-root/master/dist/example.html).

## Render in child windows

You can create browser popup windows that behave as if they were part of your React hierarchy.  See the [demo](https://rawgit.com/experoinc/react-child-root/master/dist/example.html).

# Installation

Using npm:

```
npm install react-child-root --save
```

# Usage

First import the library

```es6
import createChildRoot from 'react-child-root';
```

Next, in your parent component, when you know the DOM element you wish to render inside of, you do:

```es6
const child = createChildRoot(this, containerDOMElement, children);
```

Where:

* `this` is the parent React component that is creating a child rendering context
* `containerDOMElement` is the DOM element inside which you wish to render the children.
* `children` is the React children you wish to initially render

Usually you will do this in `componentDidMount`.

Next, whenever the child content or your context data changes, you do:

```es6
child.update(children);
```

Where:

* `children` is the new React children to render

Usually you will do this in `componentDidUpdate`.

Finally, whenever you wish to destroy the child rendering context, you do:

```es6
child.dispose();
```

Usually you will do this in `componentWillUnmount`.

Here's a complete example:

```diff
  import React, {PropTypes} from 'react';
  import {findDOMNode} from 'react-dom';
  import {renderToStaticMarkup} from 'react-dom/server';
  import $ from 'jquery';
+ import createChildRoot from 'react-child-root';

  class RenderAtBottomOfDocument extends React.Component {
    render() {
        // render nothing inside our parent
        return false;
    }
    componentDidMount() {
        // create a DIV and append it to the root document
        this._div = document.createElement("div");
        document.body.appendChild(this._div);

        // render our React children inside of it
+       this._child = createChildRoot(this, this._div, this.props.children);
    }
    componentDidUpdate() {
        // update our children
+       this._child.update(this.props.children);
    }
    componentWillUnmount() {
        // destroy our child
+       this._child.dispose();
        this._div.remove();
    }
  }

  // elsewhere inside some other component's render method:
  <RenderAtBottomOfDocument>
     <div>
         <div>Hello {this.props.name}!</div>
         <button onClick={this.props.onClose}>close me</button>
     </div>
  </RenderAtBottomOfDocument>
```
