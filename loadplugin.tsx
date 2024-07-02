
export const loadPlugin = async (pluginId: string): Promise<any> => {
    try {
      // Fetch plugin data from API
      const res = await fetch(`http://localhost:4008/data/${pluginId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch plugin: ${res.status} ${res.statusText}`);
      }
      const plugin = await res.json() as IPlugin;
  
      let pluginModule;
  
      if (plugin.path.startsWith('https://')) {
        // Remote plugin from URL
        console.log(plugin.path)
        const resPlugin = await fetch(plugin.path);
        const jsxContent = await resPlugin.text();
        console.log(jsxContent)
        // Transpile JSX to JavaScript
        const transpiledCode = transpileJSX(jsxContent);
  
        console.log(transpiledCode)
  
        // Execute transpiled code to obtain the plugin module
        const pluginFunction = new Function('React', `
          ${transpiledCode}
          return ExamplePlugin
        `);
  
        // Pass React into the function
        pluginModule = pluginFunction(React);
      } else {
        // Local plugin
        const module = await import(`../${plugin.path}`);
        pluginModule = module.default;
      }
      return pluginModule;
  
    } catch (error) {
      console.error("Error loading plugin:", error);
      throw error;
    }
  };
  
  // Function to transpile JSX to JavaScript
  export const transpileJSX = (jsxContent: string): string => {
    try {
      const transpiledCode = jsxContent
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
        .replace(/export\s+(default\s+)?(?!class)(\w+)/g, '') // Remove export statement
        .replace(/<(\w+)([^>]*)>((.|\n)*?)<\/\1>|<(\w+)([^>]*)\/?>/g, (match, tagName1, attrs1, children1, tagName2, attrs2) => {
          const tagName = tagName1 || tagName2;
          const attrs = attrs1 || attrs2 || '';
          const attributes = parseAttributes(attrs);
          let children = children1 ? children1.trim() : null;
  
          if (children === null) {
            return `React.createElement("${tagName}", ${attributes})`;
          } else {
            // Check if children contain other child JSX elements
            if (children.match(/<(\w+)([^>]*)>((.|\n)*?)<\/\1>|<(\w+)([^>]*)\/?>/)) {
              children = transpileJSX(children); // Recursively transpile nested JSX elements
            } else {
              children = `"${children}"`;
            }
            return `React.createElement("${tagName}", ${attributes}, ${children})`;
          }
        })
        .replace(/\)\s+React.createElement\(/g, '),\n      React.createElement('); // Ensure proper formatting with commas
  
      return transpiledCode;
    } catch (error) {
      console.error("Error transpiling JSX:", error);
      throw error;
    }
  };
  
  const parseAttributes = (attrs: string): string => {
    const attributes = {};
    attrs.replace(/(\w+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)\s*/g, (match, attr) => {
      if (attr) {
        const [name, value] = attr.split('=');
        attributes[name.trim()] = value ? value.trim().replace(/^['"]|['"]$/g, '') : true;
      }
      return '';
    });
  
    return JSON.stringify(attributes);
  };