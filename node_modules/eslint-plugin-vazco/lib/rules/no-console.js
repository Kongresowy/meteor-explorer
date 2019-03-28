/**
 * @fileoverview Rule to flag use of console object
 * @author Michal Wanat
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow the use of `console`",
            category: "Possible Errors",
            recommended: true
        },

        schema: [
            {
                type: "object",
                properties: {
                    disallow: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        minItems: 1,
                        uniqueItems: true
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        return {

            MemberExpression(node) {

                if (node.object.name === "console") {
                    let blockConsole = false;
                    const passedProperty = node.property.name;

                    if (context.options.length > 0) {
                        const disallowedProperties = context.options[0].disallow;
                        const propertyIsDisallowed = (disallowedProperties.indexOf(passedProperty) > -1);

                        if (propertyIsDisallowed) {
                            blockConsole = true;
                        }
                    }

                    if (blockConsole) {
                        context.report(node, "Unexpected console statement: " + passedProperty);
                    }
                }
            }
        };
    }
};
