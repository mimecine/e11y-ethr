const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const path = require("path");
const Image = require("@11ty/eleventy-img");


module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

//  eleventyConfig.addDataExtension("yml", contents => yaml.safeLoad(contents));

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  async function imageShortcode(src, alt, classes, sizes) {
    let metadata = await Image('./src/' + src, {
      widths: [300, 600 ],
      outputDir: "./_site/static/img/",
      urlPath: "/static/img/",
  //    formats: ["webp","jpeg"],
      formats: ["jpeg"],
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
  
        return `${name}-${width}w.${format}`;
      }
    });
  
    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      class: classes
    };
  
    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes, { whitespaceMode: "inline" });
  }

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);



  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.load(contents)
  );

  // Add Tailwind Output CSS as Watch Target
  eleventyConfig.addWatchTarget("./_tmp/static/css/style.css");

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/github-CNAME":"./CNAME",
    "./_tmp/static/css/style.css": "./static/css/style.css",
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
    "./node_modules/reveal.js/dist/reveal.js":"./static/js/reveal.js",
    "./node_modules/reveal.js/dist/reset.css":"./static/css/reset.css",
    "./node_modules/reveal.js/dist/reveal.css":"./static/css/reveal.css",
    "./node_modules/reveal.js/dist/theme/":"./static/css/theme",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Shortcodes
  eleventyConfig.addShortcode("version", function () {
                return String(Date.now());
  });
  eleventyConfig.addShortcode("contains", function (str, sub) {
                return String(str).indexOf(sub) != -1;
  });
  eleventyConfig.addFilter("xslug", function (str) {
                return String(str).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/,'');
  });


  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
