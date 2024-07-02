// plugins/ExamplePlugin.js
const ExamplePlugin = {
    name: "ExamplePlugin",
    version: "1.0.0",
    init: () => {
      console.log("ExamplePlugin initialized");
    },
    render: () => {
      return <div>Example Plugin Content</div>;
    },
  };
  
  export default ExamplePlugin;