import invariant from 'invariant';
import omitBy from 'lodash/omitBy';

const CHECK = process.env.NODE_ENV !== "production";

export default function getParentContext(componentInstance) {
    // Get the context from the React parent (undocumented)
    if (CHECK) {
        invariant(componentInstance._reactInternalInstance,
            "componentInstance._reactInternalInstance not available!  " +
            "Perhaps the React context implementation has changed?");
        invariant(componentInstance._reactInternalInstance._context,
            "componentInstance._reactInternalInstance._context not available!  " +
            "Perhaps the React context implementation has changed?");
    }

    const context = componentInstance._reactInternalInstance._context;

    // strip out anything from the context that has an _.  Thats private internal context from React
    const strippedContext = omitBy(context, (v, k) => k[0] === "_");
    return strippedContext;
}
