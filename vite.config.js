// vite.config.js
export default {
  build: {},
  plugins: [
    {
      name: "html-inject-data-preload-attr",
      enforce: "post",
      transformIndexHtml(html) {
        const regex = /<(script.+crossorigin\b)/gi;
        const replacement = "<$1 inline";

        return html.replace(regex, replacement);
      },
    },
  ],
};
