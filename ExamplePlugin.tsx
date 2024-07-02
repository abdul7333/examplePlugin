// plugins/ExamplePlugin.js
const ExamplePlugin = {
    name: "ExamplePlugin",
    version: "1.0.0",
    init: () => {
      console.log("ExamplePlugin initialized");
    },
    render: () => {
      return <div>
        <h1>Example Plugin Content</h1>
        <p>Content Para<strong>content</strong></p>
      </div>
    },
  };
  
  export default ExamplePlugin;