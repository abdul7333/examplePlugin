// plugins/ExamplePlugin.js
const ExamplePlugin = {
    name: "ExamplePlugin",
    version: "1.0.0",
    init: () => {
      console.log("ExamplePlugin initialized");
    },
    render: () => {
      return <h1>Example Plugin Content</h1>;
    },
  };
  
  export default ExamplePlugin;