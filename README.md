
[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm](https://img.shields.io/npm/v/@hlovdal/node-red-display-property.svg)](https://www.npmjs.com/package/@hlovdal/node-red-display-property)
[![downloads](https://img.shields.io/npm/dt/@hlovdal/node-red-display-property.svg)](https://www.npmjs.com/package/@hlovdal/node-red-display-property)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hlovdal/node-red-display-property/blob/main/LICENSE)

This is a fork of the
[original repository](https://github.com/PeterAustria/node-red-contrib-display-property)
which no longer seems to be maintained.

# @hlovdal/node-red-display-property

A simple node that displays as its status the value of a message property that passes the node.
Optional it can be configured to also show the date and/or the time when the message passed.
The intention of this node is to give you a better overview of the messages that pass your flows and support you debugging your flows by easily displaying the content of massage properties.

## Quick Start

Install from your <b>Node-RED Manage Palette</b> or using npm:

```shell
npm install @hlovdal/node-red-display-property
```

## Example

![Node-red example flow screenshot](https://github.com/hlovdal/node-red-display-property/blob/4a4e487997028c0d852c3ed32bb8afc4f4054679/doc/img/example1.png?raw=true)

```json
[{"id":"9a2098e26d45c777","type":"inject","z":"7fe7fa4eeb8bc36e","name":"JSON data","props":[{"p":"data","v":"{\"id\":\"light-12345\",\"type\":\"light\",\"timestamp\":1748648445,\"attributes\":{\"name\":\"Living room light\",\"brightness\":75}}","vt":"json"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":540,"y":500,"wires":[["3c18736cd0888ec6"]]},{"id":"3c18736cd0888ec6","type":"display property","z":"7fe7fa4eeb8bc36e","name":"msg.data.attributes.brightness","property":"msg.data.attributes.brightness","showDate":true,"showTime":true,"x":800,"y":500,"wires":[["22540bb1a20bde39"]]},{"id":"22540bb1a20bde39","type":"debug","z":"7fe7fa4eeb8bc36e","name":"debug 1","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":1060,"y":500,"wires":[]}]
```

It will gracefully handle attempting to display properties that do not exist:

![Non-existing property example](https://github.com/hlovdal/node-red-display-property/blob/e5b0330fc3e6d43c0ed68745faa2a75420132d8f/doc/img/example2.png?raw=true)

## Help

This documentation is also available in the help section of the node.
This node accepts any massage at the input and passes exactly the same massage to the output.
It can be configured to display the content of a certain property (default is <code>msg.payload</code>) of the message that passes the node. This content will be <b>displayed as the status</b> of the node along the the date and/or time when it passed.
My intention for creating this little node was to get a better overview of what values running through my nodes without the need to put debug nodes everywhere. So this can also be handy for debugging your flows by displaying the content of massages property.

### Two options to display the value of a property

You can either provide the name of the property you want to display <b>in the configuration of the node</b> or you can <b>pass the name of the property</b> you want to display as <code>msg.property</code> to the node.

To display for example the content of <b>msg.topic</b> you have two options:

1. add <b>msg.topic</b> as the property in the <b>configuration</b> of the node, or
2. pass a message with <code>msg.property</code> and content <b>msg.topic</b> to the node.

No need to mention that you can also display any other properties :-)

### What else should you know about this node?

If you pass a <code>msg.property</code>, this will override the settings in the node-configuration.
If the message does not have a property, either configured in the node or passed via <code>msg.property</code>, the content of <code>msg.payload</code> (the default) will be displayed instead.

## Bugs and feature requests

Please report any issues or enhancement requests at
[GitHub](https://github.com/hlovdal/node-red-display-property/issues).

## Development

You want to have a go at modifying the code? Awesome! For the time being there
is no explicit build command, so just edit files directly.

### Pre-commit

To keep formatting of files in good shape, please install [pre-commit](https://pre-commit.com/)

```bash
python -m venv venv
source venv/bin/activate         # non-windows machines
source venv/Scripts/activate     # windows machines
pip install --upgrade pip        # Optional
pip install pre-commit
```

Verify that the tool is working:

```bash
pre-commit run --all-files
```

And then install pre-commit as a
[git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks):

```bash
pre-commit install --allow-missing-config
```
