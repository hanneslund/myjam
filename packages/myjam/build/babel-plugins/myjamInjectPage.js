module.exports = function myjamInjectPage(_, { pagePath }) {
  return {
    visitor: {
      ImportDeclaration({ node: { source } }) {
        if (source.value === "__myjam_inject_page__") {
          source.value = pagePath;
        }
      },
    },
  };
};
